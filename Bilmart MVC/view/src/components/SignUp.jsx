import React, { useState } from "react";
import { useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import PasswordStrengthBar from 'react-password-strength-bar';
import NavBar from "./NavBar.jsx";
import signUp from "../img/signup-image.jpg";
import { Link } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import logo from "../img/1.png";

const bilkentMailRegex = /^[\w-\.]+@([\w-]+\.)+bilkent\.edu\.tr$/

export default function SignUp() {
const navigate = useNavigate();
 const [form, setForm] = useState({
   username: "",
   description: "",
   email: "",
   password: ""
 });
 const handleError = (err) =>
 toast.error(err, {
   position: "top-center",
   autoClose: 3000,
   hideProgressBar: false,
   closeOnClick: true,
   pauseOnHover: true,
   draggable: true,
   progress: undefined,
   theme: "colored",
 });
const handleSuccess = (msg) =>
 toast.success(msg, {
   position: "top-center",
   autoClose: 3000,
   hideProgressBar: false,
   closeOnClick: true,
   pauseOnHover: true,
   draggable: true,
   progress: undefined,
   theme: "colored",
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
  if(bilkentMailRegex.test(form.email)){ //If the email is a Bilkent mail
    try {
      const { data } = await axios.post(
        "http://localhost:4000/user/signup",
        {
          ...form,
        },
        { withCredentials: true }
      );
      const { success, message } = data;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/verify");
        }, 1500);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error);
    }    
  } else{
    handleError("Please enter a Bilkent mail.");
  }
 }
    return( //This is the sign up page
      <div className="gradient-background-2" style={{position: "relative", width: "100%", height: "100vh", overflow: "auto"}}>
      <NavBar />
    <div className="container" style={{marginTop: "4rem"}}>
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-lg-12 col-xl-11">
          <div className="card text-black" style={{width: "100%", height: "100%", borderRadius: "25px"}}>
            <div className="card-body p-md-5">
              <div className="row justify-content-center">
                <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                  <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4 text">Sign up to <img src={logo} width="220" height="auto" style={{marginTop: "5px", marginBottom: "10px"}}/></p>
                  <form className="mx-1 mx-md-4" onSubmit={onSubmit}>
                  <div className="d-flex flex-row align-items-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-person-circle fa-lg me-3 fa-fw" viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                        <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                      </svg>
                      <div className="form-outline flex-fill mb-0">
                        <label className="form-label fw-bold text" htmlFor="username" style={{color: "black"}}>Username</label>
                        <input
                          className="form-control text"
                          type="username"
                          name="username"
                          value={form.username}
                          placeholder="Enter your username"
                          onChange={(e) => updateForm({ username: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="d-flex flex-row align-items-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-person-vcard-fill fa-lg me-3 fa-fw" viewBox="0 0 16 16">
                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm9 1.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 0-1h-4a.5.5 0 0 0-.5.5M9 8a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 0-1h-4A.5.5 0 0 0 9 8m1 2.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 0-1h-3a.5.5 0 0 0-.5.5m-1 2C9 10.567 7.21 9 5 9c-2.086 0-3.8 1.398-3.984 3.181A1 1 0 0 0 2 13h6.96c.026-.163.04-.33.04-.5M7 6a2 2 0 1 0-4 0 2 2 0 0 0 4 0"/>
                      </svg>
                      <div className="form-outline flex-fill mb-0">
                        <label className="form-label fw-bold text" htmlFor="description" style={{color: "black"}}>Title at Bilkent University</label>
                        <Dropdown onSelect={(eventKey) => updateForm({ description: eventKey })}>
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic" className="text">
                          <span className="text">{form.description || "Select Title"}</span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item eventKey="Undergraduate Student" className="text">Undergraduate Student</Dropdown.Item>
                          <Dropdown.Item eventKey="Graduate Student" className="text">Graduate Student</Dropdown.Item>
                          <Dropdown.Item eventKey="Instructor" className="text">Instructor</Dropdown.Item>
                          <Dropdown.Item eventKey="Staff Member" className="text">Staff Member</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                      </div>
                    </div>
                    <div className="d-flex flex-row align-items-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-envelope-at-fill fa-lg me-3 fa-fw" viewBox="0 0 16 16">
                        <path d="M2 2A2 2 0 0 0 .05 3.555L8 8.414l7.95-4.859A2 2 0 0 0 14 2zm-2 9.8V4.698l5.803 3.546L0 11.801Zm6.761-2.97-6.57 4.026A2 2 0 0 0 2 14h6.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586l-1.239-.757ZM16 9.671V4.697l-5.803 3.546.338.208A4.482 4.482 0 0 1 12.5 8c1.414 0 2.675.652 3.5 1.671"/>
                        <path d="M15.834 12.244c0 1.168-.577 2.025-1.587 2.025-.503 0-1.002-.228-1.12-.648h-.043c-.118.416-.543.643-1.015.643-.77 0-1.259-.542-1.259-1.434v-.529c0-.844.481-1.4 1.26-1.4.585 0 .87.333.953.63h.03v-.568h.905v2.19c0 .272.18.42.411.42.315 0 .639-.415.639-1.39v-.118c0-1.277-.95-2.326-2.484-2.326h-.04c-1.582 0-2.64 1.067-2.64 2.724v.157c0 1.867 1.237 2.654 2.57 2.654h.045c.507 0 .935-.07 1.18-.18v.731c-.219.1-.643.175-1.237.175h-.044C10.438 16 9 14.82 9 12.646v-.214C9 10.36 10.421 9 12.485 9h.035c2.12 0 3.314 1.43 3.314 3.034zm-4.04.21v.227c0 .586.227.8.581.8.31 0 .564-.17.564-.743v-.367c0-.516-.275-.708-.572-.708-.346 0-.573.245-.573.791Z"/>
                      </svg>
                      <div className="form-outline flex-fill mb-0">
                        <label className="form-label fw-bold text" htmlFor="email" style={{color: "black"}}>Email</label>
                        <input
                          className="form-control text"
                          type="email"
                          name="email"
                          value={form.email}
                          placeholder="Enter your email"
                          onChange={(e) => updateForm({ email: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="d-flex flex-row align-items-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-lock-fill fa-lg me-3 fa-fw" viewBox="0 0 16 16">
                        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2"/>
                      </svg>
                      <div className="form-outline flex-column flex-fill mb-0">
                        <label className="form-label fw-bold text" htmlFor="password" style={{color: "black"}}>Password</label>
                        <input
                          className="form-control text"
                          type="password"
                          name="password"
                          value={form.password}
                          placeholder="Enter your password"
                          onChange={(e) => updateForm({ password: e.target.value })}
                        />
                        {form.password !== "" && <div><PasswordStrengthBar password={form.password} height="200px"/></div>}
                      </div>
                    </div>                 
                    <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                      <button type="submit" value="SignUp" className="btn btn-dark"><span className="text">Sign Up</span></button>
                    </div>
                    <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                      <span className="text" style={{color: "black"}}>
                        Already have an account? <Link to={"/login"}>Log In</Link>
                      </span>
                    </div>
                  </form>
                </div>
                <div className="d-flex justify-content-center col-md-10 col-lg-6 col-xl-7 align-items-center order-1 order-lg-2">
                <img src={signUp}
                  className="img-fluid" width="300" alt="logo"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  <ToastContainer />
  </div>
    );
}