import React , { Component, useState, useEffect } from 'react';
import { connect } from "react-redux";
import ReactLoading from "react-loading";

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import FormControlLabel  from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import SettingsIcon from '@material-ui/icons/Settings';

import moment from 'moment';

import UserSettingDialog from '../../components/userSetting';
import CustomSwitch from '../../components/Switch';
import useDevice from '../../modules/devices/devices.hook';
import classes from "./style.less";

const DeviceList = () => {
    const { devices, isFetching, rebootDfs, toggleDisabled, getDeviceListSaga, reBootDeviceSaga, setRebootDfs, setDisableToggle } = useDevice();

    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('isRed');
    const [openUserSetting, setOpenUserSetting] = React.useState(false);

    useEffect(()=>{
        getDeviceListSaga();
    }, [])

    const on_click_restart_btn = (e, dataId) => {
        e.preventDefault();
        reBootDeviceSaga(dataId);
        localStorage.setItem(`bRebootEligible[${dataId}]`, false);
    }

    const renderFrequencyControl = (ele) => {

        if(ele.controlFrequency == "rebooting"){
            return <TableCell className = {classes.rebooting}>REBOOTING</TableCell>
        }else{

            if(ele.controlFrequency != undefined){
                if(ele.isRed){
                    return <TableCell className = {classes.redBackground}>{ele.controlFrequency}</TableCell>
                }else{
                    return <TableCell className = {classes.textRight}>{ele.controlFrequency}</TableCell>
                }
            }else{
                return <TableCell className = {classes.textRight}><div className = {classes.reloading}><ReactLoading type="spinningBubbles" color="#fff" width={32} height={32} color = {"grey"} /></div></TableCell>
            }
        }
        
    }

    const renderReBootBtn = (ele) => {
        const controlFrequency = ele.controlFrequency;
        const overviewFrequency = ele.overviewFrequency;

        if(controlFrequency == "rebooting"){
            return <div className = {classes.reloading}><ReactLoading type="spinningBubbles" color="#fff" width={32} height={32} color = {"grey"} /></div>
        }else{
            if(controlFrequency != overviewFrequency && controlFrequency != undefined){
                return <Button variant="outlined" onClick={(e)=>on_click_restart_btn(e, ele.id)}>Reboot</Button>
            }else{
                return "";
            }
        }
    }

    const on_click_obtain_devices = () => {
        getDeviceListSaga();
    }

    const handleRequestSort = (property) => (event) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const descendingComparator = (a, b, orderBy) => {
        if (b[orderBy] < a[orderBy]) {
          return -1;
        }
        if (b[orderBy] > a[orderBy]) {
          return 1;
        }
        return 0;
    }

    const getComparator = (order, orderBy) => {
        return order === 'desc'
          ? (a, b) => descendingComparator(a, b, orderBy)
          : (a, b) => -descendingComparator(a, b, orderBy);
    }

    const stableSort = (array, comparator) => {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
          const order = comparator(a[0], b[0]);
          if (order !== 0) return order;
          return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    const on_click_device_name = (deviceId) => (event) => {
        console.log("deviceId",deviceId);
        const baseUrl = localStorage.getItem("base-url");
        const url = `${baseUrl}/nms/devices/airmax/ac/${deviceId}/dashboard`
        window.open(url, "_blank");
    }

    const on_click_setting_btn = () => {
		setOpenUserSetting(true);
	}

    const handleClose = () => {
		setOpenUserSetting(false);
	};

    const handleChangeSwitch = (e) => {
        if(e.target.checked){
            for(let i = 0; i < devices.length; i++){
                let element = devices[i];
                localStorage.setItem(`bRebootEligible[${element.id}]`, true);
            }
        }
        setRebootDfs(e.target.checked);
        setDisableToggle(true);
    }

	const render = () => {
        const lastCheckedTimeStamp = localStorage.getItem("dtLastCheck") || "";
		return (
			<div className = {classes.deviceListContainer}>
                <div className = {classes.header}>
                    <div className = {classes.leftSide}>
                        <div className = {classes.isFetching}>
                            {isFetching && <ReactLoading type="spinningBubbles" color="#fff" width={32} height={32} color = {"grey"} />}
                        </div>
                        <FormControlLabel
                            control={<CustomSwitch disabled = {toggleDisabled} checked = {rebootDfs}  onChange={handleChangeSwitch} name="reboot_dfs" />}
                            label="Roboot DFS hits"
                        />
                    </div>
                    <div className = {classes.rightSide}>
                        <Grid container spacing={8}>
                            <Grid item style = {{textAlign:"right"}}>
                                <Button className = {classes.refreshBtn} variant="outlined" onClick={on_click_obtain_devices}>Refresh</Button>
                                <div className = {classes.lastCheckLbl}>
                                    <span>
                                    Last refresh {lastCheckedTimeStamp}
                                    </span>
                                </div>
                            </Grid>
                            <Grid item>
                                <Button variant="outlined" onClick={on_click_setting_btn} className = {classes.settingBtn}><SettingsIcon/></Button>
                            </Grid>
                        </Grid>
                    </div>
                </div>

                <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === "siteName"}
                                    direction={orderBy === "siteName" ? order : 'asc'}
                                    onClick={handleRequestSort("siteName")}
                                    >
                                    Site Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === "name"}
                                    direction={orderBy === "name" ? order : 'asc'}
                                    onClick={handleRequestSort("name")}
                                    >
                                    Name
                                </TableSortLabel>
                            </TableCell>

                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === "overviewStations"}
                                    direction={orderBy === "overviewStations" ? order : 'asc'}
                                    onClick={handleRequestSort("overviewStations")}
                                    >
                                    Stations
                                </TableSortLabel>
                            </TableCell>

                            <TableCell align="right">
                                Overview Frequency
                            </TableCell>
                            <TableCell align="right">
                                <TableSortLabel
                                    active={orderBy === "linkScore"}
                                    direction={orderBy === "linkScore" ? order : 'asc'}
                                    onClick={handleRequestSort("linkScore")}
                                    >
                                    Link Score
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="right">
                                <TableSortLabel
                                    active={orderBy === "isRed"}
                                    direction={orderBy === "isRed" ? order : 'asc'}
                                    onClick={handleRequestSort("isRed")}
                                    >
                                    Control Frequency
                                </TableSortLabel>
                            </TableCell>
                            <TableCell ></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            stableSort(devices, getComparator(order, orderBy)).map((ele, index) => {
                                
                                const controlFrequency = ele.controlFrequency;

                                return (
                                    <TableRow key={index}>
                                        <TableCell>{ele.siteName}</TableCell>
                                        <TableCell>
                                            <Link component="button" variant="body2" onClick={on_click_device_name(ele.id)}>{ele.name}</Link>
                                        </TableCell>
                                        <TableCell align="right">{`${ele.overviewStations} (${ele.disconnectedStations})`}</TableCell>
                                        <TableCell align="right">{ele.overviewFrequency}</TableCell>
                                        <TableCell align="right" style = {{background:(ele.linkScore>0.8)?"white":"yellow"}}>{ele.linkScore}%</TableCell>
                                            {renderFrequencyControl(ele)}
                                        <TableCell align="right" style = {{textAlign:"center"}}>
                                            {renderReBootBtn(ele)}
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
                </TableContainer>
                <UserSettingDialog handleClose = {handleClose} open = {openUserSetting}/>
               </div>
		);
	}
	return render();
}

export default DeviceList;