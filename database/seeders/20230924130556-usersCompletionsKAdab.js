const fs = require('fs')
const csv = require('csv-parser')

module.exports = {
  async up(queryInterface, Sequelize) {
    const materials = {
      "1": 486,
      "10": 495,
      "11": 496,
      "12": 497,
      "13": 498,
      "14": 499,
      "15": 500,
      "16": 501,
      "17": 502,
      "18": 503,
      "19": 504,
      "2": 487,
      "20": 505,
      "21": 506,
      "22": 507,
      "23": 508,
      "24": 509,
      "25": 510,
      "26": 511,
      "27": 512,
      "28": 513,
      "29": 514,
      "3": 488,
      "30": 515,
      "31": 516,
      "32": 517,
      "33": 518,
      "34": 519,
      "35": 520,
      "36": 521,
      "37": 522,
      "38": 523,
      "39": 524,
      "4": 489,
      "40": 525,
      "41": 526,
      "42": 527,
      "43": 528,
      "44": 529,
      "45": 530,
      "46": 531,
      "47": 532,
      "48": 533,
      "49": 534,
      "5": 490,
      "50": 535,
      "51": 536,
      "52": 537,
      "53": 538,
      "54": 539,
      "55": 540,
      "56": 541,
      "57": 542,
      "58": 543,
      "59": 544,
      "6": 491,
      "60": 545,
      "61": 546,
      "62": 547,
      "63": 548,
      "64": 549,
      "65": 550,
      "66": 551,
      "67": 552,
      "68": 553,
      "69": 554,
      "7": 492,
      "70": 555,
      "71": 556,
      "72": 557,
      "73": 558,
      "74": 559,
      "75": 560,
      "76": 561,
      "77": 562,
      "78": 563,
      "79": 564,
      "8": 493,
      "80": 565,
      "81": 566,
      "82": 567,
      "83": 568,
      "84": 569,
      "85": 570,
      "86": 571,
      "87": 572,
      "88": 573,
      "89": 574,
      "9": 494,
      "90": 575,
      "91": 576,
      "92": 577,
      "93": 578,
      "94": 579,
      "95": 580,
      "96": 581,
    }

    const now = Date.now()

    const parseCsv = (line) => {
      return {
        userId: line.id,
        materialId: line.materialId,
        createdAt: now,
      }
    }

    const data = await new Promise((resolve, reject) => {
      const rows = []
      const filePath = 'files/users-completions-kadab.csv'
      const readStream = fs.createReadStream(filePath)
      readStream.pipe(csv())
        .on('data', (line) => {
          const completedArray = JSON.parse(line.completed)
          completedArray.forEach(materialId => {
            line.materialId = materials[materialId]
            rows.push(parseCsv(line))
          })
        })
        .on('end', () => {
          resolve({ rows })
        })
        .on('error', (err) => {
          reject(err)
        })
    })
    await queryInterface.bulkInsert('usersCompletions', data.rows)
  }
}
