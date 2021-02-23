import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from './devices.action';

const useDevice = () => {
    const dispatch = useDispatch();
	const deviceReducer = useSelector((state) => {
		return state.device;
	});
    const {devices, isFetching, rebootDfs, toggleDisabled, dtLastCheck } = deviceReducer;

    const getDeviceListSaga = useCallback(() => {
		dispatch(actions.getDeviceListSaga());
	}, [dispatch]);

    const reBootDeviceSaga = useCallback((deviceId) => {
		dispatch(actions.reBootDeviceSaga(deviceId));
	}, [dispatch]);

    const setRebootDfs = useCallback((flag) => {
		dispatch(actions.setRebootDfs(flag));
	}, [dispatch]);

    const setDisableToggle = useCallback((flag) => {
		dispatch(actions.setDisableToggle(flag));
	}, [dispatch]);

    const setDtLastCheck = useCallback((dtLastCheck) => {
		dispatch(actions.setDtLastCheck(dtLastCheck));
	}, [dispatch]);

    return { devices, isFetching, rebootDfs, toggleDisabled, dtLastCheck, setDtLastCheck, getDeviceListSaga, reBootDeviceSaga, setRebootDfs, setDisableToggle }
}

export default useDevice;