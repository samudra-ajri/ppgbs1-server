Backend/API For Monev App
==========================

## Tech Stack
- Nodejs with [express](https://expressjs.com/) 
- [Sequelize](https://sequelize.org/)
- PostgreSQL for database
- Winston-Elasticsearch for logger
- Redis for cache

## Installation
```bash
$ cp .env.example .env  # edit as required
$ npm install
```

## Managing migrations
```bash
# create migration
$ npm run migration:create
# run migration
$ npm run migration:up
# revert migration
$ npm run migration:down
# create seeder
$ npm run seed:create
# run seeder
$ npm run seed:run
```

## Run Service
```bash
$ npm run start:dev
```
