# Storefront Backend Project

## Prepare env

- add a `.env` file in the root directory and set the missing `###` environment parameters

```
PORT=3000
NODE_ENV=dev
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
POSTGRES_PORT_TEST=5433
POSTGRES_DB=store_dev
POSTGRES_DB_TEST=store_test
POSTGRES_USER=###
POSTGRES_PASSWORD=###
BCRYPT_PASSWORD=###
SALT_ROUNDS=10
TOKEN_SECRET=###
```

# start PostgreSQL

psql -h localhost -U postgres

# create database for dev env

CREATE DATABASE store_dev;

# list out all databases

\dt

# connect to database

\c store_dev

# quit PostgreSQL

\q

## Set up

- `docker-compose up` to start the docker container
- `npm install` to install all dependencies
- `npm run db-up` to set up the database
- `npm run build` to build the app

## Start the app

- `npm run start` to start the app

## Test the app

- add a `database.json` file in the root directory and set the missing `###` parameters

```
    "defaultEnv": { "ENV": "NODE_ENV" },
{
  "dev": {
    "driver": "pg",
    "host": "127.0.0.1",
    "port": 5432,
    "database": "store_dev",
    "user": "###",
    "password": "###"
  },
  "test": {
    "driver": "pg",
    "host": "127.0.0.1",
    "port": 5433,
    "database": "store_test",
    "user": "###",
    "password": "###"
  }
}
```

## scripts:

- "start": "npm run clean && tsc && nodemon build/server.js"
- "format": "prettier --write src/\*_/_.ts"
- "lint": "eslint src/\*_/_.ts"
- "watch": "tsc-watch --esModuleInterop src/server.ts --outDir ./build --onSuccess \"node ./build/server.js\""
- "test": "db-migrate --env test up && ENV=test jasmine-ts --config jasmine.json || db-migrate --env test down"
- "build": "tsc --esModuleInterop src/server.ts --outDir ./build"
- "db-up": "db-migrate up"
- "clean": "rimraf build/"
- "db-down": "db-migrate down"
- "db-reset": "db-migrate reset"

## dependencies:

       "bcrypt": "^5.0.1",
        "body-parser": "^1.20.0",
        "docker-compose": "^0.23.17",
        "dotenv": "^16.0.1",
        "express": "^4.18.1",
        "jsonwebtoken": "^8.5.1",
        "pg": "^8.7.3",
        "typescript": "^4.7.4"

## devDependencies:

        "@types/bcrypt": "^5.0.0",
        "@types/express": "^4.17.13",
        "@types/jasmine": "^3.6.3",
        "@types/jsonwebtoken": "^8.5.8",
        "@types/node": "^18.0.3",
        "@types/pg": "^8.6.5",
        "@types/supertest": "^2.0.12",
        "@typescript-eslint/eslint-plugin": "^5.30.6",
        "@typescript-eslint/parser": "^5.30.6",
        "db-migrate": "^0.11.13",
        "db-migrate-pg": "^1.2.2",
        "eslint": "^8.19.0",
        "eslint-config-prettier": "^8.5.0",
        "eslint-plugin-prettier": "^4.2.1",
        "jasmine": "^3.6.4",
        "jasmine-spec-reporter": "^6.0.0",
        "jasmine-ts": "^0.3.0",
        "nodemon": "^2.0.19",
        "prettier": "^2.7.1",
        "rimraf": "^3.0.2",
        "supertest": "^6.2.4",
        "ts-node": "^10.8.2",
        "tsc-watch": "^5.0.3"
