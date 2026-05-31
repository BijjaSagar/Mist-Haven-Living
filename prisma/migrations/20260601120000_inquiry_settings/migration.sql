-- AlterTable
ALTER TABLE `SiteSettings` ADD COLUMN `leadsToEmail` VARCHAR(191) NULL,
    ADD COLUMN `resendFromEmail` VARCHAR(191) NULL,
    ADD COLUMN `inquiryEnabled` BOOLEAN NOT NULL DEFAULT true;
