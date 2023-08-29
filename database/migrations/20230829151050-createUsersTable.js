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
        "isMuballigh"         boolean default false,
        "isActive"            boolean default false,
        "birthdate"           date,
        "sex"                 varchar,
        "grade"               varchar,
        "lastLogin"           bigint,
        "hometown"            varchar,
        "isMarried"           varchar,
        "pondok"              varchar,
        "kertosonoYear"       integer,
        "firstDutyYear"       integer,
        "timesDuties"         integer,
        "greatHadiths"        varchar,
        "education"           varchar,
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
