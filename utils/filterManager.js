import roleTypes from "../consts/roleTypes.js"

// @desc    Filter by manager scope
const filterManager = (user, search) => {
    let parameters = [
        { role: roleTypes.GENERUS },
        { name: { $regex: new RegExp(search, 'i') } }
    ]
    switch (user.role) {
        case roleTypes.PPG:
            return { name: { $regex: new RegExp(search, 'i') }}
        case roleTypes.PPD:
            parameters.push({ ds: user.ds })
            return { $and: parameters }
        case roleTypes.PPK:
            parameters.push({ klp: user.klp })
            return { $and: parameters }
        default:
            return { name: { $regex: new RegExp(search, 'i') }}
    }
}

export default filterManager