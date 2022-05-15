import roleTypes from "../consts/roleTypes.js"

// @desc    Filter by manager scope
const filterManager = (user) => {
    switch (user.role) {
        case roleTypes.PPG:
            return {}
        case roleTypes.PPD:
            return {ds: user.ds}
        case roleTypes.PPK:
            return {klp: user.klp}
        default:
            return {}
    }
}

export default filterManager