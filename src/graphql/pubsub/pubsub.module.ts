import { Global, Module } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { ConfigService, ConfigModule } from '@nestjs/config';

export const PUB_SUB = 'PUB_SUB';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: PUB_SUB,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): RedisPubSub => {
        return new RedisPubSub({
          connection: {
            host: '0.0.0.0',
            port: 6379,
            password: 'secret',
          },
        });
      },
    },
  ],
  exports: [PUB_SUB],
})
export class PubsubModule {}
