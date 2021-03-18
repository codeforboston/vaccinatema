
import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Link from 'next/link';
import PropType from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import SpinLoader from './SpinLoader';
import Auth from '../utilities/authUtils';
import EmailLink from './EmailLink';

const VolunteerAuth = ({ sendUser }) => {
    const [token, setToken] = useState('');
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showToken, setShowToken] = useState(false);
    const [cacheToken, setCacheToken] = useState(false);

    useEffect(() => {
        setUser(Auth.getSession());
        setLoading(false);
    }, []);

    useEffect(() => {
        if (user) {
            sendUser(user);
        }
    }, [user]);

    const validateToken = () => {
        if (token  === '') {
            setError('Token can\'t be blank');
            return;
        }
        setLoading(true);
        setError(null);
        fetch(`/volunteers/by-email?volunteerEmail=${token}`, {
            method: 'get',
            headers: new Headers({'content-type': 'application/json'}),
        })
            .then(response => response.json())
            .then(result => {
                const user = result[0];
                if (user) {
                    if (cacheToken) {
                        Auth.setSession(user);
                    }
                    setUser(user);
                    setLoading(false);
                    setToken('');
                } else {
                    setLoading(false);
                    setError('Invalid token');
                }
            })
            .catch(error => {
                setError('An internal error occurred');
                setLoading(false);
                console.log(error);
            });
    };

    const logout = () => {
        Auth.clearSession();
        setUser(null);
        sendUser(null);
    };

    if (loading) {
        return <SpinLoader/>;
    } else if (user) {
        return <Button id="logout" onClick={logout}>Logout</Button>;
    } else {
        // TODO: has the volunteer email changed?
        return(
            <Modal className="volunteer-auth-modal" show={true} backdrop="static" keyboard={false}>
                <Modal.Header>
                    <Modal.Title>Welcome Volunteers!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Please enter your user token to access the volunteer portal.</p>
                    <p>
                        {'If you don\'t know your user token, ask your volunteer coordinator. If you\'re here for the ' +
                        'first time looking to get involved, please send us an email at '}<EmailLink/>
                    </p>
                    <hr/>
                    <Form.Label htmlFor="token">User Access Token</Form.Label>
                    <Form.Control
                        name="token"
                        onChange={(e) => setToken(e.target.value)}
                        value={token}
                        placeholder="Token"
                        type="password"
                    />
                    <div className="checkbox-label show-token" onClick={() => setShowToken(!showToken)}>
                        <Form.Check
                            label="Show Token"
                            checked={showToken}
                            onChange={() => null}
                        />
                        {showToken && <p>{token}</p>}
                    </div>
                    <div className="checkbox-label" onClick={() => setCacheToken(!cacheToken)}>
                        <Form.Check
                            label="Remember me on this computer"
                            checked={cacheToken}
                            onChange={() => null}
                        />
                        <OverlayTrigger
                            placement="bottom"
                            overlay={
                                <Tooltip>
                                    {'Check this box to save your user information in your browser until you log out. ' +
                                    'Do not check this box if this is a public or shared computer.'}
                                </Tooltip>
                            }
                        >
                            <FontAwesomeIcon className="info-icon" icon={faInfoCircle}/>
                        </OverlayTrigger>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {error && <p className="error">{error}</p>}
                    <Link href="/">Return to the homepage</Link>
                    <Button onClick={validateToken}>Submit</Button>
                </Modal.Footer>
            </Modal>
        );
    }

};

export default VolunteerAuth;

VolunteerAuth.propTypes = {
    sendUser: PropType.func,
};
