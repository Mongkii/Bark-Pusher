const auto_copy_checkbox = document.querySelector('#auto_copy_checkbox');
const device_tbody = document.querySelector('#device_tbody');
const device_form = document.querySelector('#device_form'),
    device_form_title = document.querySelector('#device_form_title'),
    alias_input = document.querySelector('#alias_input'),
    url_input = document.querySelector('#url_input'),
    submit_button = document.querySelector('#submit_button'),
    cancel_button = document.querySelector('#cancel_button');
const footer = document.querySelector('.footer');

let url_before_edit = '';

const initialize = async () => {
    if (location.hash === '#fromPopup') {
        footer.removeAttribute('hidden');
    }
    auto_copy_checkbox.checked = await isAutoCopy();
    await refreshDeviceList();
};

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
        tooltip.innerHTML = `<button class=${tool_type.DEFAULT} title="设为默认"><i class="iconfont icon-shoucang"></i></button><button class=${tool_type.EDIT} title="编辑设备"><i class="iconfont icon-bianji"></i></button><button class=${tool_type.DELETE} title="删除设备"><i class="iconfont icon-shanchu"></i></button>`;
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

auto_copy_checkbox.addEventListener('change', function () {
    chrome.storage.sync.set({isAutoCopy: this.checked});
});

device_form.addEventListener('submit', async () => {
    const device_info = {alias: alias_input.value, url: url_input.value};
    if (url_before_edit === '') {
        await addDevice(device_info);
    } else {
        await editDevice(url_before_edit, device_info);
        leaveEditMode();
    }
    // submit 行为会自动刷新页面，无需插入 refreshDeviceList 函数
});

cancel_button.addEventListener('click', () => {
    leaveEditMode();
});

device_tbody.addEventListener('click', async event => {
    let tool_button;
    if (event.target) {
        if (event.target.nodeName.toUpperCase() === 'BUTTON') {
            tool_button = event.target;
        } else if (event.target.nodeName.toUpperCase()==='I') {
            tool_button = event.target.parentNode;
        }
    }
    if (tool_button) {
        const tr = tool_button.parentNode.parentNode,
            alias = tr.querySelector('.item_alias').textContent,
            url = tr.querySelector('.item_url').textContent;
        switch (tool_button.className) {
            case tool_type.DEFAULT:
                await setDefault(url);
                await refreshDeviceList();
                break;
            case tool_type.EDIT:
                enterEditMode(alias, url);
                break;
            case tool_type.DELETE:
                await removeDevice(url);
                await refreshDeviceList();
                break;
            default:
                break;
        }
    }
});

window.addEventListener('load', initialize);
