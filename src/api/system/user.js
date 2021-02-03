import request from '../../utils/request';


export const listUser = query => {
    return request({
        url: '/api/system/user/listUser',
        method: 'get',
        params:query
    });
};

export const saveUser = query => {
    return request({
        url: '/api/system/user/insertUser',
        method: 'post',
        data: query
    });
};

export const updateUser = query => {
    return request({
        url: '/api/system/user/updateUser',
        method: 'put',
        data: query
    });
};

export const deleteUser = id => {
    return request({
        url: '/api/system/user/'+id,
        method: 'delete'
    });
};

// 获取用户角色
export const getUserRole = row => {
    return request({
        url: '/api/system/user/listUserRole',
        method: 'get',
        params:row
    });
};

// 设置用户角色
export const setUserRole = row => {
    return request({
        url: '/api/system/user/setUserRole',
        method: 'post',
        params:row
    });
};

