/**
 * Returns data with the following "type":
 * {
 *     id: string,
 *     name: string,
 *     address: string,
 *
 *     // May contain a URL
 *     serves: string,
 * 
 *     latitude: number,
 *     longitude: number,
 *
 *     // An empty string indicates that there is no availability
 *     // May contain a URL
 *     availability: string,
 *
 *     // Number of milliseconds since January 1, 1970
 *     lastUpdated: number or null,
 *
 *     // May contain a URL
 *     bookAppointmentInfo: string,
 * }
 */
const getDataFromRecord = (record) => {
    if (!record || !record.fields) {
        return null;
    }
    const {fields} = record;
    const availability =
        fields['Availability'] &&
        fields['Availability'].trim().toLowerCase() != 'none'
            ? fields['Availability']
            : '';
    return {
        id: record.id,
        name: fields['Location Name'] || '',
        address: fields['Full Address'] || '',
        serves: fields['Serves'] || '',
        latitude: fields['Latitude'] || 0,
        longitude: fields['Longitude'] || 0,
        availability,
        lastUpdated: parseDate(fields['Last Updated']),
        bookAppointmentInfo: fields['Book an appointment'] || '',
    };
};

const parseDate = (dateString) => {
    const parsedDate = Date.parse(dateString);
    if (isNaN(parsedDate)) {
        return null;
    }
    return parsedDate;
};

module.exports = {
    getDataFromRecord,
};
