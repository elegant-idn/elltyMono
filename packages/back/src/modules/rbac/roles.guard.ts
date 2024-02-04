import { Role } from './role.enum';
import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import RequestWithUser from '../auth/interface/requestWithUser.interface';

const RoleGuard = (roles: Role[]): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;

      return roles.filter(role=>role===user?.role).length>0?true:false;
    }
  }

  return mixin(RoleGuardMixin);
};

export default RoleGuard;
