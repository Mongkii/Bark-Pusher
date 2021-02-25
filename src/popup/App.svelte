<script lang="ts">
  import { onMount } from 'svelte';
  import { localStore, syncStore, pushContent } from '../utils';
  import type { Device } from '../types';

  let sendTarget: Device['url'] = '';

  const sendCurPage = async () => {
    const [text, url] = await new Promise<[string | undefined, string | undefined]>((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabList) => {
        const tab = tabList[0];
        resolve(tab ? [tab.title, tab.url] : ['', '']);
      });
    });
    if (text && url) {
      pushContent({ text, url }, sendTarget);
    }
  };

  let clipboardTextArea: HTMLTextAreaElement;
  const sendClipboard = () => {
    clipboardTextArea.focus();
    document.execCommand('paste');
    const text = String(clipboardTextArea.value).trim();
    if (text) {
      pushContent({ text }, sendTarget);
    }
  };

  let textAreaValue = '';
  const sendCustomText = () => {
    const text = textAreaValue.trim();
    if (text) {
      pushContent({ text }, sendTarget);
    }
  };

  let deviceList: Device[] = [];

  onMount(async () => {
    deviceList = await syncStore.get('deviceList');
    sendTarget = (await localStore.get('currentSelect')) || deviceList[0]?.url || '';
  });
</script>

<div class="send-target">
  <span>目标设备</span>
  <span class="select-wrapper">
    <select bind:value={sendTarget} on:blur={() => localStore.set({ currentSelect: sendTarget })}>
      {#each deviceList as { alias, url }}
        <option value={url}>{alias}</option>
      {/each}
    </select>
  </span>
</div>
<div class="shortcuts">
  <button class="send-page" on:click={sendCurPage}>
    <i class="iconfont icon-computer" />发送页面网址
  </button>
  <button class="send-clipboard" on:click={sendClipboard}>
    <i class="iconfont icon-task" />发送剪贴板内容
  </button>
  <textarea class="clipboard-area" tabindex="-1" bind:this={clipboardTextArea} />
</div>
<div class="send-custom-area">
  <h3>发送自定义文字</h3>
  <div class="custom-main">
    <textarea placeholder="输入后，点击右下角按钮发送" bind:value={textAreaValue} />
    <button class="send-custom" on:click={sendCustomText}>发送</button>
  </div>
</div>
<div class="footer">
  <a href="/options/index.html#fromPopup"><i class="iconfont icon-setup" />设置</a>
</div>

<style lang="scss">
  :global(body) {
    width: 350px;
    margin: 15px 10px 10px;
  }

  button {
    height: 35px;
    border-radius: 8px;
  }

  .iconfont {
    display: inline-block;
    margin-right: 6px;
    transform: scale(1.5); /* 使用 transform 放大而非改字号，以使 iconfont 保持垂直居中 */
  }

  .send-target {
    margin-bottom: 10px;
    text-align: right;
  }

  .select-wrapper {
    border-bottom: 1px solid #000000;
  }
  select {
    background-color: transparent;
    border: none;
  }

  .shortcuts {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    > button {
      flex: none;
      width: 170px;
      color: #ffffff;
    }
  }

  .send-page {
    background-color: #3d87dc;
  }

  .send-clipboard {
    background-color: #60a604;
  }

  .clipboard-area {
    position: absolute;
    z-index: -1;
    opacity: 0;
  }

  .send-custom-area {
    h3 {
      margin: 10px 0 6px 2px; /* 2px 的 margin-left 起到视觉对齐效果 */
      font-size: 1.3em;
    }
  }

  .custom-main {
    display: flex;
    margin-bottom: 10px;

    textarea {
      flex: 1;
      height: 150px;
      padding: 5px;
      resize: vertical;
      /* overflow-y: scroll; 默认样式似乎更自然*/
    }
  }

  .send-custom {
    align-self: flex-end;
    width: 70px;
    margin-left: 10px;
    background-color: #d92323;
    color: #ffffff;
  }
</style>
