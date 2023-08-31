module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "materials" ADD CONSTRAINT "subjectIdFkey" FOREIGN KEY ("subjectId") REFERENCES "subjects" ("id");  
      ALTER TABLE "materials" ADD CONSTRAINT "parentIdFkey" FOREIGN KEY ("parentId") REFERENCES "materials" ("id");
  `)
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "materials" DROP CONSTRAINT "subjectIdFkey";
      ALTER TABLE "materials" DROP CONSTRAINT "parentIdFkey";
    `)
  }
}
