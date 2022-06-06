import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { UserLoginInput } from '../input/user-login.input';
import { JwtObject } from '../object/jwt.object';
import { UserRoleEnum } from '../enum/user-role.enum';
import { GqlUser } from '../auth/graphql-current-user.decorator';
import { AuthUser } from '../auth/auth-user';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { GqlRolesGuard, Roles } from '../auth/gql-role.guard';
import { AuthUserObject } from '../object/auth-user.object';
import { randomUUID } from 'crypto';

@Resolver(() => JwtObject)
export class AuthResolver {
  constructor(private jwtService: JwtService) {}

  @Mutation(() => JwtObject)
  public async loginUser(
    @Args('loginUser') loginUser: UserLoginInput,
  ): Promise<JwtObject> {
    const payload: AuthUser = {
      userId: randomUUID(),
      role: UserRoleEnum.DRIVER,
    };
    const jwtToken = {
      accessToken: this.jwtService.sign(payload),
    };

    return new JwtObject({
      accessToken: jwtToken.accessToken,
    });
  }

  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles(UserRoleEnum.DRIVER)
  @Query(() => AuthUserObject)
  me(@GqlUser() gqlUser: AuthUser): AuthUserObject {
    return new AuthUserObject({
      userId: gqlUser.userId,
      role: gqlUser.role,
    });
  }
}
