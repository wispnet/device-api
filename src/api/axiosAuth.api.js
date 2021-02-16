import axios from "axios";
import {apiRoot} from "./constants";

class Config {
  getConfig() {
    return {
      method: 'get',
      headers: { 
        'x-auth-token': localStorage.getItem("api-key")
      }
    };
  }
}
export default new Config;

