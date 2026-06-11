import 'dotenv/config'
import { PrismaPg } from "@prisma/adapter-pg";
import { 
  PrismaClient, 
  ListingStatus, 
  ApartmentStatus, 
  AmenityCategory, 
  AmenityValue, 
  ApartmentAmenityStatus,
  ApartmentTypes,
  Roles,
  User
} from "@prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL
  })
});

// Hàm hỗ trợ random số trong khoảng
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

async function main() {
  console.log('Bắt đầu dọn dẹp dữ liệu cũ (Tùy chọn, cẩn thận nếu đang có data thật)...');
  // Xoá theo thứ tự để không dính lỗi khoá ngoại (Foreign Key)
  await prisma.listingImages.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.apartmentAmenity.deleteMany();
  await prisma.apartment.deleteMany();
  await prisma.user.deleteMany();
  await prisma.amenity.deleteMany();

  console.log('Đang tạo 4 User Chủ Hộ (Owners)...');
  const owners: User[] = [];
  for (let i = 1; i <= 4; i++) {
    const owner = await prisma.user.create({
      data: {
        email: `owner${i}@danang-apartments.com`,
        name: `Chủ nhà ${i}`,
        hashedPassword: 'hashed_password_123', // Thực tế phải dùng bcrypt
        phone: `090512300${i}`,
        role: Roles.Owner,
      }
    });
    owners.push(owner);
  }

  console.log('Đang tạo 10 User Người Thuê (Tenants)...');
  const tenants: User[] = [];
  for (let i = 1; i <= 10; i++) {
    const tenant = await prisma.user.create({
      data: {
        email: `tenant${i}@gmail.com`,
        name: `Khách thuê ${i}`,
        hashedPassword: 'hashed_password_123',
        phone: `093598700${i}`,
        role: Roles.Tenant,
      }
    });
    tenants.push(tenant);
  }

  console.log('Đang tạo Tiện ích chung (Amenities)...');
  const wifi = await prisma.amenity.create({
    data: { name: 'Wi-Fi tốc độ cao', category: AmenityCategory.Furniture, value: AmenityValue.Boolean, icon: 'wifi' }
  });
  const pool = await prisma.amenity.create({
    data: { name: 'Hồ bơi vô cực', category: AmenityCategory.Building, value: AmenityValue.Boolean, icon: 'pool' }
  });
  const gym = await prisma.amenity.create({
    data: { name: 'Phòng Gym', category: AmenityCategory.Building, value: AmenityValue.Boolean, icon: 'dumbbell' }
  });

  // Thông tin 4 Toà nhà tại 4 Quận Đà Nẵng
  const buildings = [
    { name: 'Indochina Riverside', district: 'Hải Châu', address: '74 Bạch Đằng, Quận Hải Châu, Đà Nẵng' },
    { name: 'The Monarchy', district: 'Sơn Trà', address: 'Trần Hưng Đạo, An Hải Tây, Quận Sơn Trà, Đà Nẵng' },
    { name: 'HAGL Lakeview', district: 'Thanh Khê', address: '72 Hàm Nghi, Thạc Gián, Quận Thanh Khê, Đà Nẵng' },
    { name: 'The Ori Garden', district: 'Liên Chiểu', address: 'KĐT Bàu Tràm, Hoà Hiệp Nam, Quận Liên Chiểu, Đà Nẵng' },
  ];

  const apartmentTypes = [ApartmentTypes.Normal, ApartmentTypes.Studio, ApartmentTypes.Duplex];
  
  // Base URL Storage của bạn. 
  // LƯU Ý: Chữ 'apartment-listings' là tên Bucket. Bạn cần tạo Bucket này trong Supabase Storage và set Public.
  const STORAGE_BASE_URL = 'https://xzwpyzamhyevocaqmyhn.supabase.co/storage/v1/object/public/apartment-listings';
  // const STORAGE_BASE_URL = 'https://xzwpyzamhyevocaqmyhn.supabase.co/storage/files/buckets/apartment-listings';

  

  console.log('Đang tạo 40 Căn hộ (10 căn mỗi toà)...');
  
  for (let b = 0; b < buildings.length; b++) {
    const building = buildings[b];
    // Gán mỗi chủ hộ quản lý 1 toà nhà
    const buildingOwner = owners[b]; 

    for (let i = 1; i <= 10; i++) {
      const floor = getRandomInt(3, 25);
      const roomNumber = floor * 100 + i; // VD: Tầng 12, căn số 4 -> 1204
      const area = getRandomInt(35, 120);
      const bedroom = area > 70 ? getRandomInt(2, 3) : 1;
      const price = area * 150000; // Giá mô phỏng dựa trên diện tích
      const type = getRandomItem(apartmentTypes);

      await prisma.apartment.create({
        data: {
          floor: floor,
          room_number: roomNumber,
          area: area,
          type: type,
          district: building.district,
          fullAddress: `${building.name} - ${building.address}`,
          note: `Căn hộ thuộc toà ${building.name}`,
          bedroom: bedroom,
          bathroom: bedroom > 1 ? 2 : 1,
          livingroom: 1,
          kitchen: 1,
          apartmentStatus: ApartmentStatus.Available,
          ownerId: buildingOwner.id,
          apartmentListing: {
            create: {
              title: `[${building.name}] Căn hộ ${type} view đẹp tầng ${floor}`,
              description: `Cho thuê căn hộ ${type} tại ${building.district}. Diện tích ${area}m2, thiết kế hiện đại, đầy đủ ánh sáng tự nhiên.`,
              pricePerMonth: price,
              listingStatus: ListingStatus.Published,
              images: {
                create: [
                  // Lấy ngẫu nhiên các ảnh giả lập từ Storage của bạn. 
                  // Bạn nên upload sẵn khoảng 5 file (demo-1.jpg đến demo-5.jpg) lên bucket đó để nó hiển thị thật trên UI.
                  { imageUrl: `${STORAGE_BASE_URL}/demo-${getRandomInt(1, 5)}.jpg`, isPrimary: true },
                  { imageUrl: `${STORAGE_BASE_URL}/demo-${getRandomInt(1, 5)}.jpg`, isPrimary: false },
                ],
              },
            },
          },
          apartmentAmenities: {
            create: [
              { amenityId: wifi.id, apartmentAmenityStatus: ApartmentAmenityStatus.Working },
              ...(area > 50 ? [{ amenityId: pool.id, apartmentAmenityStatus: ApartmentAmenityStatus.Working }] : []),
              ...(area > 70 ? [{ amenityId: gym.id, apartmentAmenityStatus: ApartmentAmenityStatus.Working }] : [])
            ],
          },
        },
      });
    }
    console.log(`Đã tạo xong 10 căn hộ tại ${building.name} (${building.district})`);
  }

  console.log('🎉 Đã seed thành công toàn bộ dữ liệu mẫu!');
}

main()
  .catch((e) => {
    console.error('Lỗi khi seed data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });