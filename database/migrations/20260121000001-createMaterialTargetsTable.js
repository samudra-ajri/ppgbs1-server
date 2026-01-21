'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS "materialTargets" (
        "id"            SERIAL PRIMARY KEY,
        "materialId"    INTEGER NOT NULL,
        "grades"        INTEGER[] NOT NULL,
        "month"         INTEGER NOT NULL,
        "year"          INTEGER NOT NULL,
        "createdAt"     BIGINT,
        "updatedAt"     BIGINT,
        "deletedAt"     BIGINT,
        FOREIGN KEY ("materialId") REFERENCES "materials" ("id") ON DELETE CASCADE,
        UNIQUE ("materialId", "month", "year")
      );
    `);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS "materialTargets";
    `);
  }
};
