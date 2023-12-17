import React from "react";
import Container from "react-bootstrap/esm/Container";
import image from "../img/BilMart-logos_transparent.png";

export default function LogoBar(props){
    return( //This is the logo bar that is used in Item, Wishlist, Profile pages
        <Container className="logoBar" fluid style={{backgroundColor: "var(--secondary-color)"}}>
            <div style={{display: "flex", marginTop: "25px"}}>
            <img src={image} className="img-fluid  mb-4" alt="Logo image" width="175" height="36" loading="lazy" style={{color: "var(--text-color3)"}}/>
            <h3 className="text" style={{marginTop: "5px", marginLeft: "15px", fontWeight: "bolder", color: "var(--text-color)", position: "absolute", right: "45px"}}>{props.text}</h3>
            </div>
        </Container>
    );
}