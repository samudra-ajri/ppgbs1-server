const fs = require('fs')
const csv = require('csv-parser')
const ageUtils = require('../../utils/ageUtils')

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = Date.now()

    const parseCsvLineUsers = (line) => {
      return {
        id: line.id,
        name: line.name,
        username: line.username,
        email: line.email,
        phone: line.phone,
        password: line.password,
        isMuballigh: line.isMuballigh,
        birthdate: line.birthdate ? (line.birthdate).split('T')[0] : null,
        sex: line.sex === 'male' ? 1 : 0,
        isActive: line.isActive,
        lastLogin: line.lastLogin ? new Date(line.lastLogin).getTime() / 1000 : null,
        resetPasswordToken: line.resetPasswordToken,
        createdAt: now,
        updatedAt: now,
        createdBy: 1,
        updatedBy: 1,
      }
    }

    const generateGrade = (birthdate) => {
      return ageUtils.getGrade(birthdate)
    }

    const parseCsvLineStudents = (line) => {
      const birthdate = line.birthdate ? (line.birthdate).split('T')[0] : null
      return {
        userId: line.id,
        grade: generateGrade(birthdate),
        createdAt: now,
        updatedAt: now,
        createdBy: 1,
        updatedBy: 1,
      }
    }

    const parseCsvLineUsersPositions = (line) => {
      return {
        userId: line.id,
        positionId: line.positionId,
        isMain: true,
        createdAt: now,
      }
    }

    const data = await new Promise((resolve, reject) => {
      const rowsUsers = []
      const rowsStudents = []
      const rowsUsersPositions = []
      const filePath = 'files/users-students.csv'
      const readStream = fs.createReadStream(filePath)
      readStream.pipe(csv())
        .on('data', (line) => {
          if (+line.id >= 237)rowsUsers.push(parseCsvLineUsers(line)) // 236 the latest id of users-teachers
          rowsStudents.push(parseCsvLineStudents(line))
          if (line.positionId) rowsUsersPositions.push(parseCsvLineUsersPositions(line))
        })
        .on('end', () => {
          resolve({ rowsUsers, rowsStudents, rowsUsersPositions })
        })
        .on('error', (err) => {
          reject(err)
        })
    })

    await queryInterface.bulkInsert('users', data.rowsUsers)
    await queryInterface.bulkInsert('students', data.rowsStudents)
    await queryInterface.bulkInsert('usersPositions', data.rowsUsersPositions)
    
    // set user id series
    const [result] = await queryInterface.sequelize.query('SELECT MAX(id) FROM users')
    const latestUserId = +result[0].max
    await queryInterface.sequelize.query(`SELECT setval('users_id_seq', ${latestUserId+1}, false)`)
  }
}
