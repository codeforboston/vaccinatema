
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
    const [loading, setLoading] = useState(true);
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

    const validateToken = (token, cacheToken) => {
        setLoading(true);
        // TODO: get volunteer with token
        const response = { firstName: 'Joe', lastName: 'Volunteer', token: token, admin: true };
        if (cacheToken) {
            Auth.setSession(response);
        }
        setUser(response);
        setLoading(false);
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
                    <div className="cache-checkbox" onClick={() => setCacheToken(!cacheToken)}>
                        <Form.Check
                            label="Remember me on this computer"
                            checked={cacheToken}
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
                    <Link href="/">Return to the homepage</Link>
                    <Button onClick={() => validateToken(token, cacheToken)}>Submit</Button>
                </Modal.Footer>
            </Modal>
        );
    }

};

export default VolunteerAuth;

VolunteerAuth.propTypes = {
    sendUser: PropType.func,
};