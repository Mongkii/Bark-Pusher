<script lang="ts">
  import { onMount } from 'svelte';
  import { syncStore } from '../utils';
  import { addDevice, editDevice, removeDevice } from './utils';
  import type { Device } from '../types';

  let deviceList: Device[] = [];
  let defaultDevice = '';
  const refreshDeviceList = async () => {
    deviceList = await syncStore.get('deviceList');
    defaultDevice = await syncStore.get('defaultDevice');
  };

  let editSource: Device | null = null;
  $: isInEditMode = Boolean(editSource);

  const getEmptyDevice = (): Device => ({
    alias: '',
    url: '',
  });
  let deviceInEdit = getEmptyDevice();

  const setAsDefaultDevice = async (deviceUrl: Device['url']) => {
    await syncStore.set({ defaultDevice: deviceUrl });
    refreshDeviceList();
  };
  const editDeviceInList = (alias: Device['alias'], url: Device['url']) => {
    editSource = { alias, url };
    deviceInEdit = { alias, url };
  };
  const removeDeviceInList = async (deviceUrl: Device['url']) => {
    await removeDevice(deviceUrl);
    refreshDeviceList();
  };

  const exitEditMode = () => {
    editSource = null;
    deviceInEdit = getEmptyDevice();
  };

  const submitEdit = async () => {
    const [newAlias, newUrl] = [deviceInEdit.alias, deviceInEdit.url].map((str) => str.trim());
    if (!(newAlias && newUrl)) {
      return;
    }

    const newDeviceInfo: Device = { alias: newAlias, url: newUrl };
    if (isInEditMode) {
      await editDevice(editSource!.url, newDeviceInfo);
    } else {
      await addDevice(newDeviceInfo);
    }

    exitEditMode();
    await refreshDeviceList(); // submit 事件自带的刷新网页有时不会触发，因此加入强制触发
  };

  onMount(async () => {
    await refreshDeviceList();
  });
</script>

<h2 class="option-title">设备列表</h2>
<table class="device-table">
  <colgroup>
    <col class="col-alias" />
    <col class="col-url" />
    <col class="col-tools" />
  </colgroup>
  <thead>
    <tr>
      <th>名称</th>
      <th>URL</th>
      <th />
    </tr>
  </thead>
  <tbody>
    {#each deviceList as { alias, url }}
      <tr class:default-device={url === defaultDevice}>
        <td class="default-alias">{alias}</td>
        <td class="item_url">{url}</td>
        <td class="device-tools">
          <button class="tool-default" title="设为默认" on:click={() => setAsDefaultDevice(url)}>
            <i class="iconfont icon-shoucang" />
          </button>
          <button class="tool-edit" title="编辑设备" on:click={() => editDeviceInList(alias, url)}>
            <i class="iconfont icon-bianji" />
          </button>
          <button class="tool-delete" title="删除设备" on:click={() => removeDeviceInList(url)}>
            <i class="iconfont icon-shanchu" />
          </button>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
<form class="device-form" class:editing-form={isInEditMode}>
  <h3>{isInEditMode ? '编辑设备' : '添加设备'}</h3>
  <input type="text" placeholder="设备名称" required bind:value={deviceInEdit.alias} />
  <input
    type="url"
    placeholder="URL 地址，形如 http://abc.com/myurl/"
    pattern="^\s*https?:\/\/.+\/.+\/\s*$"
    title="必须以 http 或 https 开头，反斜杠结尾"
    required
    bind:value={deviceInEdit.url}
  />
  <div class="button-group">
    <button type="submit" class="btn-submit" on:click|preventDefault={submitEdit}>
      {isInEditMode ? '确定' : '添加'}
    </button>
    <button type="button" class="btn-cancel" on:click={exitEditMode}>取消</button>
  </div>
</form>

<style lang="scss">
  .device-table {
    width: 100%;
    text-align: left;
    overflow-wrap: break-word;
    table-layout: fixed;
    border-collapse: collapse;
    color: #666666;

    thead {
      border-bottom: 1px solid #cccccc;
    }
    th {
      padding-bottom: 4px;
    }

    tbody tr:hover {
      background-color: #f3f3f3;

      .device-tools {
        opacity: 1;
      }
    }

    td {
      padding: 4px 1px;
      border: none;
    }
  }

  .col-alias,
  .col-tools {
    width: 75px;
  }
  .col-url {
    width: 200px;
  }

  .device-tools {
    opacity: 0;
    text-align: right;

    button {
      box-sizing: border-box;
      width: 20px;
      height: 20px;
      background-color: #ffffff;
      border: 1px solid #aaaaaa;
      border-radius: 5px;
    }
  }

  .tool-default:hover {
    color: #ffa500;
  }
  .tool-edit:hover {
    color: #1e90ff;
  }
  .tool-delete:hover {
    color: #ff0000;
  }

  .default-device {
    font-weight: 700;

    .default-alias::before {
      content: '[默认] ';
    }

    .tool-default {
      visibility: hidden;
    }
  }

  .device-form {
    margin-bottom: 10px;

    > h3 {
      margin: 6px 0 6px;
      font-size: 1.2em;
      font-weight: 700;
    }

    input {
      display: block;
      box-sizing: border-box;
      width: 100%;
      margin-bottom: 6px;
      padding: 2px 5px;
    }
  }

  .button-group {
    text-align: right;

    button {
      width: 70px;
      height: 30px;
      border-radius: 8px;
    }

    .btn-submit {
      color: #ffffff;
      background-color: #d92323;
    }
    .btn-cancel {
      display: none;
      background-color: #ffffff;
      border: 1px solid #aaaaaa;
    }
  }

  .editing-form {
    .btn-cancel {
      display: inline-block;
      margin-left: 4px;
    }
    input {
      animation: blink 0.8s ease-in-out;
    }
  }

  @keyframes blink {
    15% {
      background-color: #feffcb;
    }
    30% {
      background-color: #ffffff;
    }
    50% {
      background-color: #feffcb;
    }
    80% {
      background-color: #ffffff;
    }
  }
</style>
