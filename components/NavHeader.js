import React from 'react';
import { useRouter } from 'next/router';
import { Navbar, Nav } from 'react-bootstrap';

import Logo from './subcomponents/Logo';

const NavHeader = () => {
    const router = useRouter();
    // TODO: Change root to just '/' when we migrate over to the React site.
    const root = '/dev';

    const renderLinkClass = (nav) => {
        const path = nav === 'home' ? root : nav;
        if (router.pathname.match(`${path}$`)) {
            return 'active';
        } else {
            return '';
        }
    };

    return(
        <div className="header">
            <Navbar collapseOnSelect expand="lg">
                <Navbar.Brand href="#"><Logo/></Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto"></Nav>
                    <Nav>
                        <Nav.Link
                            className={renderLinkClass('search')}
                            href={`${root}/search`}
                        >
                            Search
                        </Nav.Link>
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
                            className={renderLinkClass('press')}
                            href={`${root}/press`}
                        >
                            Press
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
};

export default NavHeader;