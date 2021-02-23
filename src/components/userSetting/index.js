import React , { Component, useState, useEffect, useRef } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';

import classes from "./style.less";

const UserSettingDialog = ({ open, handleClose }) => {

    const [state, setState] = useState({currentUrl:""});
    const [refereshInterval, setRefereshIntervalValue] = React.useState(parseInt(localStorage.getItem("time") || "5"));
	const [baseUrlError, setBaseUrlError] = useState({isError:false, message:""});

    const apiKeyRef = useRef(null);
	const baseURLRef = useRef(null);
	const autoRebootCheckBoxRef = useRef(null);
	const autoRebootTimeRef = useRef(null);

    const apiKey = localStorage.getItem("api-key")||"";
    const baseUrl = localStorage.getItem("base-url")||"";
    const bAutoReboot = localStorage.getItem("bAutoReboot")||false;
    const tAutoRebootTime = localStorage.getItem("tAutoRebootTime")||"00:00";

    const onClose = () => {
        console.log("---- onClosse ----");
        const url = baseURLRef.current.value;
		const correctUrl= /^(ftp|http|https):\/\/[^ "]+$/.test(url);
		if(correctUrl){
			setBaseUrlError({...state, isError:false, message:""})
		}else{
			setBaseUrlError({...state, isError:true, message:"Base URL should have prefix: https or http"})
			return;
		}

		localStorage.setItem("api-key", apiKeyRef.current.value);
		localStorage.setItem("base-url", baseURLRef.current.value);
		localStorage.setItem("time", refereshInterval);
		localStorage.setItem("bAutoReboot", autoRebootCheckBoxRef.current.checked);
		localStorage.setItem("tAutoRebootTime", autoRebootTimeRef.current.value);

        handleClose();
    }

    const handleChangeRefreshIntervalSlider = (event, newValue) => {
		setRefereshIntervalValue(newValue);
	};
    
    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">API KEY and BASE URL</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {/* To subscribe to this website, please enter your email address here. We will send updates
                    occasionally. */}
                </DialogContentText>
                <TextField autoFocus margin="dense" id="api_key" label="API KEY" type="text" fullWidth inputProps= {{ref:apiKeyRef}} defaultValue = {apiKey} />
                <TextField error = {baseUrlError.isError} helperText = {baseUrlError.message} margin="dense" id="baseurl" label="BASE URL" type="text" fullWidth inputProps = {{ref:baseURLRef}} defaultValue = {baseUrl} />
                <div className = {classes.timerSlider}>
                    <Slider value={refereshInterval} onChange={handleChangeRefreshIntervalSlider} aria-labelledby="continuous-slider" step={1} valueLabelDisplay="auto" max={60} min={5}/>
                </div>
                <div className = {classes.autoReboot}>
                    <FormControlLabel
                        control={<Checkbox name = "bAutoReboot" defaultChecked={bAutoReboot == "true"} color="primary" inputProps = {{ref:autoRebootCheckBoxRef}}/>}
                        label="Auto reboot"
                    />
                </div>
                <div>
                    <TextField
                        label="Auto reboot time"
                        type="time"
                        name="tAutoRebootTime"
                        defaultValue={tAutoRebootTime}
                        style = {{width:"100%"}}
                        inputProps={{
                            ref:autoRebootTimeRef,
                            step: 300, // 5 min
                        }}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default UserSettingDialog