<script lang="ts">
  import { onMount } from 'svelte';
  import { syncStore } from '../utils';
  import type { SyncStore } from '../types';

  type Options = Pick<SyncStore, 'isAutoCopy' | 'shouldNotify' | 'archiveOption' | 'pushSound'>;
  let options: Options = {
    isAutoCopy: true,
    shouldNotify: true,
    archiveOption: 'default',
    pushSound: '',
  };

  const updateOption = (optionKey: keyof Options) => {
    syncStore.set({ [optionKey]: options[optionKey] });
  };

  onMount(async () => {
    options = await syncStore.get(['isAutoCopy', 'shouldNotify', 'archiveOption', 'pushSound']);
  });
</script>

<div class="option-list">
  <h2 class="option-title">通用设置</h2>
  <div class="option-item">
    <label>
      推送文字时，自动复制到 iOS 剪贴板
      <input
        type="checkbox"
        bind:checked={options.isAutoCopy}
        on:change={() => updateOption('isAutoCopy')}
      />
    </label>
  </div>
  <div class="option-item">
    <span>iOS 端是否保存推送历史</span>
    <span class="select-wrapper">
      <select bind:value={options.archiveOption} on:blur={() => updateOption('archiveOption')}>
        <option value="default">跟随手机设置</option>
        <option value="always">始终保存</option>
        <option value="never">永不保存</option>
      </select>
    </span>
  </div>
  <div class="option-item">
    <label>
      推送铃声
      <input
        type="text"
        placeholder="默认铃声"
        bind:value={options.pushSound}
        on:blur={() => updateOption('pushSound')}
      />
    </label>
  </div>
  <div class="option-item">
    <label>
      推送完成后发送通知
      <input
        type="checkbox"
        bind:checked={options.shouldNotify}
        on:change={() => updateOption('shouldNotify')}
      />
    </label>
  </div>
</div>

<style lang="scss">
  .option-title {
    margin: 15px 0 6px;
    font-size: 1.3em;
    font-weight: 700;
  }

  .option-item {
    margin-bottom: 6px;

    select,
    input {
      margin: 0 0 0 4px;
      font-size: 12px;
    }

    .select-wrapper {
      border-bottom: 1px solid #333333;
    }
    select {
      color: #333333;
      background-color: transparent;
      border: none;
    }

    input[type='text'] {
      border: none;
      border-bottom: 1px solid #333333;
    }
    input[type='checkbox'] {
      vertical-align: middle;
    }
  }
</style>
