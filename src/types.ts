export interface Device {
  alias: string;
  url: string;
}

export interface SyncStore {
  isAutoCopy: boolean;
  isArchive: boolean;
  shouldNotify: boolean;
  deviceList: Device[];
  defaultDevice: Device['url'];
}

export interface LocalStore {
  currentSelect: Device['url'];
}

export interface ContentToPush {
  text: string;
  url?: string;
}
