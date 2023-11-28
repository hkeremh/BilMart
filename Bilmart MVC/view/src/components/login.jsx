import React, { useState } from "react";
import { useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from 'react-toastify';
import axios from "axios";

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
<div class="container mt-5">
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