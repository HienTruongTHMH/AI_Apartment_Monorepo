ALTER TABLE "Account" ADD COLUMN "fullName" TEXT NOT NULL DEFAULT 'Update_Later'::text;

ALTER TABLE "Account" ADD COLUMN "identityCard" TEXT DEFAULT 'Unknown'::text;
ALTER TABLE "TenantProfile" DROP COLUMN IF EXISTS "identityCard";
