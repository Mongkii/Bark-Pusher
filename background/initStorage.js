chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(['isAutoCopy', 'deviceList', 'defaultDevice'], storage => {
        const is_auto_copy = storage.isAutoCopy,
            device_list = storage.deviceList,
            default_device = storage.defaultDevice;
        if (is_auto_copy === undefined) {
            chrome.storage.sync.set({isAutoCopy: true});
        }
        if (device_list === undefined || !(device_list.length > 0)) { // !(device_list.length > 0) 从而当不存在 length 属性时也会返回 true
            chrome.storage.sync.set({deviceList: [], defaultDevice: ''});
        } else if (default_device === undefined) {
            chrome.storage.sync.set({defaultDevice: device_list[0].url});
        }
    })
});
