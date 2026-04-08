import { clearProducts } from "./clear_products.js";
import { importProducts } from "./import_products_s3.js";

export const handler = async () => {
	await clearProducts();
  	await importProducts("export_20260331.json");
};