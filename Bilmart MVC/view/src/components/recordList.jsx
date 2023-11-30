import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ItemCard from "./Card.jsx";
import Classification from "./Classification.jsx";
import LogoBar from "./LogoBar.jsx";
import NavBar from "./navbar.jsx";

const Home = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/login");
      }
      const { data } = await axios.post(
        "http://localhost:5000/user/",
        {},
        { withCredentials: true }
      );
      const { status, user } = data;
      setUsername(user);
      return status
        ?  console.log(user)
        : (removeCookie("token"), navigate("/login"));
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);
 const [records, setRecords] = useState([]);
 // This method fetches the records from the database.
 useEffect(() => {
   async function getRecords() {
     const response = await fetch(`http://localhost:4000/listing/`);

     if (!response.ok) {
       const message = `An error occurred: ${response.statusText}`;
       window.alert(message);
       return;
     }

     const records = await response.json();
     setRecords(records);
   }

   getRecords();

   return;
 }, [records.length]);

 // This method will delete a record
 async function deleteRecord(id) {
   await fetch(`http://localhost:4000/listing/${id}`, {
     method: "DELETE"
   });

   const newRecords = records.filter((el) => el._id !== id);
   setRecords(newRecords);
 }

 // This method will map out the records on the table
 function recordList() {
   return records.map((record) => {
       return <ItemCard record={record} key={record._id} deleteRecord={deleteRecord}/>
   });
 }

 // This following section will display the table with the records of individuals.
 return (
  <div>
  <NavBar />
  <div style={{ backgroundColor: "#D6C7AE", marginTop: 15 }}>
  <Container fluid style={{marginTop: "15px"}}>
      <LogoBar />
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
  <ToastContainer />
</div>
</div>
 );
}

export default Home;
