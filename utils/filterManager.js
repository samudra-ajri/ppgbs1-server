import roleTypes from "../consts/roleTypes.js"

// @desc    Filter by manager scope
const filterManager = (user, search, role, needresetpassword) => {
    let filters = null
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
            filters = {
                $and: [
                    { role: { $in: roles } },
                    { $or: [{ name: regex }, { ds: regex }, { klp: regex }] },
                    { ds: { $ne: 'MOVING' } },
                    { klp: { $ne: 'MOVING' } }
                ]
            }
            break
        case roleTypes.PPD:
            filters = {
                $and: [
                    { role: { $in: roles } },
                    { $or: [{ name: regex }, { ds: regex }, { klp: regex }] },
                    { ds: user.ds }
                ]
            }
            break
        case roleTypes.PPK:
            filters = {
                $and: [
                    { role: { $in: roles } },
                    { $or: [{ name: regex }, { ds: regex }, { klp: regex }] },
                    { klp: user.klp }
                ]
            }
            break
        case roleTypes.MT:
        case roleTypes.MS:
            filters = {
                $and: [
                    { role: { $in: [roleTypes.GENERUS] } },
                    { $or: [{ name: regex }, { ds: regex }, { klp: regex }] },
                    { ds: user.ds }
                ]
            }
            break
        default:
            filters = { $or: [{ name: regex }, { ds: regex }, { klp: regex }] }
    }

    filterByNeedResetPasswordStatus(filters, needresetpassword)
    return filters
}

const filterByNeedResetPasswordStatus = (filters, needresetpassword) => {
    if (needresetpassword === 'true') {
        filters['$and'].push({ resetPasswordToken: { $ne: null } });
    } 
}

export default filterManager