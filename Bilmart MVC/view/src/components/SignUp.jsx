import React, { useState } from "react";
import { useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";

export default function SignUp() {
 const [form, setForm] = useState({
   email: "",
   username: "",
   password: ""
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

   await fetch("http://localhost:4000/user/signup", {
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
   
   setForm({email: "", password: ""});
   navigate("/verify");
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
            <label htmlFor="email">Email</label>
            <input 
              type="email"
              className="form-control"
              id="email"
              value={form.email}
              onChange={(e) => updateForm({ email: e.target.value })}
              />              
            </div>
            <div class="form-group">
            <label htmlFor="username">Username</label>
            <input 
              type="username"
              className="form-control"
              id="password"
              value={form.username}
              onChange={(e) => updateForm({ username: e.target.value })}
              />
            </div>
            <div class="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password"
              className="form-control"
              id="password"
              value={form.password}
              onChange={(e) => updateForm({ password: e.target.value })}
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