import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ItemCard from "./Card.jsx";
import Classification from "./Classification.jsx";
import LogoBar from "./LogoBar.jsx";

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
        ? toast.info(`Hello ${user}`, {
            position: "top-right",
          })
        : (removeCookie("token"), navigate("/login"));
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);
  const Logout = () => {
    removeCookie("token");
    navigate("/login");
  };
 const [records, setRecords] = useState([]);
 // This method fetches the records from the database.
 useEffect(() => {
   async function getRecords() {
     const response = await fetch(`http://localhost:5000/listing/`);

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
   await fetch(`http://localhost:5000/listing/${id}`, {
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
  <div style={{ backgroundColor: "#D6C7AE" }}>
  <Container fluid>
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
      <button onClick={Logout}>LOGOUT</button>
  </Container>
</div>
 );
}

export default Home;
