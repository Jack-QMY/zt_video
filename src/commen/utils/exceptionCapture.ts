export async function exceptionCapture(asyncFunc: () => Promise<any>) {
    try {
        const res = await asyncFunc();
        return [null, res];
    } catch (err) {
        const error: { [key: string]: any } = {};
        if (typeof err === 'string') {
            error.message = err.replace('接口错误解析 ', '');
        } else if (err !== null && typeof err === 'object' && typeof err.message === 'string') {
            error.message = err.message.replace('接口错误解析 ', '');
        }
        return [error, null];
    }
}
