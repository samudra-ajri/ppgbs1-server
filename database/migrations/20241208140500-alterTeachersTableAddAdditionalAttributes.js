module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "teachers"
      ADD COLUMN "maritalStatus" VARCHAR,
      ADD COLUMN "muballighStatus" VARCHAR,
      ADD COLUMN "children" INT,
      ADD COLUMN "assignmentFinishDate" BIGINT,
      ADD COLUMN "assignmentStartDate" BIGINT,
      ADD COLUMN "scopes" VARCHAR[],
      ADD COLUMN "job" VARCHAR,
      ADD COLUMN "hasBpjs" BOOLEAN
    `)
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      ALTER TABLE "teachers"
      DROP COLUMN IF EXISTS "maritalStatus",
      DROP COLUMN IF EXISTS "muballighStatus",
      DROP COLUMN IF EXISTS "children",
      DROP COLUMN IF EXISTS "assignmentFinishDate",
      DROP COLUMN IF EXISTS "assignmentStartDate",
      DROP COLUMN IF EXISTS "scopes",
      DROP COLUMN IF EXISTS "job",
      DROP COLUMN IF EXISTS "hasBpjs";
    `)
  }
}
