import { batchItems } from "./utils/batch_items.js";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { BatchWriteCommand, DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { type BreResponse, type BreProduct, type ProductData } from "./pcdb.types.js";
import { keysToCamelCase } from "./utils/objects.js";
import technologyGroupMapping from "./product_group_mapping.js";

const localDynamoDBConfig = {
	region: "fakeRegion", 
	endpoint: "http://localhost:8000",
	credentials: {
		accessKeyId: "fakeMyKeyId",
		secretAccessKey: "fakeSecretAccessKey",
	}
};

const nonProductIDPrefixes = {
  ConvectorRadiator: "CR",
  SmartAirBrick: "SAB",
  HeatingControlRequirements: "HCR",
};


const client = new DynamoDBClient(process.env.NODE_ENV === "development" ? localDynamoDBConfig : {});
const docClient = DynamoDBDocumentClient.from(client);

const inUseFactorsTableSuffix = "InUseFactors";

function productTypeIsInUseFactors(productData: BreProduct): boolean {
	return productData.productType.endsWith(inUseFactorsTableSuffix);
}

export const saveProducts = async (response: BreResponse | undefined) => {
	console.log("Save products");

	if (!response) {
		console.log('No products to save');
		return;
	}

	for (const productType of response.productTypes) {
		try {
			if (!productTypeIsInUseFactors(productType)) {
				// it's a standard product category
				await saveProductType(productType);
			} else {
				// it's side-loaded in use factors metadata
				await saveInUseFactorsType(productType);
			}
			
		}
		catch (err: unknown) {
			console.error(`Error writing ${productType.productTypeName} data to DynamoDB`, err);
			break;
		}
	}
}

async function saveProductType(productTypeData: BreProduct) {
	const products = (productTypeData?.data ?? []) as Record<string, unknown>[];
	const productType = productTypeData.productType.trim();
	const batchedProducts = batchItems(products);
	let completedBatches = 0;

	if (!batchedProducts.length) {
		return;
	}

	console.log(`Saving ${batchedProducts.length} batches to DynamoDB`);

	for (const batch of batchedProducts) {
		if (!batch?.length) {
			continue;
		}
		await docClient.send(
			new BatchWriteCommand({
				RequestItems: {
					"products": batch.map(x => {
						const data = keysToCamelCase(x);
						const prefix = nonProductIDPrefixes[productType as keyof typeof nonProductIDPrefixes];

						const item: ProductData = {
							...data,
							id: data.productID ? String(data.productID) : `${prefix}${data.id}` as string,
							brandName: (data.brandName ?? "-") as string,
							modelName: (data.modelName ?? "") as string,
							technologyType: productType,
							...(technologyGroupMapping[productType] ? { technologyGroup: technologyGroupMapping[productType] } : {})
						};

						return {
							PutRequest: {
								Item: {
									...item,
									testData: Array.isArray(data.testData) ? data.testData.map(keysToCamelCase) : [],
								}
							}
						};
					}),
				},
			}),
		);

		completedBatches++;
	}

	console.log(`Completed ${completedBatches} of ${batchedProducts.length} batches`);
};

async function saveInUseFactorsType(inUseFactorsData: BreProduct) {
	console.log(`Saving ${ inUseFactorsData.productType.slice(0, -inUseFactorsTableSuffix.length) } in use factors data`);

	await docClient.send(
		new PutCommand({
			TableName: "products",
			Item: {
				id: inUseFactorsData.productType, // use product type as ID directly
				data: inUseFactorsData.data.map(keysToCamelCase),
			}
		})
	);

	console.log(`Saved set of in use factors data`);
}





