import { addFileS3, fileExistsS3, formatExportFileName } from "./s3_actions.js";
import { clearProducts } from "./clear_products.js";
import { getPcdbData } from "./get_pcdb_data.js";
import { saveProducts } from "./save_products.js";
import type { BreResponse } from "./pcdb.types.js";

export const handler = async () => {
	const data = await getPcdbData();

	const filename = formatExportFileName(data);
	const bucketName = process.env.BUCKET_NAME;

	if (!bucketName) {
		throw new Error("Missing BUCKET_NAME environment variable");
	}

	let fileExists: boolean = await fileExistsS3(bucketName, filename);

	if (!fileExists) {
		await addFileS3(bucketName, filename, data);
	  	await clearProducts();
		await saveProducts(data as BreResponse);
	}
};

// handler().then((r) => r); // TODO remove
