import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {faChevronDown, faTimes} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import Button from '../components/subcomponents/Button';

export const ALL_AVAILABIITY = 'All known vaccination sites';
const AVAILABLE_ONLY = 'Sites with reported doses';
const MOBILE_WIDTH = 640;

const MISSING_INFO_ERROR = 'Please enter a valid ZIP code in MA.';
const GEOLOCATION_ERROR = 'Cannot figure out your location.';

const SearchBar = (props) => {
    const [address, setAddress] = useState('');
    const [availability, setAvailability] = useState(AVAILABLE_ONLY);
    const [maxMiles, setMaxMiles] = useState(null);
    const [error, setError] = useState(null);

    const [isMobile, setIsMobile] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleWindowSizeChange = () => {
        setIsMobile(window.innerWidth <= MOBILE_WIDTH);
    };

    // Update isMobile when the window is resized.
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        };
    }, []);

    // Update isCollapsed if isMobile changes. (The default state is collapsed
    // on small screens and expanded on large screens.)
    useEffect(() => setIsCollapsed(isMobile), [isMobile]);

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

        isMobile && setIsCollapsed(true);
        try {
            props.onSearch({address, availability, maxMiles});
        } catch (err) {
            setError(MISSING_INFO_ERROR);
            console.error(err);
        }
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
                isMobile && setIsCollapsed(true);
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

    const Toggle = () => (
        <button className="toggle" onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? (
                <FontAwesomeIcon icon={faChevronDown} />
            ) : (
                <FontAwesomeIcon icon={faTimes} />
            )}
        </button>
    );

    if (isCollapsed) {
        return (
            <div className="search-header sticky-top full-width">
                <div className="container collapsed-container">
                    <p>Show me vaccines near...</p>
                    <Toggle />
                </div>
            </div>
        );
    }

    return (
        <div className="search-header sticky-top full-width">
            <div className="container">
                {isMobile && (
                    <div className="relative">
                        <div className="toggle-container">
                            <Toggle />
                        </div>
                    </div>
                )}
                <div className="search-header-contents">
                    {/* The "sections" help to ensure the buttons stay on the
                    same line while resizing.*/}
                    <div className="search-header-section">
                        <div className="search-header-col">
                            <p>ZIP Code</p>
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
                                Include sites without availability
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
                <div className="error">{error && <p>{error}</p>}</div>
            </div>
        </div>
    );
};

export default SearchBar;

SearchBar.propTypes = {
    onSearch: PropTypes.func.isRequired,
};
