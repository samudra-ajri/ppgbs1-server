const fs = require('fs')
const csv = require('csv-parser')

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
        isActive: line.isActive,
        createdAt: now,
        updatedAt: now,
        createdBy: 1,
        updatedBy: 1,
      }
    }

    const parseCsvLineAdmins = (line) => {
      return {
        userId: line.id,
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
      const rowsAdmins = []
      const rowsUsersPositions = []
      const filePath = 'files/users-admins.csv'
      const readStream = fs.createReadStream(filePath)
      readStream.pipe(csv())
        .on('data', (line) => {
          rowsUsers.push(parseCsvLineUsers(line))
          rowsAdmins.push(parseCsvLineAdmins(line))
          if (line.positionId) rowsUsersPositions.push(parseCsvLineUsersPositions(line))
        })
        .on('end', () => {
          resolve({ rowsUsers, rowsAdmins, rowsUsersPositions })
        })
        .on('error', (err) => {
          reject(err)
        })
    })

    await queryInterface.bulkInsert('users', data.rowsUsers)
    await queryInterface.bulkInsert('admins', data.rowsAdmins)
    await queryInterface.bulkInsert('usersPositions', data.rowsUsersPositions)
    
    // set user id series
    const [result] = await queryInterface.sequelize.query('SELECT MAX(id) FROM users')
    const latestUserId = +result[0].max
    await queryInterface.sequelize.query(`SELECT setval('users_id_seq', ${latestUserId+1}, false)`)
  }
}
