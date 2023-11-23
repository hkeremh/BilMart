import React, { useState } from "react";
import { useNavigate } from "react-router";
import Alert from 'react-bootstrap/Alert';
import "bootstrap/dist/css/bootstrap.min.css";

export default function Login() {
 const [form, setForm] = useState({
   email: "",
   password: ""
 });

 const [show, setShow] = useState(false);
 function AlertDismissibleExample() {
  if (show) {
    return (
      <Alert transition variant="danger" onClose={() => setShow(false)} dismissible>
        <Alert.Heading>Invalid Credentials</Alert.Heading>
        <p>
          Incorrect email or password. Please try again.
        </p>
      </Alert>
    );
  }
}

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

   const result = await fetch("http://localhost:5000/user/login", {
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
   const response = await result.json();
   console.log(response);
   setForm({email: "", password: ""});
   if(response !== "User not found"){navigate("/");}
   else{setShow({show: true});}
   
 }
    return(
<div class="container mt-5">
  {AlertDismissibleExample()}
  <h1>Login</h1>
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
            <label htmlFor="password">Password</label>
            <input 
              type="password"
              className="form-control"
              id="password"
              value={form.password}
              onChange={(e) => updateForm({ password: e.target.value })}
              />
            </div>
            <button type="submit" value="Login" class="btn btn-dark">Login</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
    );
}