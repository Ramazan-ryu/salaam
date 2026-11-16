/**
 * DEV-ONLY identity stand-in until spike S-AUTH decides the real approach (ADR-0010).
 * Reads `x-dev-user-id` and `x-dev-role` headers when DEV_AUTH=true (never in production;
 * enforced in loadConfig). The guard, decorators and Actor type are the stable interface the
 * real identity module will implement.
 */
import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  Inject,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES, type Role } from '@salaam/domain';
import type { Request } from 'express';
import { CONFIG, type AppConfig } from '../config';
import { ProblemError } from './problem.filter';

export interface Actor {
  id: string;
  role: Role;
}

export const PUBLIC_KEY = 'salaam:public';
export const ROLES_KEY = 'salaam:roles';

export const Public = () => SetMetadata(PUBLIC_KEY, true);
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const CurrentActor = createParamDecorator((_: unknown, ctx: ExecutionContext): Actor => {
  const req = ctx.switchToHttp().getRequest<Request & { actor?: Actor }>();
  if (!req.actor) throw new ProblemError(401, 'UNAUTHENTICATED', 'Authentication required');
  return req.actor;
});

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(CONFIG) private readonly config: AppConfig,
  ) {}

  canActivate(ctx: ExecutionContext): boolean {
    const targets = [ctx.getHandler(), ctx.getClass()];
    if (this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, targets)) return true;

    const req = ctx.switchToHttp().getRequest<Request & { actor?: Actor }>();
    if (!this.config.DEV_AUTH) {
      throw new ProblemError(
        401,
        'AUTH_NOT_CONFIGURED',
        'Authentication is not configured yet (pending spike S-AUTH, ADR-0010)',
      );
    }
    const id = req.header('x-dev-user-id');
    const role = req.header('x-dev-role') as Role | undefined;
    if (!id || !role || !ROLES.includes(role)) {
      throw new ProblemError(401, 'UNAUTHENTICATED', 'Authentication required');
    }
    req.actor = { id, role };

    const allowed = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, targets);
    if (allowed && allowed.length > 0 && !allowed.includes(role) && role !== 'admin') {
      throw new ProblemError(403, 'FORBIDDEN', `Role '${role}' may not perform this action`);
    }
    return true;
  }
}
