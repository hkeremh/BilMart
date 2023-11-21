import React from "react";
import Container from "react-bootstrap/esm/Container";
import image from "../img/1.png";

export default function LogoBar(){
    return(
        <Container className="logoBar" fluid>
            <img style={{marginTop: "25px"}} src={image} className="img-fluid rounded-3  mb-4" alt="Logo image" width="170" height="36" loading="lazy"/>
        </Container>
    );
}