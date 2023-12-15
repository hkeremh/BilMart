import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import LogoBar from "./LogoBar.jsx";
import NavBar from "./navbar.jsx";
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import "bootstrap/dist/css/bootstrap.min.css";



export default function Home() {
  const navigate = useNavigate();
  const [isPostLoading, setIsPostLoading] = useState(true);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [searchDone, setSearchDone] = useState(false);
  const [allTags, setAllTags] = useState([]);
  const [searchTypes, setSearchTypes] = useState([]);
  const [searchTags, setSearchTags] = useState([]);
  const [searchAvailability, setSearchAvailability] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchOrderBy, setSearchOrderBy] = useState("dateHigh");
  const [showPriceSort, setShowPriceSort] = useState(false);

  function handlePageChange(pageNumber) {
    setCurrentPage(pageNumber);
  }
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
        ?  (setIsUserLoading(false))
        : (removeCookie("userToken"), navigate("/login"));
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie, currentPage]);
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
    console.log(records);
    setRecords(records);
    setIsPostLoading(false);
    navigate(`/home?pageNumber=${pageNumber}`);
  }

    useEffect(() => {
    getAllTags();
  }, []);

  function searchParamsJSON(pageNumber) {
    return JSON.stringify({
      "text": searchText,
      "type": searchTypes,
      "tags": searchTags,
      "availability": searchAvailability,
      "orderBy": searchOrderBy,
      "pageNumber": pageNumber,
    });
  }

  function isPriceItems() {
    const cloneSearchTypes = [...searchTypes];

    console.log(cloneSearchTypes);
    if (cloneSearchTypes.length == 0) return false;

    if (cloneSearchTypes.includes("Sale Item"))
      cloneSearchTypes.splice(cloneSearchTypes.indexOf("Sale Item"), 1);

    if (cloneSearchTypes.includes("Borrowal Item"))
      cloneSearchTypes.splice(cloneSearchTypes.indexOf("Borrowal Item"), 1);

    return cloneSearchTypes == 0;


  }


function tagList() {

  return allTags.map((t) => {
    return <Form.Check className="text" type="checkbox" defaultChecked={searchTags.includes(t.name)} label={t.name} onClick={(e) => (setSearchTags(updateArray(searchTags, t.name, e.target.checked)))} />
  });
}

function updateArray(array, value, add) {
  if (add) {
    if (!array.includes(value)) {
      array.push(value);
    }

  }

  else {
    if (array.includes(value)) {
      array.splice(array.indexOf(value), 1);
    }

  }

  setShowPriceSort(isPriceItems());
  return array;
}

async function getAllTags() {
  const response = await fetch(`http://localhost:4000/listing/tags`);

  if (!response.ok) {
    const message = `An error occurred: ${response.statusText}`;
    window.alert(message);
    return;
  }

  const allTags = await response.json();
  setAllTags(allTags);  }

async function getSearchRecords(reqBody) {


  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: reqBody,
    redirect: 'follow'
  };


  const response = await fetch("http://localhost:4000/listing/search", requestOptions);

  if (!response.ok) {
    const message = `An error occurred: ${response.statusText}`;
    window.alert(message);
    return;
  }


  const records = await response.json();
  console.log("search records: " + records);

  setRecords(records);

  navigate(`/home?state=search`);
  setIsPostLoading(false);

}

useEffect(() => {

  if (!searchDone)
    getRecords(currentPage);
  else
    getSearchRecords(searchParamsJSON(currentPage))


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
    return <ItemCard record={record} key={record._id} deleteRecord={deleteRecord} />
  });
}



