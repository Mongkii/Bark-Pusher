import { syncStore, pushContent } from './utils';
import type { SyncStore, ContentToPush } from './types';

const enum PushType {
  TEXT = 'bark/text',
  LINK = 'bark/link',
  PAGE = 'bark/page',
}

// Storage 初始化
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get((storage) => {
    const thisStorage = storage as SyncStore;

    const hasDeviceList = (thisStorage.deviceList?.length || 0) > 0;

    const initStore: SyncStore = {
      isAutoCopy: thisStorage.isAutoCopy ?? true,
      isArchive: thisStorage.isArchive ?? false,
      shouldNotify: thisStorage.shouldNotify ?? true,
      deviceList: hasDeviceList ? thisStorage.deviceList : [],
      defaultDevice: hasDeviceList
        ? thisStorage.defaultDevice ?? (thisStorage.deviceList[0]?.url || '')
        : '',
    };
    syncStore.set(initStore);
  });
});

// 右键菜单相关
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: PushType.TEXT,
    title: '推送所选文字至 Bark',
    contexts: ['selection'],
  });
  chrome.contextMenus.create({
    id: PushType.PAGE,
    title: '推送当前页面至 Bark',
    contexts: ['page'],
  });
  chrome.contextMenus.create({
    id: PushType.LINK,
    title: '推送此链接至 Bark',
    contexts: ['link'],
  });
});

chrome.contextMenus.onClicked.addListener((event, tab) => {
  let content: ContentToPush = { text: '' };
  switch (event.menuItemId) {
    case PushType.TEXT:
      content.text = event.selectionText || '';
      break;
    case PushType.PAGE:
      content.text = tab?.title || '';
      content.url = event.pageUrl;
      break;
    case PushType.LINK:
      content.text = event.selectionText || event.linkUrl || '';
      content.url = event.linkUrl;
      break;
    default:
      break;
  }
  pushContent(content);
});
