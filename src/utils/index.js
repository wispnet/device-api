export const getMinutesFromTime = (timeStr) => {
    const timeArr = timeStr.split(":");
    const hours = parseInt(timeArr[0]);
    const mins = parseInt(timeArr[1]);
    return hours * 60 +  mins;
}