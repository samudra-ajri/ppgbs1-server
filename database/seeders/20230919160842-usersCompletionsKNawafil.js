const fs = require('fs')
const csv = require('csv-parser')

module.exports = {
  async up(queryInterface, Sequelize) {
    const materials = {
      "1": 671,
      "10": 680,
      "11": 681,
      "12": 682,
      "13": 683,
      "14": 684,
      "15": 685,
      "16": 686,
      "17": 687,
      "18": 688,
      "19": 689,
      "2": 672,
      "20": 690,
      "21": 691,
      "22": 692,
      "23": 693,
      "24": 694,
      "25": 695,
      "26": 696,
      "27": 697,
      "28": 698,
      "29": 699,
      "3": 673,
      "30": 700,
      "31": 701,
      "32": 702,
      "33": 703,
      "34": 704,
      "35": 705,
      "36": 706,
      "37": 707,
      "38": 708,
      "39": 709,
      "4": 674,
      "40": 710,
      "41": 711,
      "42": 712,
      "43": 713,
      "44": 714,
      "45": 715,
      "46": 716,
      "47": 717,
      "48": 718,
      "49": 719,
      "5": 675,
      "50": 720,
      "51": 721,
      "52": 722,
      "53": 723,
      "54": 724,
      "55": 725,
      "56": 726,
      "57": 727,
      "58": 728,
      "59": 729,
      "6": 676,
      "60": 730,
      "61": 731,
      "62": 732,
      "63": 733,
      "64": 734,
      "65": 735,
      "66": 736,
      "67": 737,
      "68": 738,
      "69": 739,
      "7": 677,
      "70": 740,
      "71": 741,
      "72": 742,
      "73": 743,
      "74": 744,
      "75": 745,
      "76": 746,
      "77": 747,
      "78": 748,
      "79": 749,
      "8": 678,
      "80": 750,
      "81": 751,
      "82": 752,
      "83": 753,
      "84": 754,
      "85": 755,
      "86": 756,
      "87": 757,
      "88": 758,
      "89": 759,
      "9": 679,
      "90": 760,
      "91": 761,
      "92": 762,
      "93": 763,
      "94": 764,
      "95": 765,
      "96": 766,
      "97": 767,
      "98": 768,
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
