import React, { useEffect } from 'react';
import moment from 'moment';
import useDevice from '../../modules/devices/devices.hook';
import { getMinutesFromTime } from '../../utils';

const Timer = () => {
    const { devices, rebootDfs,  getDeviceListSaga, setRebootDfs, reBootDeviceSaga, setDisableToggle } = useDevice();

    const autoRebootTimeCheck = () => {

        const bAutoReboot = localStorage.getItem("bAutoReboot") || false;
        let dtLastCheck = localStorage.getItem("dtLastCheck");

        if(bAutoReboot === "true" && dtLastCheck){

            const tAutoRebootTime = localStorage.getItem("tAutoRebootTime")||"00:00";
            const currentTime = moment().format("H:mm");
            dtLastCheck = moment(dtLastCheck).format("H:mm");

            if(getMinutesFromTime(dtLastCheck) < getMinutesFromTime(tAutoRebootTime) && getMinutesFromTime(currentTime) >= getMinutesFromTime(tAutoRebootTime)){
                setRebootDfs(true);                
            }
        }
    }

    useEffect(()=>{
        if(rebootDfs){
            //reboot devices
            let rbtDeviceCnt = 0;
            for(let i = 0; i < devices.length; i++){
                const ele = devices[i];
                const controlFrequency = ele.controlFrequency;
                const overviewFrequency = ele.overviewFrequency;
                if(controlFrequency != "rebooting"){
                    if(controlFrequency != overviewFrequency && controlFrequency != undefined){
                        rbtDeviceCnt ++;                        
                        reBootDeviceSaga(ele.id);
                    }
                    localStorage.setItem(`bRebootEligible[${ele.id}]`, false);
                }
            }
        }
    }, [rebootDfs])

    useEffect(()=>{
        let rbtDeviceCnt = 0;
        for(let i = 0; i < devices.length; i++){
            const ele = devices[i];
            const controlFrequency = ele.controlFrequency;
            const overviewFrequency = ele.overviewFrequency;
            if(controlFrequency != "rebooting"){
                if(controlFrequency != overviewFrequency && controlFrequency != undefined){
                    rbtDeviceCnt ++;
                    localStorage.setItem(`bRebootEligible[${ele.id}]`, true);
                }else{
                    localStorage.setItem(`bRebootEligible[${ele.id}]`, false);
                }
            }
        }
        if(rbtDeviceCnt == 0){
            setDisableToggle(false);
            setRebootDfs(false);
        }
    }, [devices]);

    useEffect(()=>{
        const timeInterval = parseInt(localStorage.getItem("time")||5);
        const timer = setInterval(() => {
            getDeviceListSaga();
            const date = moment().format('L hh:mm:ss');
            localStorage.setItem("dtLastCheck", date);

            autoRebootTimeCheck();
            
        }, 1000 * 60 * timeInterval);
        return () => {
            if (timer) clearInterval(timer);
        };
    }, []);

    return null;
}

export default Timer;