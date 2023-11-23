import React, { useState } from "react";
import { useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import Alert from 'react-bootstrap/Alert';

export default function SignUp() {
 const [form, setForm] = useState({
  username: "",
   email: "",
   password: ""
 });

 const [show, setShow] = useState(false);
 const [message, setMessage] = useState("");
 function AlertDismissibleExample() {
  if (show) {
    return (
      <Alert transition variant="danger" onClose={() => setShow(false)} dismissible>
        <Alert.Heading>Sign Up Error</Alert.Heading>
        <p>
          {message}
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

   const result = await fetch("http://localhost:5000/user/signup", {
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
   
   setForm({username: "", email: "", password: ""});
   const res = await result.json();
   console.log(res.message);
   if(res.message === "Verification mail sent successfully"){
    navigate("/");
   }
   else{
    setShow({show: true});
    setMessage(res.message);
    AlertDismissibleExample();
   }
   
 }
    return(
<div className="container mt-5">
  {AlertDismissibleExample()}
  <h1>Sign Up</h1>
  <div className="row">
    <div className="col-sm-8">
      <div className="card">
        <div className="card-body">
          <form onSubmit={onSubmit}>
            <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              type="username"
              className="form-control"
              id="username"
              value={form.username}
              onChange={(e) => updateForm({ username: e.target.value })}
              />              
            </div>
            <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email"
              className="form-control"
              id="email"
              value={form.email}
              onChange={(e) => updateForm({ email: e.target.value })}
              />              
            </div>
            <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password"
              className="form-control"
              id="password"
              value={form.password}
              onChange={(e) => updateForm({ password: e.target.value })}
              />
            </div>
            <button type="submit" value="SignUp" className="btn btn-dark">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
    );
}