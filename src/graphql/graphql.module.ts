import { Module } from '@nestjs/common';
import { GraphQLModule, registerEnumType } from '@nestjs/graphql';
import {
  ApolloDriver,
  ApolloDriverAsyncConfig,
  ApolloDriverConfig,
} from '@nestjs/apollo';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ContextFunction,
  Context,
} from 'apollo-server-core';
import { UserRoleEnum } from './enum/user-role.enum';
import { PubsubModule } from './pubsub/pubsub.module';
import { gqlResolvers } from './resolver';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';

registerEnumType(UserRoleEnum, { name: 'UserRoleEnum' });

@Module({
  imports: [
    PubsubModule,
    PassportModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '365d' },
    }),
    // ApolloDriverConfig | any - onConnect comes in 2 different formats
    GraphQLModule.forRootAsync<ApolloDriverConfig | any>({
      driver: ApolloDriver,
      useFactory: () => {
        return {
          // Schema first approach
          // typePaths: ['./**/*.gql'],

          // Code first approach
          autoSchemaFile: true,

          playground: false,
          plugins: [ApolloServerPluginLandingPageLocalDefault()],
          context: ({ req, res, connection }): Context | ContextFunction => ({
            req,
            res,
            connection,
          }),
          autoTransformHttpErrors: true,
          installSubscriptionHandlers: true,

          subscriptions: {
            // AuthGuard works - Subscription not
            onConnect: (
              connectionParams: Record<string, any>,
            ): Record<string, any> => {
              const authToken: string =
                'Authorization' in connectionParams &&
                connectionParams.Authorization.split(' ')[1];

              return {
                ...connectionParams,
                headers: { authorization: connectionParams.Authorization },
              };
            },
            // Subscription works - AuthGuard not
            // 'subscriptions-transport-ws': {
            //   onConnect: (
            //     connectionParams: Record<string, any>,
            //   ): Record<string, any> => {
            //     const authorization = connectionParams.Authorization;
            //     const authToken: string =
            //       authorization && authorization.split(' ')[1];
            //     // TODO validate and decode authToken here

            //     // docs "return user info to add them to the context later" <--Is it returned?
            //     // https://docs.nestjs.com/graphql/subscriptions#authentication-over-websockets
            //     return {
            //       ...connectionParams,
            //       headers: { authorization },
            //     };
            //   },
            // },
          },
        };
      },
    }),
  ],
  providers: [...gqlResolvers, JwtStrategy],
})
export class GraphqlModule {}
