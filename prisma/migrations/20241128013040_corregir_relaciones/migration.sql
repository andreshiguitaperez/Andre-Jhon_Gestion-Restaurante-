-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "productChange" TEXT NOT NULL DEFAULT 'default-product-id';

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_productChange_fkey" FOREIGN KEY ("productChange") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
