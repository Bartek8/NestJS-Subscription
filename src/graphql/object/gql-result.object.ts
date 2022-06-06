import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GqlResultObject {
  private constructor(result: boolean) {
    this.result = result;
  }

  @Field(() => Boolean)
  private readonly result: boolean;

  public static ok(): GqlResultObject {
    return new GqlResultObject(true);
  }

  public static nok(): GqlResultObject {
    return new GqlResultObject(false);
  }
}
