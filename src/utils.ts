import type { SyncStore, LocalStore, ContentToPush } from './types';

type Store = SyncStore | LocalStore;

interface SetStore<T extends Store> {
  (newStorage: Partial<T>): void;
  (newStorage: Partial<T>, asPromise: true): Promise<void>;
}
interface GetStore<T extends Store> {
  <K extends keyof T>(keys: K[]): Promise<Pick<T, K>>; // K[] 要放在上面，否则 TS 语法提示会有点问题
  <K extends keyof T>(key: K): Promise<T[K]>;
}

interface StoreFunc<T extends Store> {
  set: SetStore<T>;
  get: GetStore<T>;
}

interface StoreFuncFactory {
  (type: 'local'): StoreFunc<LocalStore>;
  (type: 'sync'): StoreFunc<SyncStore>;
}
const storeFuncFactory: StoreFuncFactory = (type: 'local' | 'sync'): any => {
  const set: SetStore<Store> = (newStore: Partial<Store>, asPromise?: true): any => {
    if (!asPromise) {
      return chrome.storage[type].set(newStore);
    }
    return new Promise<void>((resolve) => {
      chrome.storage[type].set(newStore, () => {
        resolve();
      });
    });
  };

  const get: GetStore<Store> = <K extends keyof Store>(key: K | K[]): any =>
    new Promise((resolve) => {
      chrome.storage[type].get(key, (store) => {
        if (Array.isArray(key)) {
          resolve(store);
          return;
        }
        resolve((store as Store)[key]);
      });
    });

  return { get, set };
};

export const localStore = storeFuncFactory('local');
export const syncStore = storeFuncFactory('sync');

export const pushContent = async ({ text, url }: ContentToPush, target?: string) => {
  try {
    // 没有写成 `if (!(target = target || await getStorage('defaultDevice')))`
    // 是为了 target === '' 时能报错而非获取默认值
    if (target === undefined) {
      target = await syncStore.get('defaultDevice');
    }

    if (!target) {
      throw '没有目标设备，请先在设置中添加！';
    }

    const archiveOption = await syncStore.get('archiveOption');
    const pushSound = await syncStore.get('pushSound');

    const paramsValidator: { [paramStr: string]: boolean } = {
      [`url=${url}`]: Boolean(url),
      ['automaticallyCopy=1']: !url && (await syncStore.get('isAutoCopy')),
      ['isArchive=1']: archiveOption === 'always',
      ['isArchive=0']: archiveOption === 'never',
      [`sound=${pushSound}`]: Boolean(pushSound),
    };

    const validParams = Object.keys(paramsValidator)
      .filter((param) => paramsValidator[param])
      .join('&');
    const paramStr = validParams ? `?${validParams}` : '';

    const shouldNofity = await syncStore.get('shouldNotify');

    fetch(`${target}${encodeURIComponent(text)}${paramStr}`).then((response) => {
      if (response.ok && shouldNofity) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: '/assets/icon.png',
          title: '已推送至 Bark',
          message: text,
        });
      }
    });
  } catch (e) {
    alert(e);
  }
};
