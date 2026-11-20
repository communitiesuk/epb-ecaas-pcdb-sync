import {
  DynamoDBClient
  , DeleteTableCommand, DescribeTableCommand, waitUntilTableNotExists, CreateTableCommand,
  waitUntilTableExists,
} from "@aws-sdk/client-dynamodb";

const localDynamoDBConfig = {
  region: "fakeRegion",
  endpoint: "http://localhost:8000",
  credentials: {
	accessKeyId: "fakeMyKeyId",
	secretAccessKey: "fakeSecretAccessKey",
  },
};

const client = new DynamoDBClient(
  process.env.NODE_ENV === "development" ? localDynamoDBConfig : {},
);
const TABLE_NAME = "products";


export const clearProducts = async () => {
  console.log("Clearing products from DynamoDB");

  // get the table schema before deleting
  const {Table} = await client.send(
	new DescribeTableCommand({TableName: TABLE_NAME})
  );
  if (!Table) throw new Error(`Table ${TABLE_NAME} not found`);

  const {AttributeDefinitions, KeySchema, GlobalSecondaryIndexes, BillingModeSummary} = Table;

  // delete table and wait until it finishes removing it
  console.log(`Deleting ${TABLE_NAME} table`);

  await client.send(new DeleteTableCommand({TableName: TABLE_NAME}));
  await waitUntilTableNotExists({client, maxWaitTime: 120}, {TableName: TABLE_NAME});

  // recreate empty table
  await client.send(
	new CreateTableCommand({
	  TableName: TABLE_NAME,
	  BillingMode: BillingModeSummary?.BillingMode ?? "PAY_PER_REQUEST",
	  AttributeDefinitions,
	  KeySchema,
	  ...(GlobalSecondaryIndexes && {
		GlobalSecondaryIndexes: GlobalSecondaryIndexes.map(
		  ({IndexName, KeySchema, Projection}) => ({
			IndexName,
			KeySchema,
			Projection,
		  })
		),
	  }),
	})
  );

  // wait for table before writing items
  await waitUntilTableExists({client, maxWaitTime: 120}, {TableName: TABLE_NAME});
};

// clearProducts().then(r => r); // TODO remove