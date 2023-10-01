module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS "teachers" (
        "userId"        bigint UNIQUE, 
        "isMarried"     boolean,    
        "pondok"        varchar,
        "kertosonoYear" integer,
        "firstDutyYear" integer,
        "timesDuties"   integer,
        "greatHadiths"  varchar,
        "education"     varchar,
        "createdAt"     bigint,
        "createdBy"     bigint,
        "updatedAt"     bigint,
        "updatedBy"     bigint,
        "deletedAt"     bigint,
        "deletedBy"     bigint
      );
    `)
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS "teachers";
    `)
  }
}
