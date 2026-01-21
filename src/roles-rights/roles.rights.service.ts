import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppRights, AppRole, AppRoleRight } from './roles.rights.entity';
import { CreateRoleWithRightsDto } from './RolesRights.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class RolesRightsService {
  constructor(
    @InjectRepository(AppRoleRight)
    private readonly roleRightRepo: Repository<AppRoleRight>,
    @InjectRepository(AppRole)
    private readonly roleRepo: Repository<AppRole>,
    @InjectRepository(AppRights)
    private readonly rightRepo: Repository<AppRights>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {

  }

  async createRoleWithRights(dto: CreateRoleWithRightsDto, createdBy: string): Promise<{ name: string; rightIds: number[] }> {
    const { name, rightIds } = dto;

    const existingRole = await this.roleRepo.findOne({ where: { name } });
    if (existingRole) {
      throw new ConflictException(`Role with name '${name}' already exists.`);
    }

    // Create Role
    const role = this.roleRepo.create({
      name,
      createdBy,
      updatedBy: createdBy
    });

    const savedRole = await this.roleRepo.save(role);

    const rights = await this.rightRepo
      .createQueryBuilder('r')
      .where('r.id IN (:...rightIds)', { rightIds })
      .getMany();

    const roleRights = rights.map((right) =>
      this.roleRightRepo.create({
        roleId: savedRole.id,
        rightId: right.id,
        createdBy,
        updatedBy: createdBy,
      }),
    );

    await this.roleRightRepo.save(roleRights);

    return {
      name: savedRole.name,
      rightIds: rights.map(r => r.id),
    };
  }

  async getAllRolesRights(): Promise<{ id: number; name: string; rightIds: number[] }[]> {
    const roles = await this.roleRepo.find({
      where: { deletedOn: null },
    });

    const result = [];

    for (const role of roles) {
      const rights = await this.roleRightRepo.find({
        where: { roleId: role.id },  // Fetch rights for each role
        relations: ['right'],
      });

      const rightIds = rights.map(r => r.rightId);

      result.push({
        id: role.id,
        name: role.name,
        rightIds: rightIds,
      });
    }

    return result;
  }

  async getRoleWithRightsById(roleId: number): Promise<{ id: number; name: string; rightIds: number[] }> {
    const role = await this.roleRepo.findOne({
      where: { id: roleId, deletedOn: null },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const rights = await this.roleRightRepo.find({
      where: { roleId },
      relations: ['right'],
    });

    const rightIds = rights.map(r => r.rightId);

    return {
      id: role.id,
      name: role.name,
      rightIds,
    };
  }


  async deleteRoleWithRights(roleId: number): Promise<void> {
    const role = await this.roleRepo.findOne({ where: { id: roleId, deletedOn: null } });

    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    // Check if any users are associated with this role
    const usersWithRole = await this.userRepo.find({ 
      where: { roleId: roleId } 
    });

    if (usersWithRole.length > 0) {
      throw new ConflictException(
        `Cannot delete role '${role.name}' because it is associated with ${usersWithRole.length} user(s). Please reassign or remove users from this role first.`
      );
    }

    // Soft delete associated rights first (if using soft delete)
    await this.roleRightRepo.softDelete({ roleId });

    // Then soft delete the role
    await this.roleRepo.softDelete(roleId);
  }


  async updateRoleWithRights(
    roleId: number,
    name: string,
    rightIds: number[],
    updatedBy: string
  ) {
    const role = await this.roleRepo.findOne({ where: { id: roleId, deletedOn: null } });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const existingRole = await this.roleRepo.findOne({
      where: { name, deletedOn: null },
    });

    if (existingRole && existingRole.id !== roleId) {
      throw new ConflictException(`Role with name '${name}' already exists.`);
    }

    role.name = name;
    role.updatedBy = updatedBy;
    await this.roleRepo.save(role);

    // Delete existing rights
    await this.roleRightRepo.delete({ roleId });

    // Reassign new rights
    const newRights = rightIds.map((rightId) =>
      this.roleRightRepo.create({
        roleId,
        rightId,
        createdBy: updatedBy,
      })
    );

    await this.roleRightRepo.save(newRights);

    return {
      roleId,
      name,
      rightIds,
    };
  }

  async getAssignedRights(roleId: number): Promise<Array<{ group: string; permissions: Array<{ id: number; name: string }> }>> {

    const roleWithRights = await this.getRoleWithRightsById(roleId);
    const rightIds = roleWithRights?.rightIds ?? [];

    if (rightIds.length === 0) {
      return [];
    }

    const uniqueRightIds = [...new Set(rightIds)];

    const rights = await this.rightRepo
      .createQueryBuilder('r')
      .where('r.id IN (:...ids)', { ids: uniqueRightIds })
      .andWhere('r.deletedOn IS NULL')
      .orderBy('r.name', 'ASC')
      .getMany();
    const rightsMap = new Map(rights.map((right) => [right.id, right]));

    const permissions: Array<{ id: number; name: string; group_by: string }> = uniqueRightIds.map((id) => {
      const right = rightsMap.get(id);
      if (!right) {
        throw new Error(`Right with ID ${id} not found.`);
      }

      return {
        id: right.id,
        name: right.name,
        group_by: right.group_by,
      };
    });

    const grouped = permissions.reduce<Record<string, { group: string; permissions: Array<{ id: number; name: string }> }>>((acc, { id, name, group_by }) => {
      if (!acc[group_by]) {
        acc[group_by] = {
          group: group_by,
          permissions: [],
        };
      }

      acc[group_by].permissions.push({ id, name });
      return acc;
    }, {});

    const groupedPermissions = Object.values(grouped);

    groupedPermissions.sort((a, b) => a.group.localeCompare(b.group));
    groupedPermissions.forEach((group) =>
      group.permissions.sort((a, b) => a.name.localeCompare(b.name))
    );

    return groupedPermissions;
  }

}
