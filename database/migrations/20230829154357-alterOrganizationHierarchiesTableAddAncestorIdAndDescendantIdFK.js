module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "organization_hierarchies" ADD CONSTRAINT "ancestor_id_fkey" FOREIGN KEY ("ancestor_id") REFERENCES "organizations" ("id");  
      ALTER TABLE "organization_hierarchies" ADD CONSTRAINT "descendant_id_fkey" FOREIGN KEY ("descendant_id") REFERENCES "organizations" ("id");
  `)
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "organization_hierarchies" DROP CONSTRAINT "ancestor_id_fkey";
      ALTER TABLE "organization_hierarchies" DROP CONSTRAINT "descendant_id_fkey";
    `)
  }
}
