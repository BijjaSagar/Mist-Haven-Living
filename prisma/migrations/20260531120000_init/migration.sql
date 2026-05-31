-- CreateTable
CREATE TABLE `SiteSettings` (
    `id` VARCHAR(191) NOT NULL DEFAULT 'default',
    `siteName` VARCHAR(191) NOT NULL DEFAULT 'Mist & Haven Living',
    `legalName` VARCHAR(191) NOT NULL DEFAULT 'Deepam Textiles',
    `tagline` VARCHAR(191) NOT NULL DEFAULT 'Luxury In Every Thread.',
    `description` TEXT NOT NULL,
    `logoUrl` VARCHAR(191) NOT NULL DEFAULT '/logo.png',
    `logoLightUrl` VARCHAR(191) NOT NULL DEFAULT '/logo-light.png',
    `faviconUrl` VARCHAR(191) NULL,
    `colorPearl` VARCHAR(191) NOT NULL DEFAULT '#fbfaf6',
    `colorOat` VARCHAR(191) NOT NULL DEFAULT '#f1ece2',
    `colorTaupe` VARCHAR(191) NOT NULL DEFAULT '#5e5547',
    `colorMuted` VARCHAR(191) NOT NULL DEFAULT '#857b6c',
    `colorSage` VARCHAR(191) NOT NULL DEFAULT '#c8c7ac',
    `colorSageDeep` VARCHAR(191) NOT NULL DEFAULT '#9a9a7d',
    `colorHairline` VARCHAR(191) NOT NULL DEFAULT '#e7e0d3',
    `contactEmail` VARCHAR(191) NOT NULL,
    `contactPhone` VARCHAR(191) NOT NULL,
    `whatsappNumber` VARCHAR(191) NULL,
    `calendlyUrl` VARCHAR(191) NULL,
    `footerBlurb` TEXT NOT NULL,
    `copyrightText` VARCHAR(191) NULL,
    `exportMarkets` VARCHAR(191) NOT NULL DEFAULT 'USA · Canada',
    `addressStreet` VARCHAR(191) NOT NULL,
    `addressCity` VARCHAR(191) NOT NULL,
    `addressRegion` VARCHAR(191) NOT NULL,
    `addressCountry` VARCHAR(191) NOT NULL,
    `addressPostalCode` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NavigationItem` (
    `id` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `href` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'link',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `visible` BOOLEAN NOT NULL DEFAULT true,
    `location` VARCHAR(191) NOT NULL,

    INDEX `NavigationItem_location_sortOrder_idx`(`location`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductCategory` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `shortDescription` TEXT NOT NULL,
    `description` TEXT NOT NULL,
    `eyebrow` VARCHAR(191) NOT NULL,
    `heroImage` VARCHAR(191) NOT NULL,
    `cardImage` VARCHAR(191) NOT NULL,
    `features` JSON NOT NULL,
    `materials` JSON NOT NULL,
    `sizes` JSON NOT NULL,
    `gsmRange` VARCHAR(191) NOT NULL,
    `customization` JSON NOT NULL,
    `packaging` JSON NOT NULL,
    `idealFor` JSON NOT NULL,
    `leadTime` VARCHAR(191) NOT NULL,
    `moq` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `visible` BOOLEAN NOT NULL DEFAULT true,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ProductCategory_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PageContent` (
    `slug` VARCHAR(191) NOT NULL,
    `metaTitle` VARCHAR(191) NULL,
    `metaDescription` TEXT NULL,
    `sections` JSON NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`slug`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Stat` (
    `id` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `visible` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Certification` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NULL,
    `description` TEXT NOT NULL,
    `pdfUrl` VARCHAR(191) NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `visible` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

