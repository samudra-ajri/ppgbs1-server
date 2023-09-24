const fs = require('fs')
const csv = require('csv-parser')

module.exports = {
  async up(queryInterface, Sequelize) {
    const materials = {
      "1": 2297,
      "10": 2306,
      "100": 2396,
      "101": 2397,
      "102": 2398,
      "103": 2399,
      "104": 2400,
      "105": 2401,
      "106": 2402,
      "107": 2403,
      "108": 2404,
      "109": 2405,
      "11": 2307,
      "110": 2406,
      "111": 2407,
      "112": 2408,
      "113": 2409,
      "12": 2308,
      "13": 2309,
      "14": 2310,
      "15": 2311,
      "16": 2312,
      "17": 2313,
      "18": 2314,
      "19": 2315,
      "2": 2298,
      "20": 2316,
      "21": 2317,
      "22": 2318,
      "23": 2319,
      "24": 2320,
      "25": 2321,
      "26": 2322,
      "27": 2323,
      "28": 2324,
      "29": 2325,
      "3": 2299,
      "30": 2326,
      "31": 2327,
      "32": 2328,
      "33": 2329,
      "34": 2330,
      "35": 2331,
      "36": 2332,
      "37": 2333,
      "38": 2334,
      "39": 2335,
      "4": 2300,
      "40": 2336,
      "41": 2337,
      "42": 2338,
      "43": 2339,
      "44": 2340,
      "45": 2341,
      "46": 2342,
      "47": 2343,
      "48": 2344,
      "49": 2345,
      "5": 2301,
      "50": 2346,
      "51": 2347,
      "52": 2348,
      "53": 2349,
      "54": 2350,
      "55": 2351,
      "56": 2352,
      "57": 2353,
      "58": 2354,
      "59": 2355,
      "6": 2302,
      "60": 2356,
      "61": 2357,
      "62": 2358,
      "63": 2359,
      "64": 2360,
      "65": 2361,
      "66": 2362,
      "67": 2363,
      "68": 2364,
      "69": 2365,
      "7": 2303,
      "70": 2366,
      "71": 2367,
      "72": 2368,
      "73": 2369,
      "74": 2370,
      "75": 2371,
      "76": 2372,
      "77": 2373,
      "78": 2374,
      "79": 2375,
      "8": 2304,
      "80": 2376,
      "81": 2377,
      "82": 2378,
      "83": 2379,
      "84": 2380,
      "85": 2381,
      "86": 2382,
      "87": 2383,
      "88": 2384,
      "89": 2385,
      "9": 2305,
      "90": 2386,
      "91": 2387,
      "92": 2388,
      "93": 2389,
      "94": 2390,
      "95": 2391,
      "96": 2392,
      "97": 2393,
      "98": 2394,
      "99": 2395,
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
      const filePath = 'files/users-completions-kmanasikhaji.csv'
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
