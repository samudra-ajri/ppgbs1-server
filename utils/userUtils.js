const organizationLevelsConstant = require("../constants/organizationLevelsConstant")
const positionTypesConstant = require("../constants/positionTypesConstant")

const userUtils = {}

userUtils.calculateAncestorIdScope = (session, ancestorId) => {
    // Access for PPG (organization level = 0) Admin
    if (session.position.orgLevel === organizationLevelsConstant.ppg) return ancestorId

    // Other Admins only can view users in the same level with the Admins
    // The list will return users in scope level 1 (hierarchy=1)
    const isAdmin = session.position.type === positionTypesConstant.ADMIN
    return isAdmin ? session.position.orgId : session.position.hierarchy[1]?.id
}

module.exports = userUtils