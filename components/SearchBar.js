import React, {useState} from 'react';
import PropTypes from 'prop-types';

import Button from '../components/subcomponents/Button';

export const ALL_AVAILABIITY = 'All known vaccination sites';
const AVAILABLE_ONLY = 'Sites with reported doses';

const SearchBar = (props) => {
    const [address, setAddress] = useState('');
    const [availability, setAvailability] = useState(AVAILABLE_ONLY);

    const [hasGeolocationError, setHasGeolocationError] = useState(false);

    const clearErrors = () => {
        setHasGeolocationError(false);
    };

    const searchByAddress = () => {
        clearErrors();
        props.onSearch({address, availability});
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
                });
            } catch (err) {
                console.log(err);
            }
        } else {
            setHasGeolocationError(true);
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

    // Note that we need to use the typeof check for Next.js's prerendering.
    const isHttps =
        typeof window !== 'undefined' &&
        window.location &&
        window.location.protocol === 'https:';

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
                    {
                        // Geolocation only works on https. Hide the button if
                        // not on https to avoid confusion.
                        isHttps && (
                            <div className="search-header-col">
                                <Button
                                    title="Use my location"
                                    color="blue"
                                    icon="location"
                                    onClick={searchByGeolocation}
                                />
                            </div>
                        )
                    }
                </div>
            </div>
            <div className="error">
                {hasGeolocationError && <p>Cannot figure out your location.</p>}
            </div>
        </div>
    );
};

export default SearchBar;

SearchBar.propTypes = {
    onSearch: PropTypes.func.isRequired,
};
