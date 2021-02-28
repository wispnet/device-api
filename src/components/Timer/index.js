import React, { useEffect } from 'react';
import moment from 'moment';
import useDevice from '../../modules/devices/devices.hook';
import { getMinutesFromTime } from '../../utils';

const Timer = () => {
    const { devices, rebootDfs, dtLastCheck, getDeviceListSaga, setRebootDfs, reBootDeviceSaga, setDisableToggle, setDtLastCheck } = useDevice();

    
    const autoRebootTimeCheck = () => {
        const bAutoReboot = localStorage.getItem("bAutoReboot");
        if(bAutoReboot === "true"){
            const tAutoRebootTime = localStorage.getItem("tAutoRebootTime")||"00:00";
            const currentTime = moment().format("H:mm");
            if(getMinutesFromTime(currentTime) == getMinutesFromTime(tAutoRebootTime)){
                setRebootDfs(true);
                setDisableToggle(true);
            }
        }
    }

    useEffect(()=>{
        if(rebootDfs){
            //reboot devices
            for(let i = 0; i < devices.length; i++){
                const ele = devices[i];
                const bRebootEligible = localStorage.getItem(`bRebootEligible[${ele.id}]`);
                if(bRebootEligible == "true"){
                    reBootDeviceSaga(ele.id);
                }
            }
        }
    }, [rebootDfs])

    useEffect(()=>{
        let rbtDeviceCnt = 0;
        let checkedDevicesCnt = 0;
        for(let i = 0; i < devices.length; i++){
            const ele = devices[i];
            const controlFrequency = ele.controlFrequency;
            const overviewFrequency = ele.overviewFrequency;
            if(controlFrequency != "rebooting"){
                if(controlFrequency != undefined){
                    if(controlFrequency != overviewFrequency){
                        rbtDeviceCnt ++;
                        localStorage.setItem(`bRebootEligible[${ele.id}]`, true);
                    }else{
                        localStorage.setItem(`bRebootEligible[${ele.id}]`, false);
                    }
                    checkedDevicesCnt ++;
                }
            }
        }
        if(checkedDevicesCnt == devices.length){
            if(rbtDeviceCnt == 0){
                setDisableToggle(false);
                setRebootDfs(false);
            }
        }
    }, [devices]);

    useEffect(()=>{
        const timeInterval = parseInt(localStorage.getItem("time")||5);
        const timer = setInterval(() => {
            getDeviceListSaga();
            const date = moment().format('L hh:mm:ss');
            setDtLastCheck(date);
            
        }, 1000 * 60 * timeInterval);
        // }, 1000 * 5);
        return () => {
            if (timer) clearInterval(timer);
        };
    }, []);

    useEffect(()=>{
        const timer = setInterval(() => {
            console.log("autoRebootTimeCheck --->");
            autoRebootTimeCheck();
        }, 1000 * 60);
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [])

    return null;
}

export default Timer;