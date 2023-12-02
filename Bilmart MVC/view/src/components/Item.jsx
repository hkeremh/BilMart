import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import Container from "react-bootstrap/esm/Container";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from 'react-toastify';
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Carousel from 'react-bootstrap/Carousel';
import Button from "react-bootstrap/esm/Button";
import LogoBar from "./LogoBar";
import NavBar from "./navbar";

export default function Item() {
 const [owner, setOwner] = useState({});
 const [item, setItem] = useState({
   title: "",
   postDate: {},
   description: "",
   availability: "",
   type: "",
   postOwner: "",
   images: [],
   records: [],
 });
 const params = useParams();
 const navigate = useNavigate();
 async function fetchUserData(id) {
  const response = await fetch(`http://localhost:4000/user/id/${id}`);
  if (!response.ok) {
    const message = `An error has occurred: ${response.statusText}`;
    window.alert(message);
    return;
  }
  const user = await response.json();
  if (!user) {
    return;
  }
  setOwner(user);
}
 useEffect(() => {
   async function fetchPostData() {
     const id = params.id.toString();
     const response = await fetch(`http://localhost:4000/listing/${params.id.toString()}`);

     if (!response.ok) {
       const message = `An error has occurred: ${response.statusText}`;
       window.alert(message);
       return;
     }

     const record = await response.json();
     if (!record) {
       toast.error(`Listing with id ${id} not found`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
       navigate("/");
       return;
     }

     setItem(record);
     const userID = record.postOwner;
     fetchUserData(userID);
   }

   fetchPostData();

   return;
 }, [params.id, navigate]);

 function itemPhotos() {
    console.log(item.images);
    return item.images.map((source) => {
        return(
        <Carousel.Item>
        <div style={{justifyContent: "center", textAlign: "center"}}>
            <img className="rounded-3" src={source} width={"auto"} height={"520px"} style={{maxWidth: "700px"}}/> 
        </div>
        </Carousel.Item>
        );
    });
 }

 // This following section will display the form that takes input from the user to update the data.
 return (
  <div>
   <NavBar />
   <Container fluid style={{ marginTop: 15 }}>
    <LogoBar />
    <Container style={{marginTop: "15px"}} fluid>
        <Row>
            <Col xl={7}>
                <div className="itemCarousel">
                <Carousel>
                    {itemPhotos()}
                </Carousel>
                </div>
            </Col>
            <Col xl={5}>
                <Container className="itemCardInfo" fluid>
                  <div style={{display: "flex", alignItems: "center"}}>
                    {item.type === "Donation" ? <h1 className="itemPrice">{item.price + "₺ Goal"}</h1> : <h1 className="itemPrice">{item.price}₺</h1>}
                    <Button variant="secondary" style={{backgroundColor: "#192655", position: "absolute", right: "45px"}}>
                      <div className="text" style={{alignItems: "center"}}>Add to Wishlist <span><svg style={{marginBottom: "5px"}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bag-heart-fill" viewBox="0 0 16 16">
                          <path d="M11.5 4v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m0 6.993c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132"/>
                        </svg></span>
                      </div>
                    </Button>
                  </div>
                  <hr style={{border: "1px solid #544C4C", marginTop: "-2px", marginLeft: "15px", marginRight: "15px"}}/>
                  <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <h3>{item.title || "Title"}</h3>
                  </div> 
                  <hr style={{border: "1px solid #544C4C", marginLeft: "15px", marginRight: "15px"}}/>
                  <div className="postDate" style={{alignItems: "center", display: "flex"}}>
                    <h3 style={{fontWeight: "bolder"}}>Post Date: </h3>
                    <h3 style={{color: "black", marginLeft: "10px"}}>{item.postDate.toString().substring(0, 10)}</h3>
                  </div>
                </Container>
                <Container className="itemCardUserInfo" fluid>   
                  <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                  {console.log(owner)}
                    <div style={{marginRight: "10px"}}>
                    {owner.profilePhoto === "" ? <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="currentColor" className="itemProfilePhoto bi bi-person-circle" viewBox="0 0 16 16">
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                      <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                    </svg> : <img className="itemProfilePhoto" width="auto" height="150" style={{borderRadius: "50%"}} src={owner.profilePhoto}/>}
                    </div>
                    <div className="itemUserInfo" style={{marginLeft: "10px"}}>
                      <h1>{owner.username}</h1>
                      <hr/>
                      <h2 style={{alignItems: "center"}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" className="bi bi-person-lines-fill me-3" viewBox="0 0 16 16">
                            <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z"/>
                        </svg>{owner.title || "Title"}
                      </h2>
                    </div>
                  </div>
                  <hr style={{border: "1px solid #544C4C", marginLeft: "15px", marginRight: "15px"}}/>
                  <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                    {item.type === "Donation" ? <h3 className="text">IBAN:</h3> : <Button variant="secondary" style={{backgroundColor: "#192655"}}><div className="text">Request Contact</div></Button>}
                  </div>   
                </Container>
            </Col>
        </Row>
        <Row>
            <Col lg={12}>
                <Container className="itemCardDetails text" fluid>
                <div>
                  <div style={{display: "flex", alignItems: "center"}}>
                      <h1 style={{fontWeight: "bolder"}}>Details</h1>
                      <p style={{position: "absolute", right: "45px"}}>{"ID: " + item._id}</p>
                  </div>
                  <div style={{alignItems: "center", display: "flex"}}>
                      <h3 style={{color: "#E1AA74"}}>Condition: </h3>
                      <h3 style={{color: "black", marginLeft: "10px"}}>{item.availability}</h3>
                      <Button variant="outline-danger" style={{position: "absolute", right: "45px", marginBottom: "15px"}}>Report Post</Button>
                  </div>
                </div>
                <hr style={{border: "1px solid #544C4C", marginLeft: "15px", marginRight: "15px", marginTop: "-1px"}}/>
                <div style={{marginBottom: "15px"}}>
                  <h1 style={{fontWeight: "bolder"}}>Description</h1>
                  <h3 >{item.description}</h3>
                  <div style={{height: "10px"}}></div>
                </div>
                </Container>
            </Col>
        </Row>
    </Container>
    <ToastContainer />
   </Container>
   </div>
 );
}