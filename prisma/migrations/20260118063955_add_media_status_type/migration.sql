/*
  Warnings:

  - You are about to drop the column `size` on the `media_files` table. All the data in the column will be lost.
  - Added the required column `content_type` to the `media_files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `media_type` to the `media_files` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('VIDEO', 'IMAGE');

-- CreateEnum
CREATE TYPE "MediaStatus" AS ENUM ('IN_PROGRESS', 'READY', 'DISCARDED');

-- AlterTable
ALTER TABLE "media_files" DROP COLUMN "size",
ADD COLUMN     "content_type" TEXT NOT NULL,
ADD COLUMN     "media_type" "MediaType" NOT NULL,
ADD COLUMN     "status" "MediaStatus" DEFAULT 'IN_PROGRESS',
ALTER COLUMN "url" DROP NOT NULL;
