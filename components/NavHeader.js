import React, { useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Logo from './subcomponents/Logo';

// TODO: remove "/dev" after promoting to root

const NavHeader = () => {
  const router = useRouter()
  const [navClass, setNavClass] = useState("");

  useEffect(() => {
    if (document.body.clientWidth < 768) {
      setNavClass("nav-mobile");
    } else {
      setNavClass("collapse navbar-collapse")
    }
  }, []);

  const renderLinkClass = (nav) => {
    const path = nav === "home" ? "/" : nav;
    if (router.pathname.match(`${path}$`)) {
      return "active";
    } else {
      return "";
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
              <NavDropdown.Item href="#action/3.1">Coming Soon</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <Nav.Link className={renderLinkClass("home")} href="/dev">Home</Nav.Link>
            <Nav.Link className={renderLinkClass("eligibility")} href="/dev/eligibility">Eligibility</Nav.Link>
            <Nav.Link className={renderLinkClass("sites")} href="/dev/sites">Vaccination Sites</Nav.Link>
            <Nav.Link className={renderLinkClass("FAQ")} href="/dev/FAQ">FAQ</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

export default NavHeader;