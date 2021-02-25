import { syncStore } from '../utils';
import type { Device } from '../types';

// SyncStore 的相关编辑操作
const getPrevDeviceInfo = async () => {
  const result = await syncStore.get(['deviceList', 'defaultDevice']);
  return {
    prevDeviceList: result.deviceList,
    prevDefaultDevice: result.defaultDevice,
  };
};
const setNewDeviceInfo = (newDeviceList: Device[], newDefaultDevice: Device['url']) =>
  syncStore.set({ deviceList: newDeviceList, defaultDevice: newDefaultDevice }, true);

export const addDevice = async (deviceToAdd: Device) => {
  const { prevDeviceList, prevDefaultDevice } = await getPrevDeviceInfo();

  const existIndex = prevDeviceList.findIndex((device) => device.url === deviceToAdd.url);

  const newDeviceList = [...prevDeviceList];
  if (existIndex !== -1) {
    newDeviceList[existIndex] = deviceToAdd;
  } else {
    newDeviceList.push(deviceToAdd);
  }
  let newDefaultDevice: Device['url'] = prevDefaultDevice;
  if (newDeviceList.length === 1 || prevDefaultDevice === '') {
    newDefaultDevice = newDeviceList[0]?.url || '';
  }

  await setNewDeviceInfo(newDeviceList, newDefaultDevice);
};

export const removeDevice = async (removeUrl: Device['url']) => {
  const { prevDeviceList, prevDefaultDevice } = await getPrevDeviceInfo();

  const removeIndex = prevDeviceList.findIndex((device) => device.url === removeUrl);
  if (removeIndex === -1) {
    return;
  }

  const newDeviceList = [...prevDeviceList];
  newDeviceList.splice(removeIndex, 1);
  const newDefaultDevice =
    prevDefaultDevice === removeUrl ? newDeviceList[0]?.url || '' : prevDefaultDevice;

  await setNewDeviceInfo(newDeviceList, newDefaultDevice);
};

export const editDevice = async (editUrl: Device['url'], newDeviceInfo: Device) => {
  const { prevDeviceList, prevDefaultDevice } = await getPrevDeviceInfo();

  const editIndex = prevDeviceList.findIndex((device) => device.url === editUrl);
  if (editIndex === -1) {
    return;
  }

  const newDeviceList = [...prevDeviceList];
  newDeviceList[editIndex] = newDeviceInfo;
  const newDefaultDevice = prevDefaultDevice === editUrl ? newDeviceInfo.url : prevDefaultDevice;

  await setNewDeviceInfo(newDeviceList, newDefaultDevice);
};
