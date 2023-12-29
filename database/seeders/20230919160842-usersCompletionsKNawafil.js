const fs = require('fs')
const csv = require('csv-parser')

module.exports = {
  async up(queryInterface, Sequelize) {
    const materials = {
      "1": 670,
      "2": 671,
      "3": 672,
      "4": 673,
      "5": 674,
      "6": 675,
      "7": 676,
      "8": 677,
      "9": 678,
      "10": 679,
      "11": 680,
      "12": 681,
      "13": 682,
      "14": 683,
      "15": 684,
      "16": 685,
      "17": 686,
      "18": 687,
      "19": 688,
      "20": 689,
      "21": 690,
      "22": 691,
      "23": 692,
      "24": 693,
      "25": 694,
      "26": 695,
      "27": 696,
      "28": 697,
      "29": 698,
      "30": 699,
      "31": 700,
      "32": 701,
      "33": 702,
      "34": 703,
      "35": 704,
      "36": 705,
      "37": 706,
      "38": 707,
      "39": 708,
      "40": 709,
      "41": 710,
      "42": 711,
      "43": 712,
      "44": 713,
      "45": 714,
      "46": 715,
      "47": 716,
      "48": 717,
      "49": 718,
      "50": 719,
      "51": 720,
      "52": 721,
      "53": 722,
      "54": 723,
      "55": 724,
      "56": 725,
      "57": 726,
      "58": 727,
      "59": 728,
      "60": 729,
      "61": 730,
      "62": 731,
      "63": 732,
      "64": 733,
      "65": 734,
      "66": 735,
      "67": 736,
      "68": 737,
      "69": 738,
      "70": 739,
      "71": 740,
      "72": 741,
      "73": 742,
      "74": 743,
      "75": 744,
      "76": 745,
      "77": 746,
      "78": 747,
      "79": 748,
      "80": 749,
      "81": 750,
      "82": 751,
      "83": 752,
      "84": 753,
      "85": 754,
      "86": 755,
      "87": 756,
      "88": 757,
      "89": 758,
      "90": 759,
      "91": 760,
      "92": 761,
      "93": 762,
      "94": 763,
      "95": 764,
      "96": 765,
      "97": 766,
      "98": 767,
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
      const filePath = 'files/users-completions-knawafil.csv'
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
