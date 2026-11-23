import {HeadObjectCommand, PutObjectCommand, S3Client, S3ServiceException} from "@aws-sdk/client-s3";

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
  } catch (error) {
	if (
	  error instanceof S3ServiceException &&
	  (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404)
	) {
	  return false;
	}

	console.error("Error reading data from S3", error);
	throw error;
  }
}

export const addFileS3 = async (bucketName: string, filename: string, data: any) => {
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

export function formatExportFileName(data: any): string {
  const exportDate = data.exportDate.split("T")[0];
  return `export_v${data.exportVersion}_${exportDate}.json`;
}
