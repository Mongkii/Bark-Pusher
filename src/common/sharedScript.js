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

const shouldNotify = () => new Promise(resolve => {
    chrome.storage.sync.get('shouldNotify', storage => {
        resolve(storage.shouldNotify);
    });
});

const pushContent = async ({text, url}, target) => {
    try {
        if (target === undefined) {
            target = await getDefaultDevice();
        }
        if (!target) { // 原写法：if (!(target = target || await getDefaultDevice()))，改成现在这样是为了 target === '' 时能报错而非获取默认值
            throw '没有目标设备，请先在设置中添加！';
        }
        const arg = '?' + (url ? `url=${url}` : await isAutoCopy() ? 'automaticallyCopy=1' : '');
        const should_notify = await shouldNotify();
        fetch(target + encodeURIComponent(text) + arg).then(response => {
            if (response.ok && should_notify) {
                chrome.notifications.create(undefined, {
                    type: 'basic',
                    iconUrl: '../img/icon.png',
                    title: '已推送至 Bark',
                    message: text
                });
            }
        });
    } catch (e) {
        alert(e);
    }
};