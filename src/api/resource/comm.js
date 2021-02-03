import request from '../../utils/request';


export const listComm = query => {
    return request({
        url: '/api/resources/comm/listComm',
        method: 'get',
        params: query
    });
};

export const insertComm = query => {
    return request({
        url: '/api/resources/comm/saveComm',
        method: 'post',
        data: query
    });
};

export const updateComm = query => {
    return request({
        url: '/api/resources/comm/udpateComm',
        method: 'put',
        data: query
    });
};


export const deleteComm = id => {
    return request({
        url: '/api/resources/comm/'+id,
        method: 'delete'
    });
};