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
import Classification from "./Classification.jsx";
import LogoBar from "./LogoBar.jsx";
import NavBar from "./navbar.jsx";

const Wishlist = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  useEffect(() => {
    const verifyCookie = async () => {
      console.log(cookies)
      if (!cookies.userToken) {
        console.log("test")
        navigate("/login");
      }
      const { data } = await axios.post(
        "http://localhost:4000/user/",
        {},
        { withCredentials: true }
      );
      const { status, user } = data;
      setUsername(user);
      return status
        ?  console.log(user)
        : (removeCookie("userToken"), navigate("/login"));
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);
 const [records, setRecords] = useState([]);
 // This method fetches the records from the database.
 useEffect(() => {
   async function getRecords() {
    console.log(username);
     const response = await fetch(`http://localhost:4000/user/wishlist/${params.username}`);

     if (!response.ok) {
       const message = `An error occurred: ${response.statusText}`;
       window.alert(message);
       return;
     }

     const records = await response.json();
     const wishlistPosts = [];
     for(var i = 0; i < records.length; i++){
         const response = await fetch(`http://localhost:4000/listing/${records[i]}`);
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
  <div>
  <NavBar />
  <div style={{ backgroundColor: "#D6C7AE", marginTop: 15 }}>
  {isLoading ? (
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
                <Container className="selection" fluid>
                  <Classification />
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