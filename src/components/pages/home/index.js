import React , { Component, useState, useEffect, useRef } from 'react';
import { connect } from "react-redux";
import classes from "./style.less";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SettingsIcon from '@material-ui/icons/Settings';
import Slider from '@material-ui/core/Slider';

import history from "../../../modules/history";

const Home = (props) => {
	const [state, setState] = useState({currentUrl:""});
	const [open, setOpen] = React.useState(false);
	const [baseUrlError, setBaseUrlError] = useState({isError:false, message:""});
	const apiKeyRef = useRef(null);
	const baseURLRef = useRef(null);
	const [refereshInterval, setRefereshIntervalValue] = React.useState(parseInt(localStorage.getItem("time") || "5"));

	useEffect(()=>{
		const apiKey = localStorage.getItem("api-key")||"";
		const baseUrl = localStorage.getItem("base-url")||"";
		if(apiKey == "" || baseUrl == ""){
			setOpen(true);
		}
	},[]);

	const handleClose = () => {

		var url = baseURLRef.current.value;
		var correctUrl= /^(ftp|http|https):\/\/[^ "]+$/.test(url);
		if(correctUrl){
			setBaseUrlError({...state, isError:false, message:""})
		}else{
			setBaseUrlError({...state, isError:true, message:"Base URL should have prefix: https or http"})
			return;
		}

		localStorage.setItem("api-key", apiKeyRef.current.value);
		localStorage.setItem("base-url", baseURLRef.current.value);
		localStorage.setItem("time", refereshInterval);
		setOpen(false);
	};

	const on_click_obtain_devices = () => {
		history.push("/devices");
	}

	const on_click_setting_btn = () => {
		// localStorage.setItem("api-key", "");
		// localStorage.setItem("base-url", "");
		setOpen(true);
	}

	const handleChangeRefreshIntervalSlider = (event, newValue) => {
		setRefereshIntervalValue(newValue);
	};

	const renderSettingDialog = () => {
		const apiKey = localStorage.getItem("api-key")||"";
		const baseUrl = localStorage.getItem("base-url")||"";
		console.log("renderSettingDialog");
		return (
		<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
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
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="primary">
					Save
				</Button>
			</DialogActions>
		</Dialog>
		)
	}
	const render = () => {

		return (
			<div className = {classes.homeContainer}>
				<Button variant="outlined" onClick={on_click_obtain_devices}>Obtain Devices</Button>
				<Button variant="outlined" onClick={on_click_setting_btn} className = {classes.settingBtn}><SettingsIcon/></Button>
				{renderSettingDialog()}
			</div>
		);
	}
	return render();
}

export default Home;