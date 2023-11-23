import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from "react-bootstrap/esm/Col";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";
import LogoBar from "./LogoBar.jsx";
import ItemCard from "./Card.jsx";
import createIcon from "../img/plus.png";

function Profile(props){
  const [records, setRecords] = useState([]);

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
        return <ItemCard record={record} key={record._id} deleteRecord={deleteRecord} onProfile={true} />
    });
  }
  
  return (
    <div style={{ backgroundColor: "#D6C7AE" }}>
    <Container fluid>
        <LogoBar />
        <Container style={{marginTop: "15px"}} fluid>
        <Row>
            <Col lg={3}>
                <Container fluid className="d-flex justify-content-center align-items-center">
                <div className="userInfo">
                  <img className="profilePhoto" src="https://picsum.photos/200"/>
                  <h1>UserName</h1>
                  <h2>Title</h2>
                  <hr/>
                  <h1>PostCount</h1>
                  <h3>Posts</h3>
                  <hr/>
                  <Link to={`/create`}><Button className="createListing" variant="success" style={{backgroundColor: "#192655"}}><div className="text" style={{fontSize: "20px"}}>New Post <img width={20} height={20} src={createIcon}/></div></Button></Link>
                </div>
                </Container>
            </Col>
            <Col lg={9}>
                <Container fluid>
                <div className="userListings">
                  <Container className="logoBar" fluid>
                    <h1>Posts</h1>
                  </Container>
                  <Container className="profileItems" style={{textAlign: "center"}} fluid>
                    {recordList()}
                  </Container>
                </div>
                </Container>
            </Col>
        </Row>
        </Container>
    </Container>
    </div>
  );
};
 export default Profile;