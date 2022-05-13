const sortQuery = (sortby='createdAt', order='asc') => {
    return order == 'asc' ? sortby : '-' + sortby
}

export default sortQuery