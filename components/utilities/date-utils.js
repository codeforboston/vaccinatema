const dateToString = (date) =>
    date
        ? new Date(date).toLocaleString('en-US', {timeZone: 'America/New_York'})
        : '';

module.exports = {
    dateToString,
};
