import roleTypes from "../consts/roleTypes.js"

// @desc    Filter by manager scope
const filterManager = (user) => {
    let parameters = [
        { role: roleTypes.GENERUS }
    ]
    switch (user.role) {
        case roleTypes.PPG:
            return {}
        case roleTypes.PPD:
            parameters.push({ ds: user.ds })
            return { $and: parameters }
        case roleTypes.PPK:
            parameters.push({ klp: user.klp })
            return { $and: parameters }
        default:
            return {}
    }
}

export default filterManager