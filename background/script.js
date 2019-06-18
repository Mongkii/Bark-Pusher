const type = {
    TEXT: 'bark_text',
    LINK: 'bark_link',
    PAGE: 'bark_page'
};

// Storage 初始化
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

// 右键菜单相关
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: type.TEXT,
        title: '发送所选文字至 Bark',
        contexts: ['selection'],
    });
    chrome.contextMenus.create({
        id: type.PAGE,
        title: '发送当前页面至 Bark',
        contexts: ['page']
    });
    chrome.contextMenus.create({
        id: type.LINK,
        title: '发送此链接至 Bark',
        contexts: ['link']
    })
});

chrome.contextMenus.onClicked.addListener((event, tab) => {
    let content = {};
    switch (event.menuItemId) {
        case type.TEXT:
            content.text = event.selectionText;
            break;
        case type.PAGE:
            content.text = tab.title;
            content.url = event.pageUrl;
            break;
        case type.LINK:
            content.text = event.selectionText || event.linkUrl;
            content.url = event.linkUrl;
            break;
        default:
            break;
    }
    sendRequest(content);
});


