import { Provider } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { DeliveryResolver } from './delivery.resolver';

export const gqlResolvers: Provider[] = [AuthResolver, DeliveryResolver];
