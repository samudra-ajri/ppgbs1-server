module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "users_positions" ADD CONSTRAINT "user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id");
      ALTER TABLE "users_positions" ADD CONSTRAINT "position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "positions" ("id");
    `)
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "users_positions" DROP CONSTRAINT "user_id_fkey";
      ALTER TABLE "users_positions" DROP CONSTRAINT "position_id_fkey";
    `)
  }
}
