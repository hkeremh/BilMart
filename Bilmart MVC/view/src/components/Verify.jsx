import React, { useState } from "react";
import { useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import NavBar from "./NavBar.jsx";
import signUp from "../img/signup-image.jpg";
import { Link } from "react-router-dom";
const bilkentMailRegex = /^[\w-\.]+@([\w-]+\.)+bilkent\.edu\.tr$/

export default function SignUp() {
const navigate = useNavigate();
 const [form, setForm] = useState({
   verificationCode: ""
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
  try {
    const { data } = await axios.post(
      "http://localhost:4000/user/verify",
      {
        ...form,
      },
      { withCredentials: true }
    );
    const { success, message } = data;
    if (success) {
      handleSuccess(message);
      setTimeout(() => {
        navigate("/home?pageNumber=1");
      }, 1500);
    } else {
      handleError(message);
    }
  } catch (error) {
    console.log(error);
  }    
 
 }
    return(
      <div className="gradient-background-2" style={{position: "relative", width: "100%", height: "100vh", overflow: "auto"}}>
      <NavBar />
    <div class="container" style={{marginTop: "8rem"}}>
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-lg-12 col-xl-11">
          <div class="card text-black" style={{width: "100%", height: "100%", borderRadius: "25px"}}>
            <div class="card-body p-md-5">
              <div class="row justify-content-center">
                <div class="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                  <p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4 text">Almost there... </p>
                  <form class="mx-1 mx-md-4" onSubmit={onSubmit}>
                  <div class="d-flex flex-row align-items-center mb-4">
                      <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-info-square-fill" viewBox="0 0 16 16">
                          <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.93 4.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-person-check-fill fa-lg me-3" viewBox="0 0 16 16" style={{marginTop: "40px"}}>
                          <path fill-rule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                          <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                        </svg>
                      </div>
                      <div class="form-outline flex-fill mb-0">
                        <label className="form-label fw-bold text" htmlFor="verification code" style={{color: "black"}}>We have sent a verification code to your email. Please check your inbox.</label>
                        <input
                          className="form-control text"
                          type="verification code"
                          name="verification code"
                          value={form.verificationCode}
                          placeholder="Enter your 6 digit verification code"
                          onChange={(e) => updateForm({ verificationCode: e.target.value })}
                        />
                      </div>
                    </div>
                    <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                      <button type="submit" value="SignUp" className="btn btn-dark"><span className="text">Verify your email</span></button>
                    </div>
                    <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                      <span className="text" style={{color: "black"}}>
                        Already have an account? <Link to={"/login"}>Log In</Link>
                      </span>
                    </div>
                  </form>
                </div>
                <div class="d-flex justify-content-center col-md-10 col-lg-6 col-xl-7 align-items-center order-1 order-lg-2">
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