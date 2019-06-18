const sendRequest = async ({text, url}, target) => {
    try {
        if (target === undefined) {
            target = await getDefaultDevice();
        }
        if (!target) { // 原写法：if (!(target = target || await getDefaultDevice()))，改成现在这样是为了 target === '' 时能报错而非获取默认值
            throw '没有目标设备，请先在设置中添加！';
        }
        const arg = '?' + (url ? `url=${url}` : await isAutoCopy() ? 'automaticallyCopy=1' : '');
        fetch(target + encodeURIComponent(text) + arg);
    } catch (e) {
        alert(e);
    }
};

const getDefaultDevice = () => new Promise(resolve => {
    chrome.storage.sync.get('defaultDevice', storage => {
        resolve(storage.defaultDevice);
    });
});

const getDeviceList = () => new Promise(resolve => {
    chrome.storage.sync.get('deviceList', storage => {
        resolve(storage.deviceList);
    });
});

const isAutoCopy = () => new Promise(resolve => {
    chrome.storage.sync.get('isAutoCopy', storage => {
        resolve(storage.isAutoCopy);
    });
});