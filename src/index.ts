import { clearProducts } from "./clear_products";
import { importProducts } from "./import_products";

export const handler = async () => {
	await clearProducts();
  	await importProducts("export.json");
};