<script lang="ts">
  import { onMount } from 'svelte';
  import { syncStore } from '../utils';

  let msgGroups: string[] = [];

  const refreshMsgGroups = async () => {
    msgGroups = await syncStore.get('msgGroups');
  };

  let groupInEdit = '';

  let editSource = '';
  $: isInEditMode = Boolean(editSource);

  const editGroup = (group: string) => {
    editSource = group;
    groupInEdit = group;
  };

  const removeGroup = async (groupToRemove: string) => {
    await syncStore.set({ msgGroups: msgGroups.filter((group) => group !== groupToRemove) });
    refreshMsgGroups();
  };

  const exitEditMode = () => {
    editSource = '';
    groupInEdit = '';
  };

  const submitEdit = async () => {
    if (!groupInEdit) {
      return;
    }

    const existIndex = isInEditMode ? msgGroups.findIndex((group) => group === editSource) : -1;

    if (existIndex !== -1) {
      msgGroups[existIndex] = groupInEdit;
    } else {
      msgGroups.push(groupInEdit);
    }

    exitEditMode();
    await syncStore.set({ msgGroups });
    await refreshMsgGroups(); // submit 事件自带的刷新网页有时不会触发，因此加入强制触发
  };

  onMount(async () => {
    await refreshMsgGroups();
  });
</script>

<h2 class="option-title">分组列表</h2>
<table class="group-table">
  <colgroup>
    <col class="col-name" />
    <col class="col-tools" />
  </colgroup>
  <thead>
    <tr>
      <th>名称</th>
      <th />
    </tr>
  </thead>
  <tbody>
    {#each msgGroups as group}
      <tr>
        <td class="item_name">{group}</td>
        <td class="group-tools">
          <button class="tool-edit" title="编辑分组" on:click={() => editGroup(group)}>
            <i class="iconfont icon-bianji" />
          </button>
          <button class="tool-delete" title="删除分组" on:click={() => removeGroup(group)}>
            <i class="iconfont icon-shanchu" />
          </button>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
<form class="group-form" class:editing-form={isInEditMode}>
  <h3>{isInEditMode ? '编辑分组' : '添加分组'}</h3>
  <div class="input-area">
    <input class="input-box" type="text" required bind:value={groupInEdit} />
    <div class="button-group">
      <button type="submit" class="btn-submit" on:click|preventDefault={submitEdit}>
        {isInEditMode ? '确定' : '添加'}
      </button>
      <button type="button" class="btn-cancel" on:click={exitEditMode}>取消</button>
    </div>
  </div>
</form>

<style lang="scss">
  .group-table {
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

      .group-tools {
        opacity: 1;
      }
    }

    td {
      padding: 4px 1px;
      border: none;
    }
  }

  .col-name,
  .col-tools {
    width: 75px;
  }

  .group-tools {
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

  .tool-edit:hover {
    color: #1e90ff;
  }
  .tool-delete:hover {
    color: #ff0000;
  }

  .group-form {
    margin-bottom: 10px;

    > h3 {
      margin: 6px 0 6px;
      font-size: 1.2em;
      font-weight: 700;
    }
  }

  .input-area {
    display: flex;
    align-items: center;
  }

  .input-box {
    flex: 1;
    margin: 0;
    padding: 2px 5px;
  }

  .button-group {
    flex: none;
    margin-left: 10px;
    text-align: right;

    button {
      padding: 0 15px;
      height: 23px;
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
