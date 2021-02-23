import { createReducer } from "redux-act";
import * as actions from "./devices.action";

const initialState = {
    devices: [],
    isFetching:false,
    rebootDfs:false,
    toggleDisabled:false,
    dtLastCheck:localStorage.getItem("dtLastCheck"),
    bAutoReboot:localStorage.getItem("bAutoReboot") || false
};

const reducer = {
    [actions.fetchDeviceList]: (state, data) => {
        // let devices = Array.from(data.list);
        let devices = [];
        data.list.forEach(ele => {
            const identification =  ele.identification;
            const overview =  ele.overview;
            const id = identification.id;
            const siteName = identification.site.name;
            const name = identification.name;
            
            let linkScore = "";
            try {
                linkScore = overview.linkScore.linkScore;
            } catch (error) {
                // console.log(error);
            }

            let overviewFrequency = "";
            try {
                overviewFrequency = overview.frequency;
            } catch (error) {
                // console.log(error);
            }
            const controlFrequency = identification.controlFrequency;
            let isRed = false;
            if(controlFrequency != overviewFrequency) isRed = true;

            let overviewStations =  0;
            let disconnectedStations = 0;
            try{
                overviewStations =  overview.stationsCount;
                identification.stations.forEach(element => {
                    console.log("element.deviceIdentification.status --->", element.deviceIdentification.status);
                    if(element.deviceIdentification.status == "disconnected") disconnectedStations++;
                });
            }catch(e){
                console.log(e);
            }
            const obj = {
                id, siteName, name, linkScore, controlFrequency, overviewFrequency, isRed, overviewStations, disconnectedStations
            }
            devices.push(obj);
        });

        return {
            ...state,
            devices
        }
    },
    [actions.setDeviceList]: (state, data) => {
        let devices = Array.from(data.list);
        return {
            ...state,
            devices
        }
    },
    [actions.setIsFetchingNow]: (state, data) => {
        let isFetching = data.isFetching;
        return {
            ...state,
            isFetching
        }
    },
    [actions.setRebootDfs]: (state, data) => {
        let rebootDfs = data.flag;
        return {
            ...state,
            rebootDfs
        }
    },
    [actions.setDisableToggle]: (state, data) => {
        let toggleDisabled = data.flag;
        return {
            ...state,
            toggleDisabled
        }
    },
    [actions.setDtLastCheck]: (state, data) => {
        let dtLastCheck = data.dtLastCheck;
        localStorage.setItem("dtLastCheck", dtLastCheck);
        return {
            ...state,
            dtLastCheck
        }
    },
    [actions.setBAutoReboot]: (state, data) => {
        let bAutoReboot = data.bAutoReboot;
        localStorage.setItem("bAutoReboot", bAutoReboot);
        return {
            ...state,
            bAutoReboot
        }
    }
};

export default createReducer(reducer, initialState);