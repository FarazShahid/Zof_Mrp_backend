import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClientsService {

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}
  create(createClientDto: CreateClientDto) {
    return this.clientRepository.save({
      ...createClientDto,
      CreatedOn: String(new Date()),
    });
  }

  findAll() {
    return this.clientRepository.find();
  }

  findOne(Id: number) {
    return this.clientRepository.findOneBy({ Id })
  }

  update(Id: number, updateClientDto: UpdateClientDto) {
    return this.clientRepository.update(Id, updateClientDto);
  }

  remove(Id: number) {
    return this.clientRepository.delete(Id);
  }

}
