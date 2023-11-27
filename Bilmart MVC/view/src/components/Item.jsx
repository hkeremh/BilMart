import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import Container from "react-bootstrap/esm/Container";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Carousel from 'react-bootstrap/Carousel';
import LogoBar from "./LogoBar";

export default function Item() {
 const [item, setItem] = useState({
   title: "",
   description: "",
   availability: "",
   type: "",
   src: [],
   records: [],
 });
 const params = useParams();
 const navigate = useNavigate();

 useEffect(() => {
   async function fetchData() {
     const id = params.id.toString();
     const response = await fetch(`http://localhost:4000/listing/${params.id.toString()}`);

     if (!response.ok) {
       const message = `An error has occurred: ${response.statusText}`;
       window.alert(message);
       return;
     }

     const record = await response.json();
     if (!record) {
       window.alert(`Listing with id ${id} not found`);
       navigate("/");
       return;
     }

     setItem(record);
   }

   fetchData();

   return;
 }, [params.id, navigate]);

 function itemPhotos() {
    console.log(item.src);
    return item.src.map((source) => {
        return(
        <Carousel.Item>
        <div style={{justifyContent: "center", textAlign: "center"}}>
            <img className="rounded-3" src="https://picsum.photos/400" width={"700px"} height={"500px"}/> 
        </div>
        </Carousel.Item>
        );
    });
 }

 // This following section will display the form that takes input from the user to update the data.
 return (
   <Container fluid>
    <LogoBar />
    <Container style={{marginTop: "15px"}} fluid>
        <Row>
            <Col lg={6}>
                <div className="itemCarousel">
                <Carousel>
                    {itemPhotos()}
                </Carousel>
                </div>
            </Col>
            <Col lg={6}>
                <Container className="itemCardInfo" fluid>
                <h1>Listing Type</h1>
                <p>{item.type}</p>
                <h1>Title</h1>
                <p>{item.title}</p>
                </Container>
                <Container className="itemCardUserInfo" fluid>      
                </Container>
            </Col>
        </Row>
        <Row>
            <Col lg={12}>
                <Container className="itemCardDetails" fluid>
                <h1>Availability</h1>
                <p>{item.availability}</p>
                <h1>Description</h1>
                <p>{item.description}</p>
                </Container>
            </Col>
        </Row>
    </Container>
   </Container>
 );
}