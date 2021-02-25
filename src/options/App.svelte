<script lang="ts">
  import OptionList from './OptionList.svelte';
  import DeviceList from './DeviceList.svelte';

  const isFromPopup = location.hash === '#fromPopup';
</script>

<OptionList />
<DeviceList />
<div class="footer" class:hidden={!isFromPopup}>
  <a href="/popup/index.html"><i class="iconfont icon-undo" />返回</a>
</div>

<style lang="scss">
  :global(body) {
    width: 350px;
    margin: 15px 10px 10px;
  }

  .footer {
    &.hidden {
      visibility: hidden;
    }
    a .iconfont {
      display: inline-block;
      margin-right: 6px;
      transform: scale(1.5);
    }
  }
</style>
