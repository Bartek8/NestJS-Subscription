import { Field, ObjectType } from '@nestjs/graphql';
import { BaseDto } from '../base.dto';

@ObjectType()
export class JwtObject extends BaseDto<JwtObject> {
  @Field()
  accessToken: string;
}
