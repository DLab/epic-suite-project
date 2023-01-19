const formatDateDashToSlash = (stringDate: string) =>
    stringDate.includes("-") ? stringDate.replaceAll("-", "/") : stringDate;

const compareDate = (stringDate: string, date: string) => {
    const maxDateSim = new Date(date);
    return maxDateSim > new Date(formatDateDashToSlash(stringDate))
        ? formatDateDashToSlash(stringDate)
        : date;
};

export default compareDate;
