import React, {useState} from 'react';
import PropTypes from 'prop-types';

import Button from '../components/subcomponents/Button';

export const ALL_AVAILABIITY = 'All known vaccination sites';
const AVAILABLE_ONLY = 'Sites with reported doses';

const MISSING_INFO_ERROR = 'Please enter a city, town, or ZIP.';
const GEOLOCATION_ERROR = 'Cannot figure out your location.';

const SearchBar = (props) => {
    const [address, setAddress] = useState('');
    const [availability, setAvailability] = useState(AVAILABLE_ONLY);
    const [maxMiles, setMaxMiles] = useState(null);
    const [error, setError] = useState(null);

    const clearErrors = () => {
        setError(null);
    };

    const searchByAddress = () => {
        clearErrors();

        // If there's no address set, we only allow "All MA" searches.
        if (address === '' && maxMiles != null) {
            setError(MISSING_INFO_ERROR);
            return;
        }

        props.onSearch({address, availability, maxMiles});
    };

    const searchByGeolocation = async () => {
        clearErrors();

        if ('geolocation' in navigator) {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        timeout: 5000,
                    });
                });
                props.onSearch({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    availability,
                    maxMiles,
                });
            } catch (err) {
                console.log(err);
            }
        } else {
            setError(GEOLOCATION_ERROR);
        }
    };

    const handleKeyDown = (event) => {
        if (event.keyCode === 13) {
            // If a user presses Enter, trigger search.
            searchByAddress();
        }
    };

    const handleAddressChange = (event) => {
        setAddress(event.target.value);
    };

    const onChangeAvailability = () => {
        setAvailability(
            availability === AVAILABLE_ONLY ? ALL_AVAILABIITY : AVAILABLE_ONLY
        );
    };

    const handleDistanceChange = (event) => {
        const distance = event.target.value;
        setMaxMiles(distance === '-1' ? null : distance);
    };

    return (
        <div className="search-header">
            <div className="search-header-contents">
                {/* The "sections" help to ensure the buttons stay on the same
                line while resizing.*/}
                <div className="search-header-section">
                    <div className="search-header-col">
                        <p>City, Town, or ZIP</p>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={address}
                            onChange={handleAddressChange}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                    <div className="search-header-col">
                        <p>Search distance</p>
                        <select
                            id="distance"
                            value={maxMiles || -1}
                            onChange={handleDistanceChange}
                        >
                            <option value="-1">All MA</option>
                            <option value="0.25">0.25mi</option>
                            <option value="0.5">0.5mi</option>
                            <option value="1">1mi</option>
                            <option value="5">5mi</option>
                            <option value="10">10mi</option>
                            <option value="25">25mi</option>
                        </select>
                    </div>
                    <div className="search-header-col options">
                        <p>Other options</p>
                        <label htmlFor="no-availability">
                            <input
                                type="checkbox"
                                id="no-availability"
                                value={availability === AVAILABLE_ONLY}
                                onChange={onChangeAvailability}
                            />
                            Show sites that don&apos;t have availability
                        </label>
                    </div>
                </div>
                <div className="search-header-section">
                    <div className="search-header-col">
                        <Button
                            title="Search"
                            color="blue"
                            icon="search"
                            onClick={searchByAddress}
                        />
                    </div>
                    <div className="search-header-col">
                        <Button
                            title="Use my location"
                            color="blue"
                            icon="location"
                            onClick={searchByGeolocation}
                        />
                    </div>
                </div>
            </div>
            <div className="error">
                {error && <p>{error}</p>}
            </div>
        </div>
    );
};

export default SearchBar;

SearchBar.propTypes = {
    onSearch: PropTypes.func.isRequired,
};
