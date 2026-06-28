import { Injectable, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Có thể override các hàm ở đây nếu muốn custom thông báo lỗi, 
  // nhưng mặc định AuthGuard('jwt') đã lo hết mọi việc chặn request không có token rồi.
  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException('Bạn cần đăng nhập để thực hiện hành động này!');
    }
    return user;
  }
}