const auto_copy_checkbox = document.querySelector('#auto_copy_checkbox'),
    notify_checkbox = document.querySelector('#notify_checkbox');
const device_tbody = document.querySelector('#device_tbody');
const device_form = document.querySelector('#device_form'),
    device_form_title = document.querySelector('#device_form_title'),
    alias_input = document.querySelector('#alias_input'),
    url_input = document.querySelector('#url_input'),
    submit_button = document.querySelector('#submit_button'),
    cancel_button = document.querySelector('#cancel_button');
const footer = document.querySelector('.footer');

let url_before_edit = '';

const type = {
    DEFAULT: 'tool_default',
    EDIT: 'tool_edit',
    DELETE: 'tool_delete'
};

// Storage 相关操作
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

// 页面事件
const refreshDeviceList = async () => {
    const device_list = await getDeviceList(),
        default_device = await getDefaultDevice();
    device_tbody.innerHTML = '';
    device_list.forEach(({alias, url}) => {
        let tr = document.createElement('tr'),
            td_alias = document.createElement('td'),
            td_url = document.createElement('td'),
            tooltip = document.createElement('td');
        td_alias.textContent = alias; // 不使用 innerHTML 以避免 XSS
        td_alias.className = 'item_alias';
        td_url.textContent = url;
        td_url.className = 'item_url';
        tooltip.innerHTML = `<button class=${type.DEFAULT} title="设为默认"><i class="iconfont icon-shoucang"></i></button><button class=${type.EDIT} title="编辑设备"><i class="iconfont icon-bianji"></i></button><button class=${type.DELETE} title="删除设备"><i class="iconfont icon-shanchu"></i></button>`;
        tooltip.className = 'item_tooltip';
        tr.appendChild(td_alias);
        tr.appendChild(td_url);
        tr.appendChild(tooltip);
        if (url === default_device) {
            tr.classList.add('default_item');
        }
        device_tbody.appendChild(tr);
    })
};

const enterEditMode = (alias, url) => {
    device_form.classList.add('in_edit');
    device_form_title.textContent = '编辑设备';
    submit_button.textContent = '确定';
    alias_input.value = alias;
    url_input.value = url_before_edit = url;
};

const leaveEditMode = () => {
    device_form.classList.remove('in_edit');
    device_form_title.textContent = '添加设备';
    submit_button.textContent = '添加';
    alias_input.value = '';
    url_input.value = url_before_edit = '';
};

const initialize = async () => {
    if (location.hash !== '#fromPopup') {
        footer.classList.add('hidden');
    }
    auto_copy_checkbox.checked = await isAutoCopy();
    notify_checkbox.checked = await shouldNotify();
    await refreshDeviceList();
};

// 事件绑定
auto_copy_checkbox.addEventListener('change', function () {
    chrome.storage.sync.set({isAutoCopy: this.checked});
});

notify_checkbox.addEventListener('change', function () {
    chrome.storage.sync.set({shouldNotify: this.checked});
});

device_form.addEventListener('submit', async () => {
    const alias = alias_input.value.trim(),
        url = url_input.value.trim();
    if (!(alias && url)) {
        return;
    }
    const device_info = {alias, url};
    if (url_before_edit === '') {
        await addDevice(device_info);
    } else {
        await editDevice(url_before_edit, device_info);
        leaveEditMode();
    }
    await refreshDeviceList(); // submit 事件自带的刷新网页有时不会触发，因此加入强制触发
});

cancel_button.addEventListener('click', () => {
    leaveEditMode();
});

device_tbody.addEventListener('click', async event => {
    let tool_button;
    if (event.target) {
        if (event.target.nodeName.toUpperCase() === 'BUTTON') {
            tool_button = event.target;
        } else if (event.target.nodeName.toUpperCase() === 'I') {
            tool_button = event.target.parentNode;
        }
    }
    if (tool_button) {
        const tr = tool_button.parentNode.parentNode,
            alias = tr.querySelector('.item_alias').textContent,
            url = tr.querySelector('.item_url').textContent;
        switch (tool_button.className) {
            case type.DEFAULT:
                await setDefault(url);
                await refreshDeviceList();
                break;
            case type.EDIT:
                enterEditMode(alias, url);
                break;
            case type.DELETE:
                await removeDevice(url);
                await refreshDeviceList();
                break;
            default:
                break;
        }
    }
});

window.addEventListener('load', initialize);