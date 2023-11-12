import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function NavBar(props) {
  return (
    <Navbar expand="lg" style={{backgroundColor: "#192655"}} data-bs-theme="dark">
      <Container fluid >
        <Navbar.Brand href="#home">BilMart</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
            onSelect={(selectedKey) => props.setScreen(selectedKey)}
          >
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#wishlist">Wishlist</Nav.Link>
            <NavDropdown title="Settings" id="navbarScrollingDropdown">
              <NavDropdown.Item href="#action4">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action5">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action6">
                Something else here
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="#profile">Profile</Nav.Link>
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="success">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;