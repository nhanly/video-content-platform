/*
  Warnings:

  - The values [CREATOR] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `format` on the `videos` table. All the data in the column will be lost.
  - You are about to drop the column `is_featured` on the `videos` table. All the data in the column will be lost.
  - You are about to drop the column `published_at` on the `videos` table. All the data in the column will be lost.
  - You are about to drop the `subscriptions` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('ADMIN', 'MODERATOR', 'USER');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- AlterEnum
ALTER TYPE "VideoStatus" ADD VALUE 'UPLOADED';

-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_channel_id_fkey";

-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_subscriber_id_fkey";

-- DropIndex
DROP INDEX "videos_published_at_idx";

-- AlterTable
ALTER TABLE "videos" DROP COLUMN "format",
DROP COLUMN "is_featured",
DROP COLUMN "published_at",
ADD COLUMN     "file_size" BIGINT;

-- DropTable
DROP TABLE "subscriptions";
