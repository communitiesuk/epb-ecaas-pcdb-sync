import { addFileS3, fileExistsS3, formatExportFileName } from "./s3_actions.js";
import { clearProducts } from "./clear_products.js";
import { getPcdbData } from "./get_pcdb_data.js";
import { importProducts } from "./import_products_s3.js";

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
	}

	// for now, don't populate products table with new file and keep old process in place
	// can test in integration by temporarily removing EXPORT_FILENAME var from lambda
	if (process.env.EXPORT_FILENAME) {
		await clearProducts();
		await importProducts(process.env.EXPORT_FILENAME);
	}
};

// handler().then((r) => r); // TODO remove
