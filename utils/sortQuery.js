const sortQuery = (sortby='name', order='asc') => {
    return order == 'asc' ? sortby : '-' + sortby
}

export default sortQuery