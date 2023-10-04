'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS "presences" (
        "userId"    bigint,
        "eventId"   bigint,
        "status"    varchar,
        "createdAt" bigint,
        "createdBy" bigint
      );
    `)
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS "presences";
    `)
  }
}
