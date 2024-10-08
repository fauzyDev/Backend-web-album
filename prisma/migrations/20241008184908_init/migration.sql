/*
  Warnings:

  - You are about to drop the column `deskripsi` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `judul` on the `File` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "deskripsi",
DROP COLUMN "judul";
