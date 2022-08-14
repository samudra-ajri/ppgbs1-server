import roleTypes from "../consts/roleTypes.js"

// @desc    Filter by manager scope
const filterManager = (user, search, role) => {
    const roles = []
    if (role?.toUpperCase() === roleTypes.GENERUS) {
        roles.push(roleTypes.GENERUS)
    } else if (role?.toUpperCase() === 'MUBALLIGH') {
        roles.push(roleTypes.MT, roleTypes.MS)
    } else {
        roles.push(roleTypes.GENERUS, roleTypes.MT, roleTypes.MS)
    }

    switch (user.role) {
        case roleTypes.PPG:
            return { 
                $and: [ 
                    { role: { $in: roles }},
                    { name: { $regex: new RegExp(search, 'i') }},
                    { ds: { $ne: 'MOVING' } },
                    { klp: { $ne: 'MOVING' } }
                ]
            }
        case roleTypes.PPD:
            return { 
                $and: [ 
                    { role: { $in: roles }},
                    { name: { $regex: new RegExp(search, 'i') }},
                    { ds: user.ds }
                ]
            }
        case roleTypes.PPK:
            return { 
                $and: [ 
                    { role: { $in: roles }},
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