chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: push_type.TEXT,
        title: '发送所选文字至 Bark',
        contexts: ['selection'],
    });
    chrome.contextMenus.create({
        id: push_type.PAGE,
        title: '发送当前页面至 Bark',
        contexts: ['page']
    });
    chrome.contextMenus.create({
        id: push_type.LINK,
        title: '发送此链接至 Bark',
        contexts: ['link']
    })
});

chrome.contextMenus.onClicked.addListener((event, tab) => {
    let content = {};
    switch (event.menuItemId) {
        case push_type.TEXT:
            content.text = event.selectionText;
            break;
        case push_type.PAGE:
            content.text = tab.title;
            content.url = event.pageUrl;
            break;
        case push_type.LINK:
            content.text = event.selectionText;
            content.url = event.linkUrl;
            break;
        default:
            break;
    }
    sendRequest(content,`https://api.day.app/BtKzMXaqhuiVrLb73KfcFR/`);
});


