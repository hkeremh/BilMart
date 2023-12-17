import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer} from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import ItemCard from "./Card.jsx";
import NavBar from "./NavBar.jsx";
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import "bootstrap/dist/css/bootstrap.min.css";

let toggleState2 = true;
function setToggleState2(bool) {
  toggleState2 = bool;
}
function Home() {
  const navigate = useNavigate();
  const [isPostLoading, setIsPostLoading] = useState(true);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [searchDone, setSearchDone] = useState(false);
  const [allTags, setAllTags] = useState([]);
  const [tags, setTags] = useState([]);
  const [searchTypes, setSearchTypes] = useState([]);
  const [searchTags, setSearchTags] = useState([]);
  const [searchAvailability, setSearchAvailability] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchOrderBy, setSearchOrderBy] = useState("dateHigh");
  const [showPriceSort, setShowPriceSort] = useState(false);
  const [toggleState, setToggleState] = useState(true);
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
        ? (setIsUserLoading(false))
        : (removeCookie("userToken"), navigate("/login"));
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie, currentPage]);
  const [records, setRecords] = useState([]);
  // This method fetches the records from the database.
  async function getRecords(pageNumber) {
    setIsPostLoading(true);
    const response = await fetch(`http://localhost:4000/listing/home?pageNumber=${pageNumber}`);
    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`;
      window.alert(message);
      return;
    }
    const records = await response.json();
    console.log(records);
    setRecords(records);
    navigate(`/home?pageNumber=${pageNumber}`);
    setIsPostLoading(false);
  }

  useEffect(() => {
    getAllTags();
  }, []);
  
  function searchParamsJSON(pageNumber) {
    const inputTagsArray = searchText.split(',').map(tag => tag.trim());

    // Combine tags from checkboxes and inputted tags
    const combinedTags = Array.from(new Set([...searchTags, ...inputTagsArray]));
  
    return JSON.stringify({
      "text": searchText,
      "type": searchTypes,
      "tags": combinedTags,
      "availability": searchAvailability,
      "orderBy": searchOrderBy,
      "pageNumber": pageNumber,
    });
  }

  function isPriceItems() {
    const cloneSearchTypes = [...searchTypes];

    console.log(cloneSearchTypes);
    if (cloneSearchTypes.length === 0) return false;

    if (cloneSearchTypes.includes("Sale Item"))
      cloneSearchTypes.splice(cloneSearchTypes.indexOf("Sale Item"), 1);

    if (cloneSearchTypes.includes("Borrowal Item"))
      cloneSearchTypes.splice(cloneSearchTypes.indexOf("Borrowal Item"), 1);

    return cloneSearchTypes === 0;

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
  function updateArrayForPostTags(array, value, add) {
    if (add) {
      // Split tags by comma and trim spaces
      const newTags = value.split(',').map(tag => tag.trim());
      
      // Add new tags to the array
      array.push(...newTags);
    } else {
      // Remove the specified value from the array
      const index = array.indexOf(value);
      if (index !== -1) {
        array.splice(index, 1);
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
    setAllTags(allTags);
    console.log(allTags);
  }
  async function getSearchRecords(reqBody) {
    setIsPostLoading(true);
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

    // Perform the filtered search
    const filteredRecords = records.filter(record => {
      const lowercaseTitle = record.title.toLowerCase();
      const lowercaseDescription = record.description.toLowerCase();
      const lowercaseTags = record.tags.map(tag => tag.toLowerCase());
    
      const selectedTagsIncluded = searchTags.length === 0 || searchTags.some(selectedTag => lowercaseTags.includes(selectedTag.toLowerCase()));
      const inputTagsIncluded = searchText === '' || searchText.split(',').map(tag => tag.trim()).some(inputTag => lowercaseTags.includes(inputTag.toLowerCase()));

      if (searchText.trim() === '') 
        return (
          selectedTagsIncluded &&
          ((searchTypes.length === 0) || searchTypes.includes(record.type) || (searchTypes.includes("Lost&Found") && (record.type.toLowerCase() === "lost item" || record.type.toLowerCase() === "found item"))) &&
         
          (searchAvailability.length === 0 || 
            (searchAvailability.includes("Lost") && record.type.toLowerCase()==="lost item" )||
             searchAvailability.includes("Found") && record.type.toLowerCase()==="found item" ||
             searchAvailability.includes("Available") && (record.type.toLowerCase() !== "lost item" && record.type.toLowerCase() !== "found item")  // If no specific status selected, include all
          )
        );
      
      return (
        selectedTagsIncluded || inputTagsIncluded &&
        (!searchText || lowercaseTitle.includes(searchText.toLowerCase()) || lowercaseDescription.includes(searchText.toLowerCase())) &&
        ((searchTypes.length === 0) || searchTypes.includes(record.type) || (searchTypes.includes("Lost&Found") && (record.type.toLowerCase() === "lost item" || record.type.toLowerCase() === "found item"))) &&
        (searchAvailability.length === 0 || 
          (searchAvailability.includes("Lost") && record.type.toLowerCase()==="lost item" )||
           searchAvailability.includes("Found") && record.type.toLowerCase()==="found item" ||
           searchAvailability.includes("Available") && (record.type.toLowerCase() !== "lost item" && record.type.toLowerCase() !== "found item")  // If no specific status selected, include all
        ));
    });
      setRecords(filteredRecords);
      setIsPostLoading(false);
      navigate(`/home?state=search`);
      setIsPostLoading(false);

  }

  useEffect(() => {
    if(!searchDone){
      if(toggleState2){
        getRecords(currentPage);
      }
    } else {
      getSearchRecords(searchParamsJSON(currentPage));
    }
  }, [searchDone, currentPage, pageSize, toggleState]);


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
    <div style={{ backgroundColor: "var(--primary-color)"}}>
      <NavBar setText={setSearchText}/>
      <div style={{marginTop: 15 }}>
        {(isPostLoading || isUserLoading) ? (
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <Container fluid style={{ marginTop: "15px", marginBottom: "15px" }}>
            <Container style={{ marginTop: "15px" }} fluid>
              <Row>
                <Col xl={3} md={4}>
                  <Container className="selection" fluid>
                    <div>
                      <Container style={{ height: "10px" }}></Container>
                      <Container className="itemDetail">
                        <Form.Label><h2 className="text"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-tags-fill" viewBox="0 0 16 16">
                          <path d="M2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586zm3.5 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
                          <path d="M1.293 7.793A1 1 0 0 1 1 7.086V2a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l.043-.043-7.457-7.457z"/>
                        </svg> Tags</h2></Form.Label>
                        <div >
                          {tagList()}
                        </div>
                        <hr style={{border: "1px solid #544C4C", marginLeft: "10px", marginRight: "10px"}}/>
                        <Form.Label><h2 className="text"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-bookmark-plus-fill" viewBox="0 0 16 16">
                          <path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5m6.5-11a.5.5 0 0 0-1 0V6H6a.5.5 0 0 0 0 1h1.5v1.5a.5.5 0 0 0 1 0V7H10a.5.5 0 0 0 0-1H8.5z"/>
                        </svg> Category Tags</h2></Form.Label>
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
                              <option className="formSelectText" value="dateHigh">Date (New to Old)</option>
                              <option className="formSelectText" value="dateLow">Date (Old to New)</option>
                              <option className="formSelectText" value="priceLow" >Price (Low to High)</option>
                              <option className="formSelectText" value="priceHigh">Price (High to Low)</option>
                            </Form.Select> :
                              <Form.Select aria-label="Floating label select1" defaultValue={searchOrderBy} >
                                <option className="formSelectText" value="dateHigh">Date (New to Old)</option>
                                <option className="formSelectText" value="dateLow">Date (Old to New)</option>
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
                        <hr style={{border: "1px solid #544C4C", marginLeft: "10px", marginRight: "10px"}}/>
                      </Container>
                      <Container className="itemDetail">
                        <Form.Label><h2 className="text"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-patch-question" viewBox="0 0 16 16">
                          <path d="M8.05 9.6c.336 0 .504-.24.554-.627.04-.534.198-.815.847-1.26.673-.475 1.049-1.09 1.049-1.986 0-1.325-.92-2.227-2.262-2.227-1.02 0-1.792.492-2.1 1.29A1.71 1.71 0 0 0 6 5.48c0 .393.203.64.545.64.272 0 .455-.147.564-.51.158-.592.525-.915 1.074-.915.61 0 1.03.446 1.03 1.084 0 .563-.208.885-.822 1.325-.619.433-.926.914-.926 1.64v.111c0 .428.208.745.585.745"/>
                          <path d="m10.273 2.513-.921-.944.715-.698.622.637.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636a2.89 2.89 0 0 1 4.134 0l-.715.698a1.89 1.89 0 0 0-2.704 0l-.92.944-1.32-.016a1.89 1.89 0 0 0-1.911 1.912l.016 1.318-.944.921a1.89 1.89 0 0 0 0 2.704l.944.92-.016 1.32a1.89 1.89 0 0 0 1.912 1.911l1.318-.016.921.944a1.89 1.89 0 0 0 2.704 0l.92-.944 1.32.016a1.89 1.89 0 0 0 1.911-1.912l-.016-1.318.944-.921a1.89 1.89 0 0 0 0-2.704l-.944-.92.016-1.32a1.89 1.89 0 0 0-1.912-1.911l-1.318.016z"/>
                          <path d="M7.001 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0z"/>
                        </svg> Status</h2></Form.Label>
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
                      <hr style={{border: "1px solid #544C4C", marginLeft: "10px", marginRight: "10px"}}/>
                      <Container>
                        <Form.Group style={{ justifyContent: "center", textAlign: "center" }}>
                          <Button className="text" variant="secondary" onClick={(e) => (setCurrentPage(1), setSearchDone(true), setToggleState(!toggleState))} style={{ backgroundColor: "var(--text-color3)", marginBottom: "15px" }}><span className="text">Find Listings</span></Button>
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
export default Home;
export { setToggleState2, toggleState2 };
// export default Home;
