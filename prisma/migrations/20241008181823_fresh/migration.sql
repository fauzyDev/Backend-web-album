/*
  Warnings:

  - You are about to drop the column `filename` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `mimetype` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `File` table. All the data in the column will be lost.
  - Added the required column `deskripsi` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `judul` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "filename",
DROP COLUMN "mimetype",
DROP COLUMN "size",
ADD COLUMN     "deskripsi" TEXT NOT NULL,
ADD COLUMN     "judul" TEXT NOT NULL;
