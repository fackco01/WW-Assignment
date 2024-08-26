import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = 'roleId';
export const Roles = (roleId: number) => SetMetadata(ROLES_KEY, roleId);