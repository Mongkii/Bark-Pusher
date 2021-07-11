export interface Device {
  alias: string;
  url: string;
}

export type ArchiveOption = 'default' | 'never' | 'always';

export interface SyncStore {
  isAutoCopy: boolean;
  archiveOption: ArchiveOption;
  pushSound: string;
  shouldNotify: boolean;
  rememberGroup: boolean;
  deviceList: Device[];
  defaultDevice: Device['url'];
  msgGroups: string[];
}

export interface LocalStore {
  currentSelect: Device['url'];
  currentGroup: string;
}

export interface ContentToPush {
  text: string;
  url?: string;
}
