import axios from "axios";
import {apiRoot} from "./constants";

const config = {
    method: 'get',
    headers: { 
      'x-auth-token': ''
    }
  };

export default config;
