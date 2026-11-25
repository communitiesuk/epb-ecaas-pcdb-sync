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

### Run dynamoDB commands locally

`aws dynamodb list-tables --endpoint-url http://localhost:8000 --region fakeRegion`

`aws dynamodb describe-table --table-name products --endpoint-url http://localhost:8000 --region fakeRegion`

`aws dynamodb scan --table-name products --select COUNT --endpoint-url http://localhost:8000 --region fakeRegion`

### Deleting local DynamoDB table

To delete the local DynamoDB table, run `npm run delete`

## Contributing

### Using the commit template

If you've done work in a pair or ensemble why not add your co-author(s) to the commit? This way everyone involved is
given credit and people know who they can approach for questions about specific commits. To make this easy there is a
commit template with a list of regular contributors to this code base. You will find it at the root of this
project: `commit_template.txt`. Each row represents a possible co-author, however everyone is commented out by default (
using `#`), and any row that is commented out will not show up in the commit.

#### Editing the template

If your name is not in the `commit_template.txt` yet, edit the file and add a new row with your details, following the
format `#Co-Authored-By: Name <email>`, e.g. `#Co-Authored-By: Maja <maja@gmail.com>`. The email must match the email
you use for your GitHub account. To protect your privacy, you can activate and use your noreply GitHub addresses (find
it in GitHub under Settings > Emails > Keep my email addresses private).

#### Getting set up

To apply the commit template navigate to the root of the project in a terminal and
use: `git config commit.template commit_template.txt`. This will edit your local git config for the project and apply
the template to every future commit.

#### Using the template (committing with co-authors)

When creating a new commit, edit your commit (e.g. using vim, or a code editor) and delete the `#` in front of any
co-author(s) you want to credit. This means that it's probably easier and quicker to use `git commit` (instead
of `git commit -m ""` followed by a `git commit --amend`), as it will show you the commit template content for you to
edit.
