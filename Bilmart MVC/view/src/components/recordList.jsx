import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ItemCard from "./Card.jsx";
import Classification from "./Classification.jsx";
import LogoBar from "./LogoBar.jsx";

export default function Home() {
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
          <Col lg={2}>
              <Container className="selection" fluid>
                <Classification />
              </Container>
          </Col>
          <Col lg={10}>
              <Container className="items" fluid>
                  {recordList()}
              </Container>
          </Col>
      </Row>
      </Container>
  </Container>
</div>
 );
}
