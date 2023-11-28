import React, { useState } from "react";
import { useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import NavBar from "./navbar.jsx";
import { Link } from "react-router-dom";
import test from "../img/logo.png";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
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
    autoClose: 1500,
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
       "http://localhost:5000/user/login",
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
   setForm({email: "", password: ""});
  }
    return(
    <div>
    <NavBar />
  <div class="container h-100" style={{marginTop: "100px"}}>
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-lg-12 col-xl-11">
        <div class="card text-black" style={{borderRadius: "25px"}}>
          <div class="card-body p-md-5">
            <div class="row justify-content-center">
              <div class="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                <p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4 text">Login Account</p>
                <form class="mx-1 mx-md-4" onSubmit={onSubmit}>
                  <div class="d-flex flex-row align-items-center mb-4">
                    <i class="fas fa-envelope fa-lg me-3 fa-fw"></i>
                    <div class="form-outline flex-fill mb-0">
                      <label className="form-label fw-bold text" htmlFor="email">Email</label>
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
                  <div class="d-flex flex-row align-items-center mb-4">
                    <i class="fas fa-lock fa-lg me-3 fa-fw"></i>
                    <div class="form-outline flex-fill mb-0">
                      <label className="form-label fw-bold text" htmlFor="password">Password</label>
                      <input
                        className="form-control text"
                        type="password"
                        name="password"
                        value={form.password}
                        placeholder="Enter your password"
                        onChange={(e) => updateForm({ password: e.target.value })}
                      />
                    </div>
                  </div>
                  <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                    <button type="submit" value="login" className="btn btn-dark"><span className="text">Log In</span></button>
                  </div>
                  <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                    <span className="text">
                      Don't have an account? <Link to={"/signup"}>Sign Up</Link>
                    </span>
                  </div>
                </form>
              </div>
              <div class="d-flex justify-content-center col-md-10 col-lg-6 col-xl-7 align-items-center order-1 order-lg-2">
                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                  className="img-fluid" alt="logo"/>
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