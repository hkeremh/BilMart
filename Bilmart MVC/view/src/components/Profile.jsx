import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from "react-bootstrap/esm/Col";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";
import LogoBar from "./LogoBar.jsx";

function Profile(props){
  return (
    <div style={{ backgroundColor: "#D6C7AE" }}>
    <Container fluid>
        <LogoBar />
        <Container style={{marginTop: "15px"}} fluid>
        <Row>
            <Col lg={4}>
                <Container fluid className="d-flex justify-content-center align-items-center">
                <div className="userInfo">
                  <img src="https://picsum.photos/200"/>
                  <h1>UserName</h1>
                  <h2>Title</h2>
                  <hr/>
                  <h1>PostCount</h1>
                  <h3>Posts</h3>
                  <hr/>
                  <Link to={`/create`}><Button className="createListing" variant="secondary" style={{backgroundColor: "#192655"}}>Create Listing</Button></Link>
                </div>
                </Container>
            </Col>
            <Col lg={8}>
                <Container fluid>
                <div className="userListings">
                  <Container className="logoBar" fluid>
                    <h1>Posts</h1>
                  </Container>
                </div>
                </Container>
            </Col>
        </Row>
        </Container>
    </Container>
    </div>
  );
};
 export default Profile;