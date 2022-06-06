import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { GqlRolesGuard, Roles } from '../auth/gql-role.guard';
import { PUB_SUB } from '../pubsub/pubsub.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Inject, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { GqlResultObject } from '../object/gql-result.object';
import { UserRoleEnum } from '../enum/user-role.enum';
import { GqlUser } from '../auth/graphql-current-user.decorator';
import { AuthUser } from '../auth/auth-user';
import { DELIVERY_SUBSCRIPTION_EVENTS } from '../subscription/delivery-subscription-events.enum';
import { IdArgs } from '../args/id.args';
import { PubSub } from 'graphql-subscriptions';

@UseGuards(GqlAuthGuard, GqlRolesGuard)
@Resolver(() => GqlResultObject)
export class DeliveryResolver {
  pubSub = new PubSub();

  // constructor(@Inject(PUB_SUB) private readonly pubSub: RedisPubSub) {}

  @Roles(UserRoleEnum.DRIVER)
  @Mutation(() => GqlResultObject)
  async pickUpDelivery(): Promise<GqlResultObject> {
    const deliveryPickedUp = GqlResultObject.ok();
    this.pubSub.publish(DELIVERY_SUBSCRIPTION_EVENTS.deliveryPickedUp, {
      deliveryPickedUp,
    });
    return GqlResultObject.ok();
  }

  // Code first approach
  // @Subscription((returns) => GqlResultObject, {
  //   filter: (payload, variables, context) => {
  //     console.log(payload);
  //     return payload;
  //   },
  // })
  // Schema first approach
  @Subscription()
  deliveryPickedUp(): AsyncIterator<any> {
    return this.pubSub.asyncIterator(
      DELIVERY_SUBSCRIPTION_EVENTS.deliveryPickedUp,
    );
  }
}
