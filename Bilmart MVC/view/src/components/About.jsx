import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import image from "../img/1.png";
import NavBar from "./navbar.jsx";

function About(){
    const date = new Date();
    const year = date.getFullYear();
    return(
      <div className="gradient-background">
      <NavBar />
        <div style={{ margin: "-50px" }}>
        <div className="px-4 pt-5 my-5 text-center border-bottom " >
        <h1 className="display-4 fw-bold text-body-emphasis">Welcome to BilMart!</h1>
        <div className="col-lg-6 mx-auto">
          <p className="lead mb-4">Welcome to BilMart, your go-to online marketplace designed exclusively for the vibrant community of Bilkent University. At BilMart, we are dedicated to providing a seamless platform for Bilkenters to buy or sell second-hand items, borrow or donate, and connect over lost and found items. Our web app is carefully crafted to enhance the Bilkent experience, making it faster and easier for students and community members to fulfill their needs.</p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mb-5">
            <Link to="/signup"><button type="button" className="btn btn-secondary btn-lg px-4 me-sm-3 primary-accent">Sign Up</button></Link>
            <Link to="/login"><button type="button" className="btn btn-outline-secondary btn-lg px-4">Log In</button></Link>
          </div>
          <img src={image} className="img-fluid rounded-3  mb-4" alt="Example image" width="500" height="500" loading="lazy"/>
        </div>
      </div>
      <div className="container px-4 py-5" id="featured-3">
        <h2 className="pb-2 border-bottom">Why BilMart?</h2>
        <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
          <div className="feature col">
            <div className="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3">
              <img src="./briefcase.svg" alt="" height="30"/>
            </div>
            <h3 className="fs-2 text-body-emphasis">Featured title</h3>
            <p>Paragraph of text beneath the heading to explain the heading. We'll add onto it with another sentence and probably just keep going until we run out of words.</p>
            <a href="#" className="icon-link">
              Call to action
              <img src="./chevron-right.svg" alt=""/>
            </a>
          </div>
          <div className="feature col">
            <div className="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3">
              <img src="./chat-square-heart.svg" alt="" height="30"/>
            </div>
            <h3 className="fs-2 text-body-emphasis">Featured title</h3>
            <p>Paragraph of text beneath the heading to explain the heading. We'll add onto it with another sentence and probably just keep going until we run out of words.</p>
            <a href="#" className="icon-link">
              Call to action
              <img src="./chevron-right.svg" alt=""/>
            </a>
          </div>
          <div className="feature col">
            <div className="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3">
              <img src="./bus-front.svg" alt="" height="30"/>
            </div>
            <h3 className="fs-2 text-body-emphasis">Featured title</h3>
            <p>Paragraph of text beneath the heading to explain the heading. We'll add onto it with another sentence and probably just keep going until we run out of words.</p>
            <a href="#" className="icon-link">
              Call to action
              <img src="./chevron-right.svg" alt=""/>
            </a>
          </div>
        </div>
      </div>
      <div className="container">
    <footer className="row row-cols-1 row-cols-sm-2 row-cols-md-5 py-5 my-5 border-top">
      <div className="col mb-3">
        <a href="/" className="d-flex align-items-center mb-3 link-body-emphasis text-decoration-none">
          <svg className="bi me-2" width="40" height="32">
          </svg>
        </a>
        <p className="text-body-secondary">Copyright© {year}</p>
      </div>

      <div className="col mb-3">
        <h5>Explore BilMart</h5>
        <ul className="nav flex-column">
          <li className="nav-item mb-2"><a href="/home" className="nav-link p-0 text-body-secondary">Home</a></li>
          <li className="nav-item mb-2"><a href="/signup" className="nav-link p-0 text-body-secondary">Sign Up</a></li>
          <li className="nav-item mb-2"><a href="/login" className="nav-link p-0 text-body-secondary">Login</a></li>
          <li className="nav-item mb-2"><a href="/about" className="nav-link p-0 text-body-secondary">About</a></li>
        </ul>
      </div>
    </footer>
  </div>
      </div>
      </div>
    );
}

export default About;