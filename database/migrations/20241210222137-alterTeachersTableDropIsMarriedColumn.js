module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "teachers" DROP COLUMN IF EXISTS "isMarried";
    `)
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "teachers" ADD COLUMN IF NOT EXISTS "isMarried" BOOLEAN;
    `)
  }
}
