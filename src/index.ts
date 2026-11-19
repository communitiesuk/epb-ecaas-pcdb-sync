import { addFileToS3bucket, fileExistsInS3bucket } from "./add_file_s3.js";
import { clearProducts } from "./clear_products.js";
import { formatExportFileName, getPcdbData } from "./get_pcdb_data.js";
import { importProducts } from "./import_products_s3.js";
import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client();

export const handler = async () => {
	const data = await getPcdbData();

	const filename = formatExportFileName(data);
	const bucketName = process.env.BUCKET_NAME;

	if (!bucketName) {
		throw new Error("Missing BUCKET_NAME environment variable");
	}

	let fileExists: boolean = await fileExistsInS3bucket(bucketName, filename);

	if (!fileExists) {
		await addFileToS3bucket(bucketName, filename, data);
	}

	// for now, don't populate products table with new file and keep old process in place
	// can test in integration by temporarily removing EXPORT_FILENAME var from lambda
	if (process.env.EXPORT_FILENAME) {
		await clearProducts();
		await importProducts(process.env.EXPORT_FILENAME);
	}
};

// handler().then((r) => r); // TODO remove
