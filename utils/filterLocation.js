import roleTypes from "../consts/roleTypes.js"

// @desc    Filter by location
const filterLocation = (locations) => {
    const filtersStatus = { ds: { $ne: "MOVING" } }
    if (locations.length !== 0) {
        locations.push(filtersStatus)
        return { $and: locations }
    } else {
        return filtersStatus
    }
}

export default filterLocation