import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import PasswordStrengthBar from 'react-password-strength-bar';
import NavBar from "./navbar.jsx";
import signUp from "../img/signup-image.jpg";
import { Link } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import logo from "../img/1.png";


const bilkentMailRegex = /^[\w-\.]+@([\w-]+\.)+bilkent\.edu\.tr$/

export default function SignUp() {
const navigate = useNavigate();
const params = useParams();
 const [form, setForm] = useState({
   newPassword: ""
 });
 const [isUserLoading, setIsUserLoading] = useState(true);
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
 useEffect(() => {
    async function fetchData() {
      setIsUserLoading(false);
    }
 
    fetchData();
 
    return;
  }, [navigate]);
 // This function will handle the submission.
 async function onSubmit(e){
  e.preventDefault();
    try {
      const updatedUser = {
        password: form.password
      }
      console.log(updatedUser);
      const result = await fetch(`http://localhost:4000/user/changePassword/${params.changePasswordToken}`, {
        method: "PATCH",
        body: JSON.stringify(updatedUser),
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const response = await result.json();
      console.log(response);
    if (response.success) {
        handleSuccess(`${response.message}` + " Closing this tab...");
        setTimeout(() => {
          window.close();
        }, 3000);
    } 
    else {
        handleError(`${response.message}`);
        setForm({password: ""});
    }
    } catch (error) {
      handleError(error);
    }    
  //setForm({username: "", email: "", password: ""});
 }
    return(
      <div className="gradient-background-2" style={{position: "fixed", width: "100%", height: "100%"}}>
      <NavBar />
    <div className="container" style={{marginTop: "8rem"}}>
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-lg-12 col-xl-11">
          <div className="card text-black" style={{width: "100%", height: "100%", borderRadius: "25px"}}>
            <div className="card-body p-md-5">
              <div className="row justify-content-center">
                <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                  <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4 text">Change your password <img src={logo} width="220" height="auto" style={{marginTop: "5px", marginBottom: "10px"}}/></p>
                  <form className="mx-1 mx-md-4" onSubmit={onSubmit}>
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
                          placeholder="Enter your new password"
                          onChange={(e) => updateForm({ password: e.target.value })}
                        />
                        {form.password !== "" && <div><PasswordStrengthBar password={form.password} height="200px"/></div>}
                      </div>
                    </div>
                    <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                        <button type="submit" className="btn btn-dark"><span className="text">Change Password</span></button>
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