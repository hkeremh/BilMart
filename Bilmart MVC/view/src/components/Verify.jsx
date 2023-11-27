import React, { useState } from "react";
import { useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";

export default function SignUp() {
 const [form, setForm] = useState({
   verificationCode: "",
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

   await fetch("http://localhost:4000/user/verify", {
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
   
   navigate("/");
 }
    return(
<div class="container mt-5">
  <h1>Sign Up</h1>
  <div class="row">
    <div class="col-sm-8">
      <div class="card">
        <div class="card-body">
          <form onSubmit={onSubmit}>
            <div class="form-group">
            <label htmlFor="verificationcode">Enter Verification Code</label>
            <input 
              type="verificationcode"
              className="form-control"
              id="verification code"
              value={form.verificationCode}
              onChange={(e) => updateForm({ verificationCode: e.target.value })}
              />              
            </div>
            <button type="submit" value="SignUp" class="btn btn-dark">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
    );
}