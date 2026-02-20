'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "materialTargets" ALTER COLUMN "materialId" DROP NOT NULL;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DELETE FROM "materialTargets" WHERE "materialId" IS NULL;
    `);
    return queryInterface.sequelize.query(`
      ALTER TABLE "materialTargets" ALTER COLUMN "materialId" SET NOT NULL;
    `);
  }
};
