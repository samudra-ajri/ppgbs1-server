module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "materials" ADD COLUMN IF NOT EXISTS "targetedMonth" INT DEFAULT NULL;  
    `)
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "materials" DROP COLUMN IF EXISTS "targetedMonth";
    `)
  }
}
