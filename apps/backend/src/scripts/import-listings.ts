import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';
import { ApartmentStatus, ApartmentTypes, ListingStatus, ApartmentAmenityStatus, AmenityCategory, AmenityValue } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  console.log('Starting NestJS Application Context...');
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);

  const jsonPath = path.join(__dirname, '../../mogi_listings.json');
  console.log(`Searching for JSON file at: ${jsonPath}`);
  
  if (!fs.existsSync(jsonPath)) {
    console.error(`Error: JSON file not found at ${jsonPath}`);
    await app.close();
    process.exit(1);
  }

  const rawData = fs.readFileSync(jsonPath, 'utf8');
  const listings: any[] = JSON.parse(rawData);
  console.log(`Loaded ${listings.length} listings from JSON.`);

  // 1. Ensure default owner exists
  const ownerEmail = 'owner@example.com';
  let owner = await prisma.ownerProfile.findFirst({
    where: { account: { email: ownerEmail } }
  });

  if (!owner) {
    console.log(`Creating default owner with email ${ownerEmail}...`);
    const newAccount = await prisma.account.create({
      data: {
        email: ownerEmail,
        hashedPassword: 'placeholder_hashed_password',
        phone: '0123456789',
        fullName: 'Default Owner',
        isActive: true,
        ownerProfile: {
          create: {
            fullName: 'Default Owner',
            taxCode: '',
            bankAccount: ''
          }
        }
      },
      include: {
        ownerProfile: true
      }
    });
    owner = newAccount.ownerProfile;
  }

  const ownerId = owner!.id;
  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (const item of listings) {
    try {
      // 2. Duplicate check based on title and address
      const existingListing = await prisma.listing.findFirst({
        where: {
          title: item.title,
          apartment: {
            fullAddress: item.apartment.fullAddress
          }
        }
      });

      if (existingListing) {
        console.log(`Skipping duplicate listing: "${item.title}"`);
        skipCount++;
        continue;
      }

      // 3. Process Amenities dynamically
      const amenityIds: string[] = [];
      if (item.amenities && Array.isArray(item.amenities)) {
        for (const name of item.amenities) {
          let dbAmenity = await prisma.amenity.findFirst({
            where: { name: name }
          });

          if (!dbAmenity) {
            console.log(`Creating missing amenity: "${name}"...`);
            dbAmenity = await prisma.amenity.create({
              data: {
                name: name,
                category: AmenityCategory.Furniture,
                value: AmenityValue.Boolean,
                icon: 'default-icon'
              }
            });
          }
          amenityIds.push(dbAmenity.id);
        }
      }

      // 4. Prisma transaction for relational write
      await prisma.$transaction(async (tx) => {
        // Create Apartment
        const apartment = await tx.apartment.create({
          data: {
            floor: item.apartment.floor || 1,
            area: item.apartment.area || 0,
            type: (item.apartment.type as ApartmentTypes) || ApartmentTypes.Normal,
            district: item.apartment.district || 'Update_Later',
            fullAddress: item.apartment.fullAddress || 'Update_Later',
            room_number: item.apartment.room_number || 1,
            note: item.apartment.note || item.description || 'Unknown',
            bedroom: item.apartment.bedroom || 1,
            livingroom: item.apartment.livingroom || 1,
            bathroom: item.apartment.bathroom || 1,
            kitchen: item.apartment.kitchen || 1,
            apartmentStatus: (item.apartment.apartmentStatus as ApartmentStatus) || ApartmentStatus.Available,
            ownerId: ownerId,
          }
        });

        // Create Listing
        const listing = await tx.listing.create({
          data: {
            title: item.title || 'No Title',
            description: item.description || 'No Description',
            pricePerMonth: item.pricePerMonth || 0,
            apartmentId: apartment.id,
            listingStatus: ListingStatus.Draft,
          }
        });

        // Create ListingImages
        if (item.listingImages && Array.isArray(item.listingImages) && item.listingImages.length > 0) {
          await tx.listingImages.createMany({
            data: item.listingImages.map((img: any) => ({
              imageUrl: img.imageUrl,
              isPrimary: img.isPrimary || false,
              listingId: listing.id
            }))
          });
        }

        // Create ApartmentAmenities
        if (amenityIds.length > 0) {
          await tx.apartmentAmenity.createMany({
            data: amenityIds.map((id) => ({
              amenityId: id,
              apartmentId: apartment.id,
              apartmentAmenityStatus: ApartmentAmenityStatus.Working
            }))
          });
        }
      });

      console.log(`Successfully imported: "${item.title}"`);
      successCount++;
    } catch (err: any) {
      console.error(`Failed to import "${item.title}":`, err.message || err);
      failCount++;
    }
  }

  console.log('\n--- Import Summary ---');
  console.log(`Success: ${successCount}`);
  console.log(`Skipped (Duplicate): ${skipCount}`);
  console.log(`Failed: ${failCount}`);
  console.log('----------------------');

  await app.close();
  console.log('Context closed. Execution finished.');
}

bootstrap().catch((err) => {
  console.error('Fatal bootstrap error:', err);
  process.exit(1);
});
