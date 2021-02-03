import request from '../../utils/request';


export const listOrg = query => {
    return request({
        url: '/api/system/org/listOrg',
        method: 'get',
        params: query
    });
};

export const insertOrg = query => {
    return request({
        url: '/api/system/org/insertOrg',
        method: 'post',
        data: query
    });
};



export const updateOrg = query => {
    return request({
        url: '/api/system/org/updateOrg',
        method: 'put',
        data: query
    });
};

export const deleteOrg = id => {
    return request({
        url: '/api/system/org/'+id,
        method: 'delete'
    });
};
