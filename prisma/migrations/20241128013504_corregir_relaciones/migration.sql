-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_productChange_fkey";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "createdBy" DROP DEFAULT,
ALTER COLUMN "productChange" DROP NOT NULL,
ALTER COLUMN "productChange" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_productChange_fkey" FOREIGN KEY ("productChange") REFERENCES "Products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
