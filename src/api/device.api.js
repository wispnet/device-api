import { apiUrls } from './constants';
import axios from "axios";
import config from "./axiosAuth.api";
const baseURL = "https://my.wisp.net/nms/api/v2.1";
export default class DeviceApi {
  async getDevcieList() {
    try {
      const url = `${baseURL}/devices`;
      return await axios({ ...config.getConfig(), url });
    } catch (e) {
      console.log("error --->", e);
      return 'error';
    }
  }

  async getDeviceControlFrequency(deviceId) {
    try {
      const url = `${baseURL}/devices/airmaxes/${deviceId}/config/wireless`;
      return await axios({ ...config.getConfig(), url });
    } catch (e) {
      console.log("error --->", e);
      return 'error';
    }
  }

  async getDistonnectedStations(deviceId) {
    try {
      const url = `${baseURL}/devices/airmaxes/${deviceId}/stations`;
      return await axios({ ...config.getConfig(), url });
    } catch (e) {
      console.log("error --->", e);
      return 'error';
    }
  }

  async reBootDevice(deviceId) {
    try {
      const url = `${baseURL}/devices/${deviceId}/restart`;
      return await axios({ ...config.getConfig(), url, method: "post" });
    } catch (e) {
      console.log("error --->", e);
      return "error";
    }
  }
}