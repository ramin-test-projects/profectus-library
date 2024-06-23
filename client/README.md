This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, install the packages, then run the development server:

```bash
yarn
yarn dev
```

## Generate APIs

Download the swagger json file from the API project. Then run the following command to generate the interfaces:

```bash
npx swagger-typescript-api -p [PATH_TO_SWAGGER] -o [OUTPUT_FOLDER] -n ApiBase.ts --api-class-name ApiBase --unwrap-response-data

```

e.g.

```bash
npx swagger-typescript-api -p ./swagger.json -o ./api -n ApiBase.ts --api-class-name ApiBase --unwrap-response-data

```
