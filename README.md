# EPB ECaaS PCDB Sync

This is the codebase for the ECaaS PCDB sync application which is responsible for populating a DynamoDB table with product data from the PCDB.

Designed to be run as an AWS Lambda, it comprises of an entry point which imports data (currently from a file, but this will later change to read data from an API endpoint).

There is an additional entry point that is used to run the script locally and read data from a local JSON file.

## Getting Started

### Prerequisites

- Node.js - 22.x or newer (but we recommend the active LTS release)
- One of these JavaScript package managers: `npm`, `yarn`, `bun` or `pnpm`
- Docker
- AWS CLI
	- After installing, run `aws configure` and enter any string value for credentials and region

### Local setup

Install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

Run `docker compose up -d` to install the dynamodb-local docker image and start the container.

Run `npm run init` to create the products table from the schema defined in schema.json.

Create a new folder in the project root called "data".

Save a copy of the latest PCDB data found in the PCDB S3 bucket into the new ./data folder.

Run `npm run dev -- --file=./data/[file_name].json`

This should have now populated the local DynamoDB table with the product data and is hosted at http://localhost:8000.
To point a locally running ECaas front-end at the database, add the following environment variable in a .env file in the front-end repo:
```
LOCAL_DYNAMODB_ENDPOINT=http://localhost:8000
```

### Deleting local DynamoDB table

To delete the local DynamoDB table, run `npm run delete`