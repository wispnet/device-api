import { createAction } from "redux-act";
export const fetchDeviceList = createAction("fetch device list", (list)=>({list}));
export const setDeviceList = createAction("set device list", (list)=>({list}));
export const getDeviceListSaga = createAction("get device list saga");
export const setIsFetchingNow = createAction("frontend is fetching something", (isFetching)=>({isFetching}));
export const reBootDeviceSaga = createAction("reboot device", (deviceId)=>({deviceId}));
export const autoRebootTimeCheck = createAction("autoRebootTimeCheck");
export const setRebootDfs = createAction("setRebootDfs", (flag) => ({flag}));
export const setDisableToggle = createAction("setDisableToggle", (flag) => ({flag}));