import request from '../../utils/request';


export const addRole = query => {
    return request({
        url: '/api/system/role/insertRole',
        method: 'post',
        data: query
    });
};

export const deleteRole = id => {

    return request({
        url: '/api/system/role/'+id,
        method: 'delete'
    });
};

export const updateRole = query => {

    return request({
        url: '/api/system/role/updateRole',
        method: 'put',
        data: query
    });
};
export const listRole = query => {
    return request({
        url: '/api/system/role/listRole',
        method: 'get',
        params: query
    });
};
export const listMenus = query => {
    return request({
        url: '/api/system/menu/get',
        method: 'get',
        params: query
    });
};

export const listChangeMenu = query => {
    return request({
        url: '/api/system/role/getRoleMenuByRoleId/'+query,
        method: 'get'
    });
};

export const setRoleMenu = query => {
    return request({
        url: '/api/system/role/setRoleMenu',
        method: 'post',
        data: query
    });
};


