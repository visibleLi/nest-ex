import { SetMetadata } from '@nestjs/common';
import { Role } from './Role';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
