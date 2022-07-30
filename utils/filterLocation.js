import roleTypes from "../consts/roleTypes.js"

// @desc    Filter by location
const filterLocation = (locations) => {
    if (locations.length !== 0) {
        return { $and: locations }
    } else {
        return {}
    }
}

export default filterLocation