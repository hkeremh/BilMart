import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from 'react-toastify';
import NavBar from "./navbar.jsx";

export default function Edit() {
 const [form, setForm] = useState({
   title: "",
   description: "",
   availability: "",
   type: "",
   price: "",
   src: [],
 });
 const [sources, setSources] = useState([]);
 const params = useParams();
 const navigate = useNavigate();

 useEffect(() => {
   async function fetchData() {
     const id = params.id.toString();
     const response = await fetch(`http://localhost:5000/listing/${params.id.toString()}`);

     if (!response.ok) {
       const message = `An error has occurred: ${response.statusText}`;
       window.alert(message);
       return;
     }

     const record = await response.json();
     if (!record) {
      toast.error(`Listing with id ${id} not found`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
       navigate("/");
       return;
     }
     setForm(record);
     setSources(record.src);
   }

   fetchData();

   return;
 }, [params.id, navigate]);

 // These methods will update the state properties.
 function updateForm(value) {
   return setForm((prev) => {
     return { ...prev, ...value };
   });
 }

 function updateSources(value) {
  return setSources((prev) => {
    return [...prev, value];
  });
 }

 async function onSubmit(e) {
   e.preventDefault();
   const editedListing = {
     title: form.title,
     description: form.description,
     availability: form.availability,
     type: form.type,
     price: form.price,
     src: sources
   };
   if ((form.type === "Donation") || (sources.length !== 0 && sources.length <= 5)){
    // This will send a post request to update the data in the database.
    await fetch(`http://localhost:5000/listing/${params.id}`, {
      method: "PATCH",
      body: JSON.stringify(editedListing),
      headers: {
        'Content-Type': 'application/json'
      },
    });

    navigate("/");    
   }
   else{
    toast.error('Please upload 1-5 pictures', {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      });
   }

 }

 // This following section will display the form that takes input from the user to update the data.
 return (
  <div>
  <NavBar />
  <div style={{ marginTop: 15 }}>
  <h3>Update Listing</h3>
  <form onSubmit={onSubmit}>
    <div className="form-group">
      <label htmlFor="title">Title</label>
      <input
        type="text"
        className="form-control"
        id="title"
        value={form.title}
        onChange={(e) => updateForm({ title: e.target.value })}
      />
    </div>
    <div className="form-group">
      <label htmlFor="description">Description</label>
      <input
        type="text"
        className="form-control"
        id="description"
        value={form.description}
        onChange={(e) => updateForm({ description: e.target.value })}
      />
    </div>
    <div className="form-group">
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="typeOptions"
          id="saleItem"
          value="Sale Item"
          checked={form.type === "Sale Item"}
          onChange={(e) => updateForm({ type: e.target.value })}
        />
        <label htmlFor="saleItem" className="form-check-label">Sale Item</label>
      </div>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="typeOptions"
          id="borrowalItem"
          value="Borrowal Item"
          checked={form.type === "Borrowal Item"}
          onChange={(e) => updateForm({ type: e.target.value })}
        />
        <label htmlFor="borrowalItem" className="form-check-label">Borrowal Item</label>
      </div>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="typeOptions"
          id="lostItem"
          value="Lost Item"
          checked={form.type === "Lost Item"}
          onChange={(e) => updateForm({ type: e.target.value })}
        />
        <label htmlFor="lostItem" className="form-check-label">Lost Item</label>
      </div>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="typeOptions"
          id="foundItem"
          value="Found Item"
          checked={form.type === "Found Item"}
          onChange={(e) => updateForm({ type: e.target.value })}
        />
        <label htmlFor="foundItem" className="form-check-label">Found Item</label>
      </div>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="typeOptions"
          id="donation"
          value="Donation"
          checked={form.type === "Donation"}
          onChange={(e) => updateForm({ type: e.target.value })}
        />
        <label htmlFor="Donation" className="form-check-label">Donation</label>
      </div>
      {form.type ===  "Sale Item" && <div className="form-group"><label htmlFor="price">Price</label><input type="text" className="form-control" id="price" value={form.price} onChange={(e) => updateForm({ price: e.target.value })}/></div>}
      {form.type ===  "Borrowal Item" && <div className="form-group"><label htmlFor="price">Price</label><input type="text" className="form-control" id="price" value={form.price} onChange={(e) => updateForm({ price: e.target.value })}/></div>}
      {form.type ===  "Donation" && <div className="form-group"><label htmlFor="price">Donation Goal</label><input type="text" className="form-control" id="price" value={form.price} onChange={(e) => updateForm({ price: e.target.value })}/></div>}
      {form.type !== "Donation" &&       
      <Form.Group className="mb-3">
      <Form.Label>Upload Pictures</Form.Label>
      <Form.Control
        type="file"
        className="form-control"
        id="image"
        accept="image/x-png,image/jpeg"
        onChange={(e) => {
          let file = e.target.files[0];
          let reader = new FileReader();
          reader.onloadend = function () {
            console.log(reader.result); // This will log the base64 string
            console.log(file);
            updateSources(reader.result);
          }
          reader.readAsDataURL(file);
        }}
      />
      <h4>Selected Pictures:</h4>
      <div>{sources.map((source) => {
        return <img className="centered-and-cropped" width="100" height="100" style={{borderRadius: "50%"}} src={source} />
      })}
      </div>
    </Form.Group>
    }
    </div>
    <Container>
    <Row>
    <Col>
    <div className="form-group">
      <input
        type="submit"
        value="Update Listing"
        className="btn btn-primary"
      />
    </div>
    </Col>
    <Col>
    <div className="form-group">
      <input
        type="submit"
        value="Mark as Sold"
        className="btn btn-danger"
        onClick={(e) => updateForm({ availability: "Sold" })}
      />
    </div>
    </Col>
    <Col>
    <div className="form-group">
      <input
        type="submit"
        value="Mark as Available"
        className="btn btn-success"
        onClick={(e) => updateForm({ availability: "Available" })}
      />
    </div>
    </Col>
    </Row>
    </Container>
  </form>
  <ToastContainer />
  </div>
</div>
 );
}
