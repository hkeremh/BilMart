import React from "react";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import "bootstrap/dist/css/bootstrap.min.css";
import "../CSS/general.css"

function Classification(){
    return(
        <div>
        <Container style={{height: "10px"}}></Container>
        <Container className="itemDetail">
            <Form.Label className="text">Tags</Form.Label>
            <hr/>
            <Form.Label className="text">Selected Tags</Form.Label>
            <hr/>
            <Form.Group className="mb-3">
                <Form.Label className="text">Search Tags</Form.Label>
                <Form.Group className="d-flex">
                    <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2 text"
                    aria-label="Search"
                    />
                    <Button className="text primary-accent" variant="secondary"><span className="text">Search</span></Button>
                </Form.Group>
            </Form.Group>
            <Form.Group className="mb-3">
                <FloatingLabel
                    controlId="floatingSelectGrid"
                    label="Category Tags"
                    className="text"
                    >
                    <Form.Select aria-label="Floating label select1">
                        <option className="text" value="1">Sale Item</option>
                        <option className="text" value="2">Lost&Found</option>
                        <option className="text" value="3">Borrowal Item</option>
                        <option className="text" value="4">Donation</option>
                    </Form.Select>
                </FloatingLabel>
                <Form.Label></Form.Label>
                <FloatingLabel
                    controlId="floatingSelectGrid"
                    label="Item Type Tags"
                    className="text"
                    >
                    <Form.Select aria-label="Floating label select2">
                        <option className="text" value="1">Book</option>
                        <option className="text" value="2">Furniture</option>
                        <option className="text" value="3">Clothing</option>
                        <option className="text" value="4">Electronics</option>
                        <option className="text" value="5">Course Material (CM)</option>
                    </Form.Select>
                </FloatingLabel>
            </Form.Group>
        </Container>
        <Container className="itemDetail">
            <Form.Label className="text">Status</Form.Label>
            <hr/>
            <Form.Group className="mb-3" style={{display:"flex"}}>
                <div style={{marginLeft: "0", marginRight: "auto"}}>
                    <Form.Check className="text" type="checkbox" label="Available"/>
                    <Form.Check className="text" type="checkbox" label="All"/>
                </div>
                <div style={{marginRight: "0", marginLeft: "auto"}}>
                    <Form.Check className="text" type="checkbox" label="Lost"/>
                    <Form.Check className="text" type="checkbox" label="Found"/>
                </div>
            </Form.Group>
        </Container>
        <Container>
            <Form.Group style={{justifyContent: "center", textAlign: "center"}}>
                <Button className="text primary-accent" variant="secondary" style={{marginBottom: "15px"}}><span className="text">Find Listings</span></Button>
            </Form.Group>
        </Container>
        <Container style={{height: "1px"}}></Container>
        </div>
    );
}

export default Classification;