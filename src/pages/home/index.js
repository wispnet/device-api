import React , { Component, useState, useEffect, useRef } from 'react';
import { connect } from "react-redux";
import classes from "./style.less";
import Button from '@material-ui/core/Button';
import SettingsIcon from '@material-ui/icons/Settings';
import UserSettingDialog from '../../components/userSetting';

import history from "../../modules/history";

const Home = (props) => {
	
	const [openUserSetting, setOpenUserSetting] = React.useState(false);

	useEffect(()=>{
		const apiKey = localStorage.getItem("api-key")||"";
		const baseUrl = localStorage.getItem("base-url")||"";
		if(apiKey == "" || baseUrl == ""){
			setOpenUserSetting(true);
		}
	},[]);

	const handleClose = () => {
		setOpenUserSetting(false);
	};

	const on_click_obtain_devices = () => {
		history.push("/devices");
	}

	const on_click_setting_btn = () => {
		setOpenUserSetting(true);
	}

	const render = () => {

		return (
			<div className = {classes.homeContainer}>
				<Button variant="outlined" onClick={on_click_obtain_devices}>Obtain Devices</Button>
				<Button variant="outlined" onClick={on_click_setting_btn} className = {classes.settingBtn}><SettingsIcon/></Button>
				<UserSettingDialog handleClose = {handleClose} open = {openUserSetting}/>
			</div>
		);
	}
	return render();
}

export default Home;