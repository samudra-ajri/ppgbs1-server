const gradeConstant = require("../constants/gradeConstant")

const ageUtils = {}

ageUtils.getAge = (birthDateString) => {
    const today = new Date()
    const birthDate = new Date(birthDateString)

    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDifference = today.getMonth() - birthDate.getMonth()

    // Adjust age if the birthday hasn't occurred this year yet
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }

    return age
}

ageUtils.getGrade = (birthDateString) => {
    let grade = 0
    const age = ageUtils.getAge(birthDateString)
    if (age > 4) grade = gradeConstant.PAUD
    if (age > 6) grade = gradeConstant.CR1
    if (age > 7) grade = gradeConstant.CR2
    if (age > 8) grade = gradeConstant.CR3
    if (age > 9) grade = gradeConstant.CR4
    if (age > 10) grade = gradeConstant.CR5
    if (age > 11) grade = gradeConstant.CR6
    if (age > 12) grade = gradeConstant.PR1
    if (age > 13) grade = gradeConstant.PR2
    if (age > 14) grade = gradeConstant.PR3
    if (age > 15) grade = gradeConstant.RM1
    if (age > 16) grade = gradeConstant.RM2
    if (age > 17) grade = gradeConstant.RM3
    if (age > 18) grade = gradeConstant.PN1
    if (age > 19) grade = gradeConstant.PN2
    if (age > 20) grade = gradeConstant.PN3
    if (age > 21) grade = gradeConstant.PN4
    return grade
}

module.exports = ageUtils