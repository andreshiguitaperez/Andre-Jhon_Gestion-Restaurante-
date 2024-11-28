import { AccountResolvers } from './account/resolvers';
import { SessionResolvers } from './session/resolvers';
import { UserResolvers } from './user/resolvers';
import { ProfileResolvers } from './profile/resolvers';
import { OrderResolvers } from './order/resolvers';
import { ProductsResolvers } from './products/resolvers';
import { VerificationTokenResolvers } from './verificationtoken/resolvers';

export const resolvers = [
  AccountResolvers,
  SessionResolvers,
  UserResolvers,
  ProfileResolvers,
  OrderResolvers,
  ProductsResolvers,
  VerificationTokenResolvers,
];
