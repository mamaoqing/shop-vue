import request from '../../utils/request';


export const listComp = query => {
    return request({
        url: '/api/system/comp/listCompany',
        method: 'get',
        params: query
    });
};

export const addComp = query => {
    return request({
        url: '/api/system/comp/insertCompany',
        method: 'post',
        data: query
    });
};

export const addAdminUser = query => {
    return request({
        url: '/api/system/user/addAdminUser',
        method: 'post',
        data: query
    });
};

export const updateComp = query => {
    return request({
        url: '/api/system/comp/updateCompany',
        method: 'put',
        data: query
    });
};


export const deleteComp = id => {
    return request({
        url: '/api/system/comp/'+id,
        method: 'delete'
    });
};