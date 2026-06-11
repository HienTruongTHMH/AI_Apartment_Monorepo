import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, ListingStatus, ApartmentStatus, AmenityCategory, AmenityValue, ApartmentAmenityStatus} from "@prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL
  })
});

async function main() {
  // 1. Tạo một User chủ nhà (vì Apartment cần ownerId)
  const owner = await prisma.user.upsert({
    where: { email: 'owner@example.com' },
    update: {},
    create: {
      email: 'owner@example.com',
      name: 'Chủ nhà mẫu',
      hashedPassword: 'dummy_password',
      phone: '0123456789'             
      // Giả sử model User của bạn có các trường này, hãy điều chỉnh theo model thực tế của bạn
    },
  });

  // 2. Tạo một số tiện ích (Amenities) mẫu
  const wifi = await prisma.amenity.create({
    data: {
      name: 'Wi-Fi tốc độ cao',
      category: AmenityCategory.Furniture, // Giả sử Enum này tồn tại
      value: AmenityValue.Boolean, 
      icon: 'wifi-icon',
    },
  });

  const pool = await prisma.amenity.create({
    data: {
      name: 'Hồ bơi vô cực',
      category: AmenityCategory.Furniture, 
      value: AmenityValue.Boolean,
      icon: 'pool-icon',
    },
  });

  // --- CĂN HỘ 1: STUDIO HIỆN ĐẠI ---
  const apartment1 = await prisma.apartment.create({
    data: {
      floor: 12,
      area: 35.5,
      apartmentStatus: ApartmentStatus.Available,
      ownerId: owner.id,
      apartmentListing: {
        create: {
          title: 'Studio hiện đại trung tâm quận 1 - Full nội thất',
          description: 'Căn hộ Studio yên tĩnh, thiết kế tối giản phong cách Nordic. Ánh sáng tự nhiên tràn ngập, phù hợp cho lập trình viên làm việc remote. Gần các quán cafe và siêu thị tiện lợi.',
          pricePerMonth: 8500000.00,
          listingStatus: ListingStatus.Published,
          images: {
            create: [
              { imageUrl: 'https://example.com/studio-1.jpg', isPrimary: true },
              { imageUrl: 'https://example.com/studio-2.jpg', isPrimary: false },
            ],
          },
        },
      },
      apartmentAmenities: {
        create: [
          { amenityId: wifi.id, apartmentAmenityStatus: ApartmentAmenityStatus.Working },
        ],
      },
    },
  });

  // --- CĂN HỘ 2: LUXURY PENTHOUSE ---
  const apartment2 = await prisma.apartment.create({
    data: {
      floor: 25,
      area: 120.0,
      apartmentStatus: ApartmentStatus.Available,
      ownerId: owner.id,
      apartmentListing: {
        create: {
          title: 'Căn hộ 3 phòng ngủ cao cấp - View sông Sài Gòn',
          description: 'Trải nghiệm sống thượng lưu với không gian rộng rãi, nội thất gỗ óc chó cao cấp. Ban công rộng view toàn cảnh thành phố. Hệ thống Smart Home tích hợp sẵn, an ninh 24/7.',
          pricePerMonth: 35000000.00,
          listingStatus: ListingStatus.Published,
          images: {
            create: [
              { imageUrl: 'https://example.com/luxury-1.jpg', isPrimary: true },
              { imageUrl: 'https://example.com/luxury-2.jpg', isPrimary: false },
            ],
          },
        },
      },
      apartmentAmenities: {
        create: [
          { amenityId: wifi.id, apartmentAmenityStatus: ApartmentAmenityStatus.Working },
          { amenityId: pool.id, apartmentAmenityStatus: ApartmentAmenityStatus.Working },
        ],
      },
    },
  });

  console.log({ apartment1, apartment2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });