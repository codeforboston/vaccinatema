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
 *     // milliseconds since Unix epoch
 *     lastUpdated: ?number,
 *
 *     // May contain a URL
 *     bookAppointmentInfo: string,
 *
 *     instructionsAtSite: string
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
    const serves = fields['Serves'] || '';
    const locationName = fields['Location Name'] || '';
    return {
        id: record.id,
        name: locationName,
        address: fields['Full Address'] || '',
        serves: serves,
        latitude: fields['Latitude'] || 0,
        longitude: fields['Longitude'] || 0,
        availability,
        lastUpdated: parseDate(fields['Last Updated']),
        bookAppointmentInfo: fields['Book an appointment'] || '',
        instructionsAtSite: fields['Instructions at site'] || 'No specific instructions available',
        sitePinShape: determineSitePinShape(
            availability, serves, locationName,
        ),
    };
};

const parseDate = (dateString) => {
    const parsedDate = Date.parse(dateString);
    if (isNaN(parsedDate)) {
        return null;
    }
    return parsedDate;
};

// High volume, large venue sites
const MASS_VACCINATION_SITES = [
    'Foxborough: Gillette Stadium',
    'Danvers: Doubletree Hotel',
    'Springfield: Eastfield Mall',
    'Dartmouth: Former Circuit City', 
    'Natick: Natick Mall',
    'Boston: Reggie Lewis Center (Roxbury Community College)',
    'Boston: Hynes Convention Center'
];

const ELIGIBLE_PEOPLE_STATEWIDE_TEXT = [
    'All eligible people statewide',
    'Eligible populations statewide'
];

const doesSiteServeAllEligiblePeopleStatewide = serves => typeof(serves) == 'string' && ELIGIBLE_PEOPLE_STATEWIDE_TEXT.includes(serves.trim());

const isSiteAMassVaccinationSite = locationName => MASS_VACCINATION_SITES.includes(locationName);


const determineSitePinShape = (availability, serves, locationName) => {
    if (!availability) {
        return 'dot';
    } else if (isSiteAMassVaccinationSite(locationName)) {
        return 'star star-red';
    } else if (doesSiteServeAllEligiblePeopleStatewide(serves)) {
        return 'star star-green';
    } else {
        return 'star star-blue';
    }
};

module.exports = {
    getDataFromRecord,
};
