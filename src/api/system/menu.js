import request from '../../utils/request';


export const getMenuList = query => {
    return request({
        url: '/api/system/menu/get',
        method: 'get',
        params: query
    });
};

export const addMenu = query => {
    return request({
        url: '/api/system/menu/insertMenu',
        method: 'post',
        data: query
    });
};

export const updateMenu = query => {
    return request({
        url: '/api/system/menu/updateMenu',
        method: 'put',
        data: query
    });
};


export const deleteMenu = id => {
    return request({
        url: '/api/system/menu/'+id,
        method: 'delete'
    });
};