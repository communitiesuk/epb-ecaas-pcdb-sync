import { saveProducts } from "./save_products.js";
import type { BreResponse } from "./pcdb.types.js";
import { readFileS3 } from "./s3_actions.js";

export const importProducts = async (fileName: string) => {
	const data = await readFileS3(fileName);
	const response = data ? (JSON.parse(data) as BreResponse) : undefined;

	await saveProducts(response);
};
