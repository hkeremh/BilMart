import React from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavBar from "./Navbar.jsx";
import ItemCard from "./Card.jsx";
import cardInfo from "../cardinfo.js";
import Classification from "./Classification.jsx";

function Home(){

    return(
        <div style={{backgroundColor: "#D6C7AE"}}>
        <Container fluid>
          <Row>
            <Col lg={2}>
                <Container className="selection" fluid>
                    <Classification/>
                </Container>
            </Col>
            <Col lg={10}>
                <Container className="items" fluid>
                    {cardInfo.map((cardItem, index) =>
                        <ItemCard key={index} id={index} src={cardItem.src} onSale={cardItem.onSale}/>
                    )}
                </Container>
            </Col>
          </Row>
        </Container>
        </div>
    );
 }

 export default Home;