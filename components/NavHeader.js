import React from 'react';
import { useRouter } from 'next/router';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

import Logo from './subcomponents/Logo';

// TODO: remove "/dev" after promoting to root (in hrefs and renderLinkClass)

const NavHeader = () => {
    const router = useRouter();

    const renderLinkClass = (nav) => {
        const path = nav === 'home' ? '/dev' : nav;
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
                    <Nav className="mr-auto">
                        <NavDropdown title="Language" id="collasible-nav-dropdown">
                            <NavDropdown.Item>Coming Soon</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <Nav.Link className={renderLinkClass('home')} href="/dev">Search</Nav.Link>
                        <Nav.Link className={renderLinkClass('eligibility')} href="/dev/eligibility">Eligibility</Nav.Link>
                        <Nav.Link className={renderLinkClass('FAQ')} href="/dev/FAQ">FAQ</Nav.Link>
                        <Nav.Link className={renderLinkClass('press')} href="/dev/press">Press</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
};

export default NavHeader;