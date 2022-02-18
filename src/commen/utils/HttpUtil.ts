import { userStore } from '~/store';
export const ServerRoot = 'http://ztlcs.yuedian.shop/api/'; //测试

export function fetchRequest({ url, method, body }) {
    const userInfo = userStore.me;
    const header = {
        'Content-Type': 'application/json;charset=UTF-8',
        token: userInfo?.token || '',
    };
    //假如没有body参数
    if (body === '') {
        return new Promise(function (resolve, reject) {
            fetch(ServerRoot + url, {
                method: method ? method : 'GET',
                headers: header,
            })
                .then((response) => response.json())
                .then((responseData) => {
                    resolve(responseData);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    } else {
        //带有网络参数格式
        return new Promise(function (resolve, reject) {
            fetch(ServerRoot + url, {
                method: method ? method : 'GET',
                headers: header,
                body: JSON.stringify(body),
            })
                .then((response) => response.json())
                .then((responseData) => {
                    resolve(responseData);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}
