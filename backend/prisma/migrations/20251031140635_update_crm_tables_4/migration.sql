/*
  Warnings:

  - The `status` column on the `Installation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Quote` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PrismaQuoteStatus" AS ENUM ('DRAFT', 'SENT', 'SIGNED', 'REFUSED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PrismaInstallationStatus" AS ENUM ('PREPARATION', 'INPROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "Installation" DROP COLUMN "status",
ADD COLUMN     "status" "PrismaInstallationStatus" NOT NULL DEFAULT 'PREPARATION';

-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "status",
ADD COLUMN     "status" "PrismaQuoteStatus" NOT NULL DEFAULT 'DRAFT';

-- DropEnum
DROP TYPE "public"."InstallationStatus";

-- DropEnum
DROP TYPE "public"."QuoteStatus";
