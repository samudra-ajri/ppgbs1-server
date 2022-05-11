const getDaysInMonth = (month, year) => {
    // Here January is 1 based
    // Day 0 is the last day in the previous month
    return new Date(year, month, 0).getDate()
    // Here January is 0 based
    // will return new Date(year, month+1, 0).getDate();
}

const validateDate = (year, month, day) => {
    return ((month <= 12) && (day <= getDaysInMonth(month, year)))
}

export default validateDate
