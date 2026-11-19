import {clearProducts} from "./clear_products.js";
import {importProducts} from "./import_products_s3.js";
import {HeadObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";

const s3Client = new S3Client({region: process.env.AWS_REGION || "eu-west-2"});

export const handler = async () => {
  // call PCDB API and get version
  const user_auth = `${process.env.PCDB_API_USERNAME}:${process.env.PCDB_API_PASSWORD}`;
  const response = await fetch(`${process.env.PCDB_API_URL}`, {
	headers: {
	  "Authorization": `Basic ${btoa(user_auth)}`,
	  "Content-Type": "application/json"
	},
  });

  if (!response.ok) {
	throw new Error(`Error fetching data from the PCDB, status: ${response.status}`);
  }

  const data = await response.json();
  const date = data.exportDate.split('T')[0]

  const filename = `export_v${data.exportVersion}_${date}.json`;

  // check whether filename already exists in s3 bucket
  const bucketName = process.env.BUCKET_NAME;
  if (!bucketName) {
	throw new Error("Missing BUCKET_NAME environment variable");
  }

  const params = {
	Bucket: bucketName,
	Key: filename,
  };
  const command = new HeadObjectCommand(params);
  let fileExists = false;

  try {
	await s3Client.send(command);
	fileExists = true;
  } catch (error: any) { // TODO avoid any?
	if (error.name !== "NotFound" && error.$metadata?.httpStatusCode !== 404) {
	  console.error("Error reading data from S3", error);
	  throw error;
	}
  }

  if (fileExists) {
	console.log(`${filename} already exists in S3 bucket`);
	return;
  }

  // if file doesn't already exist in s3, upload it
  await s3Client.send(
	new PutObjectCommand({
	  Bucket: bucketName,
	  Key: filename,
	  Body: JSON.stringify(data),
	  ContentType: "application/json",
	})
  );
  console.log(`Uploaded ${filename} to S3`);

  // for now, don't populate products table with new file and keep old process in place
  // can test in integration by temporarily removing EXPORT_FILENAME var from lambda
  if (process.env.EXPORT_FILENAME) {
	await clearProducts();
	await importProducts(process.env.EXPORT_FILENAME);
  }
};

// handler().then(r => r); // TODO remove
