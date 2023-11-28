import React, { useState } from "react";
import { useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from 'react-toastify';
import axios from "axios";

export default function SignUp() {
const navigate = useNavigate();
 const [form, setForm] = useState({
   username: "",
   email: "",
   password: ""
 });
 const handleError = (err) =>
 toast.error(err, {
   position: "top-center",
 });
const handleSuccess = (msg) =>
 toast.success(msg, {
   position: "top-center",
 });
 // These methods will update the state properties.
 function updateForm(value) {
   return setForm((prev) => {
     return { ...prev, ...value };
   });
 }

 // This function will handle the submission.
 async function onSubmit(e){
  e.preventDefault();
  try {
    const { data } = await axios.post(
      "http://localhost:5000/user/signup",
      {
        ...form,
      },
      { withCredentials: true }
    );
    const { success, message } = data;
    if (success) {
      handleSuccess(message);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } else {
      handleError(message);
    }
  } catch (error) {
    console.log(error);
  }
  setForm({username: "", email: "", password: ""});
 }
    return(
<div className="container mt-5">
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