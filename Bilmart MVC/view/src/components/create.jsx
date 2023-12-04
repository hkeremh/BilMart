import React, { useState } from "react";
import { useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from 'react-bootstrap/Form';

export default function Create() {
 const [form, setForm] = useState({
   title: "",
   description: "",
   availability: "",
   type: "",
 });
 const [sources, setSources] = useState([]);
 const navigate = useNavigate();

 // These methods will update the state properties.
 function updateForm(value) {
   console.log(form.src)
   return setForm((prev) => {
     return { ...prev, ...value };
   });
 }

 function updateSources(value) {
   return setSources((prev) => {
     return [...prev, value];
   });
 }

 // This function will handle the submission.
 async function onSubmit(e) {
  if(sources.length !== 0 && sources.length <= 5) {
   e.preventDefault();

   // When a post request is sent to the create url, we'll add a new record to the database.
   const newItem = { ...form, src: sources };

   await fetch("https://localhost:5000/listing", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(newItem),
   })
   .catch(error => {
     window.alert(error);
     return;
   });

   setForm({ title: "", description: "", availability: "", type: ""});
   navigate("/");
  }
  else{
    window.alert("Please upload 1-5 pictures");
  }
 }

 // This following section will display the form that takes the input from the user.
 return (
   <div>
     <h3>Create New Listing</h3>
     <form onSubmit={onSubmit}>
     <Form.Group className="mb-3">
        <Form.Label>Upload Pictures</Form.Label>
        <Form.Control
          type="file" 
          className="form-control"
          id="src"
          accept="image/x-png,image/jpeg"
          onChange={(e) => {updateSources(e.target.value)}}
        />
        <h4>Selected Pictures:</h4>
        <div>{sources.map((source) => {
            return <img src={source} />
          })}
        </div>
      </Form.Group>
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
         <label htmlFor="description">Availability</label>
         <input
           type="text"
           className="form-control"
           id="availability"
           value={form.availability}
           onChange={(e) => updateForm({ availability: e.target.value })}
         />
       </div>
       <div className="form-group">
         <div className="form-check form-check-inline">
           <input
             className="form-check-input"
             type="radio"
             name="positionOptions"
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
             name="positionOptions"
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
             name="positionOptions"
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
             name="positionOptions"
             id="foundItem"
             value="Found Item"
             checked={form.type === "Found Item"}
             onChange={(e) => updateForm({ type: e.target.value })}
           />
           <label htmlFor="foundItem" className="form-check-label">Found Item</label>
         </div>
       </div>
       <div className="form-group">
         <input
           type="submit"
           value="Create Listing"
           className="btn btn-primary"
         />
       </div>
     </form>
   </div>
 );
}
