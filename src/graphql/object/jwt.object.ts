import { Field, ObjectType } from '@nestjs/graphql';
import { BaseDto } from '../dto/base.dto';

@ObjectType()
export class JwtObject extends BaseDto<JwtObject> {
  @Field()
  accessToken: string;
}
