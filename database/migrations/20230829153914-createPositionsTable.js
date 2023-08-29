module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS "positions" (
        "id" BIGSERIAL PRIMARY KEY,
        "name" varchar,
        "type" varchar,
        "organization_id" bigint,
        "created_at" bigint,
        "updated_at" bigint,
        "deleted_at" bigint
      );
      ALTER TABLE "positions" ADD CONSTRAINT "organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations" ("id");
    `)
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS "positions";
      ALTER TABLE "positions_organizations" DROP CONSTRAINT "organization_id_fkey";
    `)
  }
}
