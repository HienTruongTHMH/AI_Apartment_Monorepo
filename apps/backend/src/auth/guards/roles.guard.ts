//apps/backend/src/auth/guards/roles.guard.ts
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PROFILE_KEY } from "../decorators/require-profile.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {
    console.log('--- KHỞI TẠO ROLES GUARD ---');
    console.log('Reflector có tồn tại không?', this.reflector ? 'CÓ' : 'KHÔNG (UNDEFINED)');
  }

  canActivate(context: ExecutionContext): boolean {

    const requireProfile = this.reflector.getAllAndOverride<string>(PROFILE_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (!requireProfile) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException("Bạn chưa đăng nhập để vào chức năng này !!!")
    }

    if (requireProfile === "OWNER" && !user.hasOwnerProfile) {
      throw new ForbiddenException("Bạn chưa đăng/ tạo bắt kì bài viết/ căn hộ nào. Hãy đăng hoặc tạo căn hộ để sử dụng căn hộ này nhé!!")
    }

    if (requireProfile === "TENANT" && !user.hasTenantProfile) {
      throw new ForbiddenException("Bạn chưa phải khách thuê, nên không thể có chức năng này")
    }
    return true
  }
}