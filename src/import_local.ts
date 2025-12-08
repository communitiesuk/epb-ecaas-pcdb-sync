import { clearProducts } from "./clear_products.js";
import { importProducts } from "./import_products_file.js";

const fileParam = process.argv.filter(x => x.startsWith("--file="))[0];
const path = fileParam?.split("=")[1];

if (!path) {
	throw Error("A valid 'file' parameter is required");
}

await clearProducts();
await importProducts(path);