module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "organizationHierarchies" ADD CONSTRAINT "ancestorIdFkey" FOREIGN KEY ("ancestorId") REFERENCES "organizations" ("id");  
      ALTER TABLE "organizationHierarchies" ADD CONSTRAINT "descendantIdFkey" FOREIGN KEY ("descendantId") REFERENCES "organizations" ("id");
  `)
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "organizationHierarchies" DROP CONSTRAINT "ancestorIdFkey";
      ALTER TABLE "organizationHierarchies" DROP CONSTRAINT "descendantIdFkey";
    `)
  }
}
