export interface JwtPayload {
  sub: number;
  email: string;
  roleId: number;
  isActive: boolean;
}

export interface CurrentUserData {
  userId: number;
  email: string;
  roleId: number;
  isActive: boolean;
}
