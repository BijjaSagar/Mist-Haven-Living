-- AlterTable
ALTER TABLE `ProductCategory` ADD COLUMN `galleryImages` JSON NOT NULL DEFAULT (JSON_ARRAY());
