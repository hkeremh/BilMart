import React, { useState } from "react";
import { useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Create() {
 const [form, setForm] = useState({
   title: "",
   description: "",
   availability: "",
   type: "",
 });
 const navigate = useNavigate();

 // These methods will update the state properties.
 function updateForm(value) {
   return setForm((prev) => {
     return { ...prev, ...value };
   });
 }

 // This function will handle the submission.
 async function onSubmit(e) {
   e.preventDefault();

   // When a post request is sent to the create url, we'll add a new record to the database.
   const newItem = { ...form };

   await fetch("http://localhost:5000/listing", {
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

   setForm({ title: "", description: "", availability: "", type: "" });
   navigate("/");
 }

 // This following section will display the form that takes the input from the user.
 return (
   <div>
     <h3>Create New Listing</h3>
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
