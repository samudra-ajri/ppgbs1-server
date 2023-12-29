const fs = require('fs')
const csv = require('csv-parser')

module.exports = {
  async up(queryInterface, Sequelize) {
    const materials = {
      "1": 2296,
      "2": 2297,
      "3": 2298,
      "4": 2299,
      "5": 2300,
      "6": 2301,
      "7": 2302,
      "8": 2303,
      "9": 2304,
      "10": 2305,
      "11": 2306,
      "12": 2307,
      "13": 2308,
      "14": 2309,
      "15": 2310,
      "16": 2311,
      "17": 2312,
      "18": 2313,
      "19": 2314,
      "20": 2315,
      "21": 2316,
      "22": 2317,
      "23": 2318,
      "24": 2319,
      "25": 2320,
      "26": 2321,
      "27": 2322,
      "28": 2323,
      "29": 2324,
      "30": 2325,
      "31": 2326,
      "32": 2327,
      "33": 2328,
      "34": 2329,
      "35": 2330,
      "36": 2331,
      "37": 2332,
      "38": 2333,
      "39": 2334,
      "40": 2335,
      "41": 2336,
      "42": 2337,
      "43": 2338,
      "44": 2339,
      "45": 2340,
      "46": 2341,
      "47": 2342,
      "48": 2343,
      "49": 2344,
      "50": 2345,
      "51": 2346,
      "52": 2347,
      "53": 2348,
      "54": 2349,
      "55": 2350,
      "56": 2351,
      "57": 2352,
      "58": 2353,
      "59": 2354,
      "60": 2355,
      "61": 2356,
      "62": 2357,
      "63": 2358,
      "64": 2359,
      "65": 2360,
      "66": 2361,
      "67": 2362,
      "68": 2363,
      "69": 2364,
      "70": 2365,
      "71": 2366,
      "72": 2367,
      "73": 2368,
      "74": 2369,
      "75": 2370,
      "76": 2371,
      "77": 2372,
      "78": 2373,
      "79": 2374,
      "80": 2375,
      "81": 2376,
      "82": 2377,
      "83": 2378,
      "84": 2379,
      "85": 2380,
      "86": 2381,
      "87": 2382,
      "88": 2383,
      "89": 2384,
      "90": 2385,
      "91": 2386,
      "92": 2387,
      "93": 2388,
      "94": 2389,
      "95": 2390,
      "96": 2391,
      "97": 2392,
      "98": 2393,
      "99": 2394,
      "100": 2395,
      "101": 2396,
      "102": 2397,
      "103": 2398,
      "104": 2399,
      "105": 2400,
      "106": 2401,
      "107": 2402,
      "108": 2403,
      "109": 2404,
      "110": 2405,
      "111": 2406,
      "112": 2407,
      "113": 2408,
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
