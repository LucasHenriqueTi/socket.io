-- DropForeignKey
ALTER TABLE `form` DROP FOREIGN KEY `Form_userId_fkey`;

-- DropForeignKey
ALTER TABLE `sharedform` DROP FOREIGN KEY `SharedForm_formId_fkey`;

-- DropForeignKey
ALTER TABLE `sharedform` DROP FOREIGN KEY `SharedForm_userId_fkey`;

-- DropIndex
DROP INDEX `Form_userId_fkey` ON `form`;

-- DropIndex
DROP INDEX `SharedForm_formId_fkey` ON `sharedform`;

-- DropIndex
DROP INDEX `SharedForm_userId_fkey` ON `sharedform`;

-- AddForeignKey
ALTER TABLE `Form` ADD CONSTRAINT `Form_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SharedForm` ADD CONSTRAINT `SharedForm_formId_fkey` FOREIGN KEY (`formId`) REFERENCES `Form`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SharedForm` ADD CONSTRAINT `SharedForm_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
