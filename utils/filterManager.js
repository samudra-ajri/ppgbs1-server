import roleTypes from "../consts/roleTypes.js"

// @desc    Filter by manager scope
const filterManager = (user, search, role) => {
    const roles = []
    const regex = new RegExp(search, 'i')
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
                    { $or: [{ name: regex }, { ds: regex }, { klp: regex }] },
                    { ds: { $ne: 'MOVING' } },
                    { klp: { $ne: 'MOVING' } }
                ]
            }
        case roleTypes.PPD:
            return { 
                $and: [ 
                    { role: { $in: roles }},
                    { $or: [{ name: regex }, { ds: regex }, { klp: regex }] },
                    { ds: user.ds }
                ]
            }
        case roleTypes.PPK:
            return { 
                $and: [ 
                    { role: { $in: roles }},
                    { $or: [{ name: regex }, { ds: regex }, { klp: regex }] },
                    { klp: user.klp }
                ]
            }
        case roleTypes.MT:
        case roleTypes.MS:
            return { 
                $and: [
                    { role: { $in: [roleTypes.GENERUS] }},
                    { $or: [{ name: regex }, { ds: regex }, { klp: regex }] },
                    { ds: user.ds }
                ]
            }
        default:
            return { $or: [{ name: regex }, { ds: regex }, { klp: regex }] }
    }
}

export default filterManager