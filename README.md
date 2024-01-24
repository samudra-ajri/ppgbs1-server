Backend/API For Pigaru App
===========================
## Tech Stack
- NodeJs with [Express](https://github.com/expressjs/express) 
- PostgreSQL for database, Redis for caching
- [Sequelize](https://sequelize.org/)

## Installation

```bash
$ cp .env.example .env  # edit as required

# install directly at OS
$ npm install
```

## Important env settings
- `NODE_ENV` : either production, development, local, or testing
- `APP_URL`: required for lots of stuff. Fill it with actual URL

## Initial DB structure

```bash
# run migration
$ npm run migration:up

# run the seeders
$ npm run seed: all
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

