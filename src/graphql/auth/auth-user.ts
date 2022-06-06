import { UserRoleEnum } from '../enum/user-role.enum';

export interface IAuthUser {
  readonly userId: string;
  readonly role: UserRoleEnum;
}

export class AuthUser implements IAuthUser {
  public readonly userId: string;
  public readonly role: UserRoleEnum;
}
