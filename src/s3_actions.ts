import { GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client();

export const fileExistsS3 = async (bucketName: string, filename: string) => {
	try {
		await s3Client.send(
			new HeadObjectCommand({
				Bucket: bucketName,
				Key: filename,
			}),
		);
		console.log(`${filename} already exists in S3 bucket`);
		return true;
	} catch (error: any) {
		// TODO avoid any?
		if (error.name !== "NotFound" && error.$metadata?.httpStatusCode !== 404) {
			console.error("Error reading data from S3", error);
			throw error;
		}
		return false;
	}
}

export const addFileS3 = async(bucketName: string, filename: string, data: any) => {
	await s3Client.send(
		new PutObjectCommand({
			Bucket: bucketName,
			Key: filename,
			Body: JSON.stringify(data),
			ContentType: "application/json",
		}),
	);
	console.log(`Uploaded ${filename} to S3`);
}

export const readFileS3 = async (fileName: string) => {
	console.log(`Reading data from ${fileName}`);

	const params = {
		Bucket: process.env.BUCKET_NAME,
		Key: fileName,
	};

	const command = new GetObjectCommand(params);
	let s3Response;

	try {
		s3Response = await s3Client.send(command);
	} catch (error) {
		console.error("Error reading data from S3", error);
		return;
	}

	return await s3Response.Body?.transformToString();
};

export function formatExportFileName(data: any): string {
	const exportDate = data.exportDate.split("T")[0];
	const fileName = `export_v${data.exportVersion}_${exportDate}.json`;
	return fileName;
}