// This following section will display the table with the records of individuals.
return (
  <div className="primary-color" >
    <NavBar />
    <div style={{marginTop: 15 }}>
      {(isPostLoading || isUserLoading) ? (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Container fluid style={{ marginTop: "15px" }}>
          <LogoBar />
          <Container style={{ marginTop: "15px" }} fluid>
            <Row>
              <Col xl={3} md={4}>
                <Container className="selection" fluid>

                  <div>
                    <Container style={{ height: "10px" }}></Container>
                    <Container className="itemDetail ">
                      <Form.Label className="text">Tags</Form.Label>

                      <div >
                        {tagList()}

                      </div>

                      <hr />
                      <Form.Label className="text">Category Tag</Form.Label>

                      <Form.Group className="mb-3" style={{ display: "flex" }}>
                        <div style={{ marginLeft: "0", marginRight: "auto" }}>
                          <Form.Check className="text" type="checkbox" label="Sale Item" defaultChecked={searchTypes.includes("Sale Item")} onClick={(e) => (setSearchTypes(updateArray(searchTypes, "Sale Item", e.target.checked)))} />
                          <Form.Check className="text" type="checkbox" label="Lost&Found" defaultChecked={searchTypes.includes("Lost&Found")} onClick={(e) => (setSearchTypes(updateArray(searchTypes, "Lost&Found", e.target.checked, setSearchTypes)))} />
                        </div>
                        <div style={{ marginRight: "0", marginLeft: "auto" }}>
                          <Form.Check className="text" type="checkbox" label="Borrowal Item" defaultChecked={searchTypes.includes("Borrowal Item")} onClick={(e) => (setSearchTypes(updateArray(searchTypes, "Borrowal Item", e.target.checked, setSearchTypes)))} />
                          <Form.Check className="text" type="checkbox" label="Donation" defaultChecked={searchTypes.includes("Donation")} onClick={(e) => (setSearchTypes(updateArray(searchTypes, "Donation", e.target.checked, setSearchTypes)))} />
                        </div>



                      </Form.Group>

                      <Form.Group className="mb-3">
                        <FloatingLabel
                          controlId="floatingSelectGrid"
                          label="Sort by"
                          className="text"

                          onChange={(e) => setSearchOrderBy(e.target.value)}
                        >
                         {showPriceSort ? <Form.Select aria-label="Floating label select1" defaultValue={searchOrderBy} >
                              <option className="text" value="dateHigh">Date (New to Old)</option>
                              <option className="text" value="dateLow">Date (Old to New)</option>
                              <option className="text" value="priceLow" >Price (Low to High)</option>
                            <option className="text" value="priceHigh">Price (High to Low)</option>
                          </Form.Select> :

                          <Form.Select aria-label="Floating label select1" defaultValue={searchOrderBy} >
                              <option className="text" value="dateHigh">Date (New to Old)</option>
                              <option className="text" value="dateLow">Date (Old to New)</option>
                          </Form.Select>}
                        </FloatingLabel>

                      </Form.Group>
                      <Form.Control
                        type="search"
                        placeholder="Search"
                        className="me-2 text"
                        aria-label="Search"
                        defaultValue={searchText}
                        onChange={(e) => (setSearchText(e.target.value))}
                      />
                      <hr />
                    </Container>
                    <Container className="itemDetail">
                      <Form.Label className="text">Status</Form.Label>
                      <hr />
                      <Form.Group className="mb-3" style={{ display: "flex" }}>
                        <div style={{ marginLeft: "0", marginRight: "auto" }}>
                          <Form.Check className="text" type="checkbox" label="Available" onClick={(e) => (setSearchAvailability(updateArray(searchAvailability, "Available", e.target.checked)))} />
                          <Form.Check className="text" type="checkbox" label="Lost" onClick={(e) => (setSearchAvailability(updateArray(searchAvailability, "Lost", e.target.checked)))} />
                        </div>
                        <div style={{ marginRight: "0", marginLeft: "auto" }}>

                          <Form.Check className="text" type="checkbox" label="Found" onClick={(e) => (setSearchAvailability(updateArray(searchAvailability, "Found", e.target.checked)))} />
                        </div>
                      </Form.Group>
                    </Container>
                    <Container>
                      <Form.Group style={{ justifyContent: "center", textAlign: "center" }}>
                        <Button className="text" variant="secondary" onClick={(e) => ( setIsPostLoading(true),setSearchDone(true), setCurrentPage(1), getSearchRecords(searchParamsJSON(currentPage)))} style={{ backgroundColor: "#192655", marginBottom: "15px" }}><span className="text">Find Listings</span></Button>
                      </Form.Group>
                    </Container>
                    <Container style={{ height: "1px" }}></Container>
                  </div>


                </Container>
              </Col>
              <Col xl={9} md={8}>
                <Container className="items" style={{ textAlign: "center" }} fluid>
                  {recordList()}


                </Container>
                <div style={{ textAlign: "center", marginTop: "10px" }}>
                  <Button variant="secondary" onClick={() => (setCurrentPage(currentPage - 1), setIsPostLoading(true))} disabled={currentPage === 1} style={{ marginRight: "5px" }}>Previous</Button>
                  <Button variant="secondary" onClick={() => (setCurrentPage(currentPage + 1), setIsPostLoading(true))} disabled={records.length < pageSize} style={{ marginLeft: "5px" }}>Next</Button>
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

// export default Home;
