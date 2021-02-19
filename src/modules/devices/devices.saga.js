import * as actions from "./devices.action";
import { takeEvery, put, select, call, all, take, wait, delay } from "redux-saga/effects";
import api from "../../api";
import { getMinutesFromTime } from '../../utils';

const getDeviceList = (state) => state.device.devices;

function* fetchDevices(){
    yield put(actions.setIsFetchingNow(true));
    const devcieList = yield api.device.getDevcieList();
    let arr = [];
    if(devcieList.data){
        let length = devcieList.data.length;
        // length = 2;
        for(var i = 0; i < length; i++){
            let element = devcieList.data[i];
            if(element.identification.role == "ap"){
                localStorage.setItem(`bRebootEligible[${element.identification.id}]`, false);
                arr.push(element);
            }
        }
        yield put(actions.fetchDeviceList(arr))
        for(var i = 0; i < arr.length; i++){
            let element = arr[i];
            const deviceConfig = yield api.device.getDeviceControlFrequency(element.identification.id);
            const stationData = yield api.device.getDistonnectedStations(element.identification.id);
            try{
                element.identification.controlFrequency = deviceConfig.data.controlFrequency;
                element.identification.stations = stationData.data;
                yield put(actions.fetchDeviceList(arr))
            }catch(e){
                console.log(e);
            }
        }
        yield put(actions.setIsFetchingNow(false));
    }
    
    console.log("devcieList --->", arr);
}

function* getDeviceControlFrequency(deviceId){
    const deviceConfig = yield api.device.getDeviceControlFrequency(deviceId);
    try{
        const result = deviceConfig.data.controlFrequency;
        return result;
    }catch(e){
        console.log("error -->",e);
        yield delay(5000)
        return yield getDeviceControlFrequency(deviceId);
    }
}

function* reBootDevice(data){
    const {deviceId} = data.payload;
    yield put(actions.setIsFetchingNow(true));
    let deviceList = yield select(getDeviceList);
    let index = 0;
    for(var i = 0; i < deviceList.length; i ++){
        if(deviceList[i].id == deviceId){
            index = i;
        }
    }
    deviceList[index].controlFrequency = "rebooting";
    yield put(actions.setDeviceList(deviceList));

    const restartResult = yield api.device.reBootDevice(deviceId);
    if(restartResult.data.result){
        const controlFrequency = yield getDeviceControlFrequency(deviceId);
        deviceList[index].controlFrequency = controlFrequency;
        yield put(actions.setDeviceList(deviceList));
    }

    yield put(actions.setIsFetchingNow(false));
}

function* autoRebootTimeCheck(){
    // const bAutoReboot = localStorage.getItem("bAutoReboot") || false;
    // let dtLastCheck = localStorage.getItem("dtLastCheck");
    // if(bAutoReboot === "true" && dtLastCheck){
    //     const tAutoRebootTime = localStorage.getItem("tAutoRebootTime")||"00:00";
    //     const currentTime = moment().format("H:mm");
    //     dtLastCheck = moment(dtLastCheck).format("H:mm");
    //     if(getMinutesFromTime(dtLastCheck) < getMinutesFromTime(tAutoRebootTime) && getMinutesFromTime(currentTime) > getMinutesFromTime(tAutoRebootTime)){

    //     }
    // }
}

export function* watchFetchDevices() {
    // yield fork(loginWatcherSaga);
    yield takeEvery(actions.getDeviceListSaga, fetchDevices);
    yield takeEvery(actions.reBootDeviceSaga, reBootDevice);
    yield takeEvery(actions.autoRebootTimeCheck, autoRebootTimeCheck);
}
