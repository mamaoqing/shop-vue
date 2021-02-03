import request from '../../utils/request';


export const listDict = query => {
    return request({
        url: '/api/system/dict/listDict',
        method: 'get',
        params:query
    });
};
export const getDictItemByDictId = query => {
    return request({
        url: '/api/system/dict/childListDict/'+query,
        method: 'get'
    });
};

export const saveDict = query => {
    return request({
        url: '/api/system/dict/saveDict',
        method: 'post',
        data: query
    });
};

export const updateDict = query => {
    return request({
        url: '/api/system/dict/updateDict',
        method: 'put',
        data: query
    });
};

export const deleteDict = id => {
    return request({
        url: '/api/system/dict/'+id,
        method: 'delete'
    });
};

