import { Field, ObjectType } from '@nestjs/graphql';
import { IAuthUser } from '../auth/auth-user';
import { UserRoleEnum } from '../enum/user-role.enum';
import { BaseDto } from '../dto/base.dto';

@ObjectType()
export class AuthUserObject
  extends BaseDto<AuthUserObject>
  implements IAuthUser
{
  @Field(() => String)
  readonly userId: string;

  @Field(() => UserRoleEnum)
  readonly role: UserRoleEnum;
}
