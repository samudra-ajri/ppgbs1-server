const paginationhUtils = {}

paginationhUtils.paginate = (data) => {
    const { count, totalCount, page, pageSize } = data
    const currentPage = Number(page)
    const total = Number(totalCount)
    const hasNextPage = (page * pageSize) < total
    const hasPrevPage = Number(page) !== 1
    return {
        currentPage,
        count,
        total,
        hasPrevPage,
        hasNextPage,
    }
}

module.exports = paginationhUtils