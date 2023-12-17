import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import ItemCard from "./Card.jsx";
import createIcon from "../img/plus.png";
import Button from "react-bootstrap/esm/Button.js";
import { Link } from "react-router-dom";
import LogoBar from "./LogoBar.jsx";
import NavBar from "./navbar.jsx";

const Wishlist = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [cookies, removeCookie] = useCookies([]);
  const [profileUser, setProfileUser] = useState({});
  async function fetchData(username) {
    const response = await fetch(`http://localhost:4000/user/username/${username}`);
    if (!response.ok) {
      const message = `An error has occurred: ${response.statusText}`;
      window.alert(message);
      return;
    }
    const user = await response.json();
    if (!user) {
      return;
    }
    setProfileUser(user);
  }
  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.userToken) {
        navigate("/login");
      }
      const { data } = await axios.post(
        "http://localhost:4000/user/",
        {},
        { withCredentials: true }
      );
      const { status, user } = data;
      await fetchData(user);
      return status
        ?  setIsUserLoading(false)
        : (removeCookie("userToken"), navigate("/login"));
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);
 const [records, setRecords] = useState([]);
 // This method fetches the records from the database.
 useEffect(() => {
   async function getRecords() {
    console.log(profileUser.username);
     const response = await fetch(`http://localhost:4000/user/wishlist/${params.username}`);

     if (!response.ok) {
       const message = `An error occurred: ${response.statusText}`;
       window.alert(message);
       return;
     }

     const records = await response.json();
     const wishlistPosts = [];
     for(var i = 0; i < records.length; i++){
         const response = await fetch(`http://localhost:4000/listing/proxy/${records[i]}`);
         if (!response.ok) {
            const message = `An error occurred: ${response.statusText}`;
            window.alert(message);
            return;
         }
         const record = await response.json();
         wishlistPosts.push(record);
     }
     setRecords(wishlistPosts);
     setIsLoading(false);
   }

   getRecords();

   return;
 }, [records.length]);

 // This method will map out the records on the table
 function recordList() {
   return records.map((record) => {
       return <ItemCard record={record} key={record._id}/>
   });
 }

 // This following section will display the table with the records of individuals.
 return (
  <div style={{backgroundColor: "var(--primary-color)"}}>
  <NavBar />
  <div style={{marginTop: 15 }}>
  {(isLoading || isUserLoading) ? (
      <div style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    ) : (
    <Container fluid style={{marginTop: "15px"}}>
        <LogoBar text="Wishlist"/>
        <Container style={{marginTop: "15px"}} fluid>
        <Row>
            <Col xl={3} md={4}>
                <Container fluid>
                  <Container fluid className="d-flex justify-content-center align-items-center">
                    <div className="userInfo">
                      {profileUser.profileImage === "" ? <svg xmlns="http://www.w3.org/2000/svg" fill="white" className="profilePhoto bi bi-person-circle" viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                        <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                      </svg> : <img className="profilePhoto" src={profileUser.profileImage} style={{backgroundColor: "lightgray"}}/>}
                      <h1>{profileUser.username}</h1>
                      <h4>{profileUser.description || "Description"}</h4>
                      <hr style={{border: "1px solid #544C4C", marginLeft: "15px", marginRight: "15px"}}/>
                      <h1>{profileUser.wishList.length}</h1>
                      <h3>Wishlist Posts</h3>
                      <hr style={{border: "1px solid #544C4C", marginLeft: "15px", marginRight: "15px"}}/>
                      <Link to={`/create`}><Button className="createListing" variant="secondary" style={{backgroundColor: "var(--text-color3)"}}><div className="text" style={{fontSize: "20px"}}>New Post <img width={20} height={20} src={createIcon}/></div></Button></Link>
                    </div>
                    </Container>
                  </Container>
            </Col>
            <Col xl={9} md={8}>
                <Container className="items" style={{textAlign: "center"}} fluid>
                    {recordList()}
                </Container>
            </Col>
        </Row>
        </Container>
    </Container>
    )}
  <ToastContainer />
</div>
</div>
 );
}

export default Wishlist;