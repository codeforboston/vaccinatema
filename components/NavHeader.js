import React from 'react';
import {useRouter} from 'next/router';
import {Navbar, Nav} from 'react-bootstrap';

import Logo from './subcomponents/Logo';

const NavHeader = () => {
    const router = useRouter();
    // Allows defining a subfolder structure when testing a dev version
    const root = '';

    const renderLinkClass = (nav) => {
        const path = nav === 'home' ? root : nav;
        if (router.pathname.match(`${path}$`)) {
            return 'active';
        } else {
            return '';
        }
    };

    return (
        <div className="header fixed-top full-width">
            <div className="container">
                <Navbar collapseOnSelect expand="lg">
                    <Navbar.Brand href="#">
                        <Logo />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto"></Nav>
                        <Nav>
                            <Nav.Link
                                className={renderLinkClass('eligibility')}
                                href={`${root}/eligibility`}
                            >
                                Eligibility
                            </Nav.Link>
                            <Nav.Link
                                className={renderLinkClass('FAQ')}
                                href={`${root}/FAQ`}
                            >
                                FAQ
                            </Nav.Link>
                            <Nav.Link
                                className={renderLinkClass('resources')}
                                href={`${root}/resources`}
                            >
                                Resources
                            </Nav.Link>
                            <Nav.Link
                                className={renderLinkClass('press')}
                                href={`${root}/press`}
                            >
                                Press
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        </div>
    );
};

export default NavHeader;
