module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id"                  BIGSERIAL PRIMARY KEY,
        "name"                varchar,
        "username"            varchar,
        "email"               varchar,
        "phone"               varchar,
        "password"            varchar,
        "sex"                 integer,
        "birthdate"           date,
        "isMuballigh"         boolean,
        "isActive"            boolean default false,
        "lastLogin"           bigint,
        "resetPasswordToken"  varchar,
        "createdAt"           bigint,
        "createdBy"           bigint,
        "updatedAt"           bigint,
        "updatedBy"           bigint,
        "deletedAt"           bigint,
        "deletedBy"           bigint
      );
    `)
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS "users";
    `)
  }
}
