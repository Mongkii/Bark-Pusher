const push_type = {
    TEXT: 'bark_text',
    LINK: 'bark_link',
    PAGE: 'bark_page'
};

const tool_type = {
    DEFAULT: 'tool_default',
    EDIT: 'tool_edit',
    DELETE: 'tool_delete'
};

const sendRequest = async ({text, url}, target) => {
    try {
        if (target === undefined) {
            target = await getDefaultDevice();
        }
        if (!target) { // 原写法：if (!(target = target || await getDefaultDevice()))，改成现在这样是为了 target === '' 时能报错而非获取默认值
            throw '尚未设置目标设备！';
        }
        const arg = '?' + (url ? `url=${url}` : await isAutoCopy() ? 'automaticallyCopy=1' : '');
        fetch(target + encodeURIComponent(text) + arg);
    } catch (e) {
        alert(e);
    }
};

const getCurrentSelect = () => new Promise(resolve => {
    chrome.storage.local.get('currentSelect', storage => {
        resolve(storage.currentSelect);
    })
});

const setCurrentSelect = url => {
    chrome.storage.local.set({currentSelect: url});
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

const setDefault = url => new Promise(resolve => {
    chrome.storage.sync.set({defaultDevice: url}, () => {
        resolve();
    });
});

const addDevice = device_to_add => new Promise(resolve => {
    chrome.storage.sync.get(['deviceList', 'defaultDevice'], storage => {
        let device_list = storage.deviceList.concat(),
            default_device = storage.defaultDevice;
        const exist_index = device_list.findIndex(item => item.url === device_to_add.url),
            add_index = exist_index + 1 ? exist_index : device_list.length; // 简易的去重
        device_list[add_index] = device_to_add;
        if (device_list.length === 1 || default_device === '') {
            default_device = device_list[0].url;
        }
        chrome.storage.sync.set({deviceList: device_list, defaultDevice: default_device}, () => {
            resolve();
        });
    });
});

const removeDevice = remove_url => new Promise(resolve => {
    chrome.storage.sync.get(['deviceList', 'defaultDevice'], storage => {
        let device_list = storage.deviceList.concat(),
            default_device = storage.defaultDevice;
        const rm_index = device_list.findIndex(item => item.url === remove_url);
        if (rm_index + 1) {
            device_list.splice(rm_index, 1);
        }
        if (default_device === remove_url) {
            default_device = (device_list[0] && device_list[0].url) || '';
        }
        chrome.storage.sync.set({deviceList: device_list, defaultDevice: default_device}, () => {
            resolve();
        });
    });
});

const editDevice = (edit_url, new_info) => new Promise(resolve => {
    chrome.storage.sync.get(['deviceList', 'defaultDevice'], storage => {
        let device_list = storage.deviceList.concat(),
            default_device = storage.defaultDevice;
        const edit_index = device_list.findIndex(item => item.url === edit_url);
        if (edit_index + 1) {
            device_list[edit_index] = new_info;
        }
        if (default_device === edit_url) {
            default_device = new_info.url;
        }
        chrome.storage.sync.set({deviceList: device_list, defaultDevice: default_device}, () => {
            resolve();
        });
    });
});
