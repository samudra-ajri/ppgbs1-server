import roleTypes from "../consts/roleTypes.js"

// @desc    Filter by manager scope
const filterManager = (user, search) => {
    switch (user.role) {
        case roleTypes.PPG:
            return { 
                $and: [ 
                    { role: { $in: [roleTypes.GENERUS, roleTypes.MT, roleTypes.MS] }},
                    { name: { $regex: new RegExp(search, 'i') }}
                ]
            }
        case roleTypes.PPD:
            return { 
                $and: [ 
                    { role: { $in: [roleTypes.GENERUS, roleTypes.MT, roleTypes.MS] }},
                    { name: { $regex: new RegExp(search, 'i') }},
                    { ds: user.ds }
                ]
            }
        case roleTypes.PPK:
            return { 
                $and: [ 
                    { role: { $in: [roleTypes.GENERUS, roleTypes.MT, roleTypes.MS] }},
                    { name: { $regex: new RegExp(search, 'i') }},
                    { klp: user.klp }
                ]
            }
        case roleTypes.MT:
        case roleTypes.MS:
            return { 
                $and: [
                    { role: { $in: [roleTypes.GENERUS] }},
                    { name: { $regex: new RegExp(search, 'i') }},
                    { ds: user.ds }
                ]
            }
        default:
            return { name: { $regex: new RegExp(search, 'i') }}
    }
}

export default filterManager