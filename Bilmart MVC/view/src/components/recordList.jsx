import React, { useEffect, useState, createContext } from "react";
import { useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import ItemCard from "./Card.jsx";
import Classification from "./Classification.jsx";
import LogoBar from "./LogoBar.jsx";
import NavBar from "./navbar.jsx";



const Home = () => {
  const navigate = useNavigate();
  const [isPostLoading, setIsPostLoading] = useState(true); 
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);

 
  useEffect(() => {
    const verifyCookie = async () => {
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
        ?  setIsUserLoading(false)
        : (removeCookie("userToken"), navigate("/login"));
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);
 const [records, setRecords] = useState([]);
 // This method fetches the records from the database.
   async function getRecords(pageNumber){
    const response = await fetch(`http://localhost:4000/listing/home?pageNumber=${pageNumber}`);

    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`;
      window.alert(message);
      return;
    }

    const records = await response.json();
    setRecords(records);
    setIsPostLoading(false);
    navigate(`/home?pageNumber=${pageNumber}`);
  }  
useEffect(() => {
  getRecords(currentPage);
}, [currentPage, pageSize]);

//  useEffect(() => {
//    async function getRecords() {
//      const response = await fetch(`http://localhost:4000/listing/`);

//      if (!response.ok) {
//        const message = `An error occurred: ${response.statusText}`;
//        window.alert(message);
//        return;
//      }

//      const records = await response.json();
//      setRecords(records);
//      setIsLoading(false);
//    }

//    getRecords();

//    return;
//  }, [records.length]);

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
  {(isPostLoading || isUserLoading) ? (
      <div style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    ) : (
      <Container fluid style={{marginTop: "15px"}}>
          <LogoBar />
          <Container style={{marginTop: "15px"}} fluid>
          <Row>
              <Col xl={3} md={4}>
                  <Container className="selection" fluid>
                    
                    <Classification pageNumber = {currentPage}/>
                    
                    
                  </Container>
              </Col>
              <Col xl={9} md={8}>
                  <Container className="items" style={{textAlign: "center"}} fluid>
                      {recordList()}
                  </Container>
                  <div style={{textAlign: "center", marginTop: "10px"}}>
                  <Button variant="secondary" onClick={() => (setCurrentPage(currentPage - 1), setIsPostLoading(true), getRecords(currentPage-1))} disabled={currentPage === 1} style={{marginRight: "5px"}}>Previous</Button>
                  <Button variant="secondary" onClick={() => (setCurrentPage(currentPage + 1), setIsPostLoading(true), getRecords(currentPage+1))} disabled={records.length < pageSize} style={{marginLeft: "5px"}}>Next</Button>
                  </div>
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


export default Home;

