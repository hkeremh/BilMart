import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/esm/Button.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from 'react-toastify';
import NavBar from "./navbar.jsx";
import compress from "lz-string";

export default function EditProfile() {
    const [form, setForm] = useState({
        email: "",
        password: ""
      });
      function updateForm(value) {
        return setForm((prev) => {
          return { ...prev, ...value };
        });
      }
 const [user, setUser] = useState({
    email: "",
    username: "",
    password: "",
    posts: {},
    settings: {},
    profilePhoto: "",
    wishlist: {},
    description: "",
    rating: 0,
    ratedamount: 0,
    createdAt: ""
 });
 const [photo, setPhoto] = useState("");
 const params = useParams();
 const navigate = useNavigate();
 function compressImage(inputImage, compressionQuality, callback) {
    var img = new Image();
    // Load the image
    img.src = inputImage;
    // Handle the image onload event
    img.onload = function () {
      // Create a canvas element
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      const reduceRatio = 10000000.0 / (img.width * img.height)
      // Set the canvas size to the image size
      canvas.width = img.width * reduceRatio;
      canvas.height = img.height * reduceRatio;
      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      // Get the compressed image data as a base64-encoded string
      var compressedImageData = canvas.toDataURL('image/*', compressionQuality);
      // Pass the compressed image data to the callback function
      callback(compressedImageData);
    };
  }
 useEffect(() => {
   async function fetchData() {
    console.log(params);
     const username = params.username;
     const response = await fetch(`http://localhost:4000/user/username/${username}`);

     if (!response.ok) {
       const message = `An error has occurred: ${response.statusText}`;
       window.alert(message);
       return;
     }

     const record = await response.json();
     if (!record) {
      toast.error(`User with username ${params.username} not found`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
       navigate("/");
       return;
     }
     setUser(record);
     setPhoto(record.profilePhoto);
   }

   fetchData();

   return;
 }, [params.id, navigate]);

 // These methods will update the state properties.
 function updateUser(value) {
   return setUser((prev) => {
     return { ...prev, ...value };
   });
 }

 function updatePhoto(value) {
    setPhoto(value);
 }

 async function onSubmit(e) {
   e.preventDefault();
   console.log(photo);
   const editedUser = {
    email: user.email,
    username: user.username,
    password: user.password,
    posts: user.posts,
    settings: user.settings,
    profilePhoto: photo,
    wishlist: user.wishlist,
    description: user.description,
    rating: user.rating,
    ratedamount: user.ratedamount,
    createdAt: user.createdAt
   };
    // This will send a post request to update the data in the database.
    await fetch(`http://localhost:4000/user/editprofile/${params.username}`, {
      method: "PATCH",
      body: JSON.stringify(editedUser),
      headers: {
        'Content-Type': 'application/json'
      },
    });
    navigate("/profile");    
 }
 return(
    <div>
    <NavBar />
    <div style={{ marginTop: 15 }}>
    <div class="container" style={{marginTop: "5rem"}}>
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-lg-12 col-xl-11">
        <div class="card text-black" style={{borderRadius: "25px"}}>
          <div class="card-body p-md-5">
            <div class="row justify-content-center">
              <div class="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                <p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4 text">Edit your profile</p>
                <form class="mx-1 mx-md-4" onSubmit={onSubmit}>
                  <div class="d-flex flex-row align-items-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-image-fill fa-lg me-3 fa-fw" viewBox="0 0 16 16">
                        <path d="M.002 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2V3zm1 9v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12zm5-6.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0"/>
                    </svg>
                    <div class="form-outline flex-fill mb-0">
                      <label className="form-label fw-bold text" htmlFor="password">Profile Picture</label>
                      <input
                        className="form-control text"
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={(e) => {
                        let file = e.target.files[0];
                        let reader = new FileReader();
                        reader.onloadend = function () {
                            // compressImage(reader.result, 0.1, (compress) => {
                            //     updatePhoto(compress);
                            // })
                            updatePhoto(reader.result);
                        }
                        reader.readAsDataURL(file);
                        }}
                      />
                    </div>
                  </div>
                  <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                    <button type="submit" value="Update Profile" className="btn btn-dark"><span className="text">Update Profile</span></button>
                  </div>
                  <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                    <span className="text">
                        <Button variant="outline-danger" href="/profile">Cancel</Button>
                    </span>
                  </div>
                </form>
              </div>
              <div class="justify-content-center col-md-10 col-lg-6 col-xl-7 align-items-center order-1 order-lg-2">
                <p class="text-center h2 fw-bold mb-5 mx-1 mx-md-4 mt-4 text">Selected Picture:</p>
                <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                    {photo === "" ? <h1></h1> : <img className="centered-and-cropped" width="auto" height="250" style={{borderRadius: "5%", maxWidth: "500px"}} src={photo} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    <ToastContainer />
    </div>
  </div>
 );
}