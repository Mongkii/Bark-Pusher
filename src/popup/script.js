const target_selector = document.querySelector('#target_selector');
const send_page = document.querySelector('#send_page');
const send_clip = document.querySelector('#send_clip'),
    clipboard_area = document.querySelector('#clipboard_area');
const send_custom = document.querySelector('#send_custom'),
    custom_textarea = document.querySelector('#custom_textarea');

// Storage 相关操作
const getCurrentSelect = () => new Promise(resolve => {
    chrome.storage.local.get('currentSelect', storage => {
        resolve(storage.currentSelect);
    })
});

const setCurrentSelect = url => {
    chrome.storage.local.set({currentSelect: url});
};

// 页面事件
const getOption = ({alias, url}) => {
    let option = document.createElement('option');
    option.textContent = alias;
    option.value = url;
    return option;
};

const initialize = async () => {
    const device_list = await getDeviceList();
    target_selector.innerHTML = '';
    device_list.forEach(item => {
        const option = getOption(item);
        target_selector.appendChild(option);
    });
    target_selector.value = await getCurrentSelect();
    if (!target_selector.value) {
        target_selector.value = target_selector.children[0] && target_selector.children[0].value;
    }
};

// 事件绑定
send_page.addEventListener('click', async () => {
    const [text, url] = await new Promise(resolve => {
        chrome.tabs.query({active: true, currentWindow: true}, tab_list => {
            const tab = tab_list[0];
            if (tab) {
                resolve([tab.title, tab.url]);
            } else {
                resolve();
            }
        });
    });
    if (text && url) {
        const content = {text, url},
            target = target_selector.value;
        pushContent(content, target);
    }
});

send_clip.addEventListener('click', () => {
    clipboard_area.focus();
    document.execCommand('paste');
    const text = String(clipboard_area.value);
    if (text) {
        const content = {text},
            target = target_selector.value;
        pushContent(content, target);
    }
});

send_custom.addEventListener('click', () => {
    const text = custom_textarea.value;
    if (text) {
        const content = {text},
            target = target_selector.value;
        pushContent(content, target);
    }
});

target_selector.addEventListener('change', function () {
    setCurrentSelect(this.value);
});

window.addEventListener('load', initialize);