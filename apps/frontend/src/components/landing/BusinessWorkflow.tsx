import React from 'react';
import { Search, FileCheck, UserCheck, ShieldCheck } from 'lucide-react';

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Tạo Tài Khoản Khách',
    badge: 'Chưa kích hoạt',
    badgeColor: 'bg-[#F2F2F2] text-[#5A5A5A]',
    icon: UserCheck,
    desc: 'Tài khoản khởi tạo ở trạng thái chưa kích hoạt. Khách thuê có thể duyệt danh sách căn hộ và trải nghiệm tìm kiếm nhanh.'
  },
  {
    step: '02',
    title: 'Lựa Chọn Căn Hộ',
    badge: 'Duyệt thông tin',
    badgeColor: 'bg-blue-50 text-blue-700',
    icon: Search,
    desc: 'Khách thuê dễ dàng tìm kiếm căn hộ ưng ý qua bộ lọc dự án hoặc nhờ sự trợ giúp tìm kiếm thông minh từ hệ thống.'
  },
  {
    step: '03',
    title: 'Ký Hợp Đồng Bản Cứng',
    badge: 'Ký kết trực tiếp',
    badgeColor: 'bg-amber-50 text-amber-700',
    icon: FileCheck,
    desc: 'Không thực hiện ký trực tuyến. Chủ nhà và khách thuê gặp mặt trực tiếp để trao đổi và ký hợp đồng giấy truyền thống.'
  },
  {
    step: '04',
    title: 'Xác Nhận & Kích Hoạt',
    badge: 'Đã kích hoạt',
    badgeColor: 'bg-green-100 text-green-700 font-bold',
    icon: ShieldCheck,
    desc: 'Sau khi cập nhật trạng thái thuê thành công trên hệ thống, tài khoản khách thuê sẽ được kích hoạt toàn quyền thành viên.'
  }
];

export default function BusinessWorkflow() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <h2 className="text-2xl font-semibold text-[#2C2C2C]">Quy Trình Nghiệp Vụ Minh Bạch & Chuẩn Xác</h2>
        <p className="text-sm text-[#5A5A5A]">
          Hệ thống tuân thủ chặt chẽ luồng quản lý tài khoản và hợp đồng bản cứng ngoài đời thực nhằm bảo vệ quyền lợi tối đa cho cả hai bên.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {WORKFLOW_STEPS.map((item) => (
          <div
            key={item.step}
            className="p-6 rounded-lg bg-[#FFFFFF] border border-[#E8E8E8] shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-[#E8E8E8]">{item.step}</span>
                <span className={`text-[10px] px-2.5 py-1 rounded-full ${item.badgeColor}`}>
                  {item.badge}
                </span>
              </div>
              <item.icon className="w-8 h-8 text-[#E03C3D]" />
              <h3 className="text-base font-medium text-[#2C2C2C]">{item.title}</h3>
              <p className="text-sm text-[#5A5A5A] leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
