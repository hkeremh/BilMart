import React, { useContext, useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import "bootstrap/dist/css/bootstrap.min.css";



function Classification(props) {

    const types = [];
    const availability = [];
    const tags = [];
    var text = "";
    var orderBy = "priceLow";
    
    const searched = false;

    useEffect(() => {
        getAllTags();
    }, []);

    useEffect(() => {  if(searched) findListings(); }, [props.pageNumber]);
       
      

    const [allTags, setAllTags] = useState([]);

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

    }

    async function findListings() {


        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "text": text,
            "type": types,
            "tags": tags,
            "availability": availability,
            "orderBy": orderBy,
            "pageNumber" : props.pageNumber,
        });

        //window.alert(raw);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:4000/listing/search", requestOptions)
            .then(response => response.json())
            .then(result => ( window.alert(result)))
            .catch(error => window.alert('error', error));


       

    }
    function tagList() {

        return allTags.map((t) => {
            return <Form.Check className="text" type="checkbox" label={t.name} onClick={(e) => (updateArray(tags, t.name, e.target.checked))} />
        });
    }

    return (

        <div>
            <Container style={{ height: "10px" }}></Container>
            <Container className="itemDetail">
                <Form.Label className="text">Tags</Form.Label>

                <div >
                    {tagList()}

                </div>

                <hr />
                <Form.Label className="text">Category Tag</Form.Label>

                <Form.Group className="mb-3" style={{ display: "flex" }}>
                    <div style={{ marginLeft: "0", marginRight: "auto" }}>
                        <Form.Check className="text" type="checkbox" label="Sale Item" onClick={(e) => (updateArray(types, "Sale Item", e.target.checked))} />
                        <Form.Check className="text" type="checkbox" label="Lost&Found" onClick={(e) => (updateArray(types, "Lost&Found", e.target.checked))} />
                    </div>
                    <div style={{ marginRight: "0", marginLeft: "auto" }}>
                        <Form.Check className="text" type="checkbox" label="Borrowal Item" onClick={(e) => (updateArray(types, "Borrowal Item", e.target.checked))} />
                        <Form.Check className="text" type="checkbox" label="Donation" onClick={(e) => (updateArray(types, "Donation", e.target.checked))} />
                    </div>



                </Form.Group>

                <Form.Group className="mb-3">
                <FloatingLabel
                    controlId="floatingSelectGrid"
                    label="Sort by"
                    className="text"
                    onChange={(e) => orderBy = e.target.value}
                    >
                    <Form.Select aria-label="Floating label select1">
                        <option className="text" value="priceLow" >Price (Low to High)</option>
                        <option className="text" value="priceHigh">Price (High to Low)</option>
                        <option className="text" value="dateHigh">Date (New to Old)</option>
                        <option className="text" value="dateLow">Date (Old to New)</option>
                    </Form.Select>
                </FloatingLabel>
               
            </Form.Group>




                <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2 text"
                    aria-label="Search"
                    onChange={(e) => (text = e.target.value)}
                />
                <hr />
            </Container>
            <Container className="itemDetail">
                <Form.Label className="text">Status</Form.Label>
                <hr />
                <Form.Group className="mb-3" style={{ display: "flex" }}>
                    <div style={{ marginLeft: "0", marginRight: "auto" }}>
                        <Form.Check className="text" type="checkbox" label="Available" onClick={(e) => (updateArray(availability, "Available", e.target.checked))} />
                        <Form.Check className="text" type="checkbox" label="Lost" onClick={(e) => (updateArray(availability, "Lost", e.target.checked))} />
                    </div>
                    <div style={{ marginRight: "0", marginLeft: "auto" }}>
                        
                        <Form.Check className="text" type="checkbox" label="Found" onClick={(e) => (updateArray(availability, "Found", e.target.checked))} />
                    </div>
                </Form.Group>
            </Container>
            <Container>
                <Form.Group style={{ justifyContent: "center", textAlign: "center" }}>
                    <Button className="text" variant="secondary" onClick={(e) => (searched = true, findListings())} style={{ backgroundColor: "#192655", marginBottom: "15px" }}><span className="text">Find Listings</span></Button>
                </Form.Group>
            </Container>
            <Container style={{ height: "1px" }}></Container>
        </div>

    );

}

export default Classification;
