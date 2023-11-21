import React from "react";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import "bootstrap/dist/css/bootstrap.min.css";

function Classification(){
    return(
        <div>
        <Container style={{height: "10px"}}></Container>
        <Container className="itemDetail">
            <Form.Label>Tags</Form.Label>
            <hr/>
            <Form.Label>Selected Tags</Form.Label>
            <hr/>
            <Form.Group className="mb-3">
                <Form.Label>Search Tags</Form.Label>
                <Form.Group className="d-flex">
                    <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                    />
                    <Button variant="success">Search</Button>
                </Form.Group>
            </Form.Group>
            <Form.Group className="mb-3">
                <FloatingLabel
                    controlId="floatingSelectGrid"
                    label="Category Tags"
                    >
                    <Form.Select aria-label="Floating label select1">
                        <option value="1">Sale Item</option>
                        <option value="2">Lost&Found</option>
                        <option value="3">Borrowal Item</option>
                        <option value="4">Donation</option>
                    </Form.Select>
                </FloatingLabel>
                <Form.Label></Form.Label>
                <FloatingLabel
                    controlId="floatingSelectGrid"
                    label="Item Type Tags"
                    >
                    <Form.Select aria-label="Floating label select2">
                        <option value="1">Book</option>
                        <option value="2">Furniture</option>
                        <option value="3">Clothing</option>
                        <option value="4">Electronics</option>
                        <option value="5">Course Material (CM)</option>
                    </Form.Select>
                </FloatingLabel>
            </Form.Group>
        </Container>
        <Container className="itemDetail">
            <Form.Label>Status</Form.Label>
            <hr/>
            <Form.Group className="mb-3" style={{display:"flex"}}>
                <div style={{marginLeft: "0", marginRight: "auto"}}>
                    <Form.Check type="checkbox" label="Available"/>
                    <Form.Check type="checkbox" label="All"/>
                </div>
                <div style={{marginRight: "0", marginLeft: "auto"}}>
                    <Form.Check type="checkbox" label="Lost"/>
                    <Form.Check type="checkbox" label="Found"/>
                </div>
            </Form.Group>
        </Container>
        <Container>
            <Form className="d-flex" style={{justifyContent: "center", textAlign: "center"}}>
                <Button variant="success">Find Listings</Button>
            </Form>
        </Container>
        <Container style={{height: "1px"}}></Container>
        </div>
    );
}

export default Classification;