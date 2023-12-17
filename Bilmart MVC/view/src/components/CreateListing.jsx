import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/esm/Button.js";
import { ToastContainer, toast } from "react-toastify";
import Spinner from 'react-bootstrap/Spinner';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from "axios";
import NavBar from "./NavBar.jsx";
import deleteIcon from "../img/bin.png";

export default function Create() {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [owner, setOwner] = useState({});
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    postDate: new Date(),
    description: "",
    availability: "Available",
    type: "",
    tags: [],
    typeSpecific: {
      price: "",
      quality: "",
      available: true,
      lendDuration: "",
      IBAN: "",
      weblink: "",
      organizationName: "",
      monetaryTarget: "",
      status: true
    },
    price: "0",
    wishlistCount: 0
  });
  const [tags, setTags] = useState([]);

  function compressImage(inputImage, compressionQuality, callback) {
    var img = new Image();
    // Load the image
    img.src = inputImage;
    // Handle the image onload event
    img.onload = function () {
      // Create a canvas element
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      let reduceRatio = 10000000.0 / (img.width * img.height)
      if(reduceRatio > 1) reduceRatio = 1
      // Set the canvas size to the image size
      canvas.width = img.width * reduceRatio;
      canvas.height = img.height * reduceRatio;     
      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height); 
      // Get the compressed image data as a base64-encoded string
      var compressedImageData = canvas.toDataURL('image/jpeg', 1.0);
      // Pass the compressed image data to the callback function
      callback(compressedImageData);
    };
  }
  async function fetchData(username) { //This function will fetch the user data from the database
    const response = await fetch(`http://localhost:4000/user/username/${username}`);
    if (!response.ok) {
      const message = `An error has occurred: ${response.statusText}`;
      window.alert(message);
      return;
    }
    const user = await response.json();
    if (!user) {
      return;
    }
    setOwner(user);
  }
  useEffect(() => { //This useEffect will check if the user is logged in or not
    const verifyCookie = async () => {
      if (!cookies.userToken) {
        navigate("/login");
      }
      const { data } = await axios.post(
          "http://localhost:4000/user/",
          {},
          { withCredentials: true }
      );
      const { status, user } = data;
      await fetchData(user);
      return status
          ?  setIsUserLoading(false)
          : (removeCookie("userToken"), navigate("/login"));
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);
  const [sources, setSources] = useState([]);

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  function updateSources(value) {
    return setSources((prev) => {
      return [...prev, value];
    });
  }
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
  async function updateTypeSpecific() { //This function will update the typeSpecificItem according to the type of the listing
    if(form.type === "Sale Item"){
      const typeSpecificSale = {
        price: form.typeSpecific.price,
        quality: form.typeSpecific.quality,
        available: form.typeSpecific.available,
      }
      return {...form, typeSpecific: typeSpecificSale};
    }
    else if(form.type === "Borrowal Item"){
      const typeSpecificBorrowal = {
        price: form.typeSpecific.price,
        quality: form.typeSpecific.quality,
        available: form.typeSpecific.available,
        lendDuration: form.typeSpecific.lendDuration,
      }
      return {...form, typeSpecific: typeSpecificBorrowal};
    }
    else if(form.type === "Donation"){
      const typeSpecificDonation = {
        IBAN: form.typeSpecific.IBAN,
        weblink: form.typeSpecific.weblink,
        organizationName: form.typeSpecific.organizationName,
        monetaryTarget: form.typeSpecific.monetaryTarget,
      }
      return {...form, typeSpecific: typeSpecificDonation};
    }
    else if(form.type === "Lost Item"){
      const typeSpecificLost = {
        status: false,
      }
      return {...form, typeSpecific: typeSpecificLost};
    }
    else if(form.type === "Found Item"){
      const typeSpecificFound = {
        status: false,
      }
      return {...form, typeSpecific: typeSpecificFound};
    }
  }
  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();
    setIsUserLoading(true);
    if ((sources.length !== 0 && sources.length <= 5) || (form.type !== "")){
      // When a post request is sent to the create url, we'll add a new record to the database.
      const userID = owner._id;
      const typeSpecificItem = await updateTypeSpecific(); //This function will update the typeSpecificItem according to the type of the listing
      typeSpecificItem.images = sources;
      typeSpecificItem.postOwner = userID; 
      try {
        const { data } = await axios.post('http://localhost:4000/listing', typeSpecificItem, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        console.log(data)
        const { success, message } = data;
        if (success) {
          handleSuccess(message);
          setTimeout(() => {
            navigate("/profile");
          }, 1500);
        } else {
          handleError(message);
        }

      } catch (error) {
        // Handle errors here
        handleError(error.message);
      }
    }
    else {
      if((sources.length === 0 || sources.length > 5) && form.type !== ""){
        toast.error('Please upload 1 to 5 images', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          });
      } else {
        toast.error('Please fill all the missing sections', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          });        
      }
    }
    setIsUserLoading(false);
  }

  // This following section will display the create post form that takes the input from the user.
  return (
    <div style={{backgroundColor: "var(--primary-color)"}}>
    <NavBar />
    <div style={{marginTop: "-30px" }}>
    {isUserLoading ? ( //According to the state of isUserLoading, the page will either display the loading screen or the create post form
      <div style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    ) : (
      <div class="container" style={{width: "100%", height: "100%", marginTop: "5rem"}}>
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-lg-12 col-xl-11">
          <div class="card text-black" style={{backgroundColor: "var(--secondary-color)", width: "100%", height: "100%", borderRadius: "25px"}}>
            <div class="card-body p-md-5">
              <div class="row justify-content-center">
                <div class="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                  <p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4 text" style={{color: "var(--text-color)"}}>Post a new listing</p>
                  <form class="mx-1 mx-md-4" onSubmit={onSubmit}>
                    <div class="d-flex flex-row align-items-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" color="var(--text-color)" width="32" height="32" fill="currentColor" class="bi bi-textarea-t fa-lg me-3 fa-fw" viewBox="0 0 16 16">
                          <path d="M1.5 2.5A1.5 1.5 0 0 1 3 1h10a1.5 1.5 0 0 1 1.5 1.5v3.563a2 2 0 0 1 0 3.874V13.5A1.5 1.5 0 0 1 13 15H3a1.5 1.5 0 0 1-1.5-1.5V9.937a2 2 0 0 1 0-3.874zm1 3.563a2 2 0 0 1 0 3.874V13.5a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V9.937a2 2 0 0 1 0-3.874V2.5A.5.5 0 0 0 13 2H3a.5.5 0 0 0-.5.5v3.563M2 7a1 1 0 1 0 0 2 1 1 0 0 0 0-2m12 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/>
                          <path d="M11.434 4H4.566L4.5 5.994h.386c.21-1.252.612-1.446 2.173-1.495l.343-.011v6.343c0 .537-.116.665-1.049.748V12h3.294v-.421c-.938-.083-1.054-.21-1.054-.748V4.488l.348.01c1.56.05 1.963.244 2.173 1.496h.386z"/>
                        </svg>
                        <div class="form-outline flex-fill mb-0">
                          <label className="form-label fw-bold text" htmlFor="password">Title</label>
                          <input
                            className="form-control text"
                            type="title"
                            name="title"
                            value={form.title}
                            placeholder="Enter title"
                            onChange={(e) => updateForm({ title: e.target.value })}
                          />
                        </div>
                    </div>
                    <div class="d-flex flex-row align-items-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" color="var(--text-color)" width="32" height="32" fill="currentColor" class="bi bi-journal-richtext fa-lg me-3 fa-fw" viewBox="0 0 16 16">
                          <path d="M7.5 3.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m-.861 1.542 1.33.886 1.854-1.855a.25.25 0 0 1 .289-.047L11 4.75V7a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 7v-.5s1.54-1.274 1.639-1.208M5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/>
                          <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2"/>
                          <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z"/>
                        </svg>
                        <div class="form-outline flex-fill mb-0">
                          <label className="form-label fw-bold text" htmlFor="description">Description</label>
                          <input
                            className="form-control text"
                            type="description"
                            name="description"
                            value={form.description}
                            placeholder="Enter description"
                            onChange={(e) => updateForm({ description: e.target.value })}
                          />
                        </div>
                    </div>
                    <div class="d-flex flex-row align-items-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" color="var(--text-color)" width="64" height="64" fill="currentColor" class="bi bi-ui-radios fa-lg me-3 fa-fw" viewBox="0 0 16 16">
                          <path d="M7 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5zM0 12a3 3 0 1 1 6 0 3 3 0 0 1-6 0m7-1.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5zm0-5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5M3 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6m0 4.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
                        </svg>
                        <div className="form-outline flex-fill mb-0">
                            <label className="form-label fw-bold text" htmlFor="password">Type</label>
                            <div>
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="typeOptions"
                                id="saleItem"
                                value="Sale Item"
                                checked={form.type === "Sale Item"}
                                onChange={(e) => updateForm({ type: e.target.value })}
                              />
                              <label htmlFor="saleItem" className="form-check-label text">Sale Item</label>
                            </div>
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="typeOptions"
                                id="borrowalItem"
                                value="Borrowal Item"
                                checked={form.type === "Borrowal Item"}
                                onChange={(e) => updateForm({ type: e.target.value })}
                              />
                              <label htmlFor="borrowalItem" className="form-check-label text">Borrowal Item</label>
                            </div>
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="typeOptions"
                                id="lostItem"
                                value="Lost Item"
                                checked={form.type === "Lost Item"}
                                onChange={(e) => updateForm({ type: e.target.value })}
                              />
                              <label htmlFor="lostItem" className="form-check-label text">Lost Item</label>
                            </div>
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="typeOptions"
                                id="foundItem"
                                value="Found Item"
                                checked={form.type === "Found Item"}
                                onChange={(e) => updateForm({ type: e.target.value })}
                              />
                              <label htmlFor="foundItem" className="form-check-label text">Found Item</label>
                            </div>
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="typeOptions"
                                id="donation"
                                value="Donation"
                                checked={form.type === "Donation"}
                                onChange={(e) => updateForm({ type: e.target.value })}
                              />
                              <label htmlFor="Donation" className="form-check-label text">Donation</label>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex flex-row align-items-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="var(--text-color)" class="bi bi-tags-fill fa-lg me-3 fa-fw" viewBox="0 0 16 16">
                          <path d="M2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586zm3.5 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
                          <path d="M1.293 7.793A1 1 0 0 1 1 7.086V2a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l.043-.043-7.457-7.457z"/>
                        </svg>
                        <div class="form-outline flex-fill mb-0">
                          <label className="form-label fw-bold text" htmlFor="password">Tags</label>
                          <input
                          placeholder="Enter tag, tag"
                          type="text"
                          className="form-control text"
                          id="tags"
                          value={form.tags.join(', ')} // Convert array to string for display
                          onChange={(e) => updateForm({ tags: e.target.value.split(', ') })} // Convert string to array on change
                        />
                        </div>
                    </div>


                    <div class="d-flex flex-row align-items-center mb-4">
                        {form.type ===  "Sale Item" && 
                            <div>
                            <div class="d-flex flex-row align-items-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" color="var(--text-color)" width="32" height="32" fill="currentColor" class="bi bi-cash-stack fa-lg me-3 fa-fw" viewBox="0 0 16 16">
                                  <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
                                  <path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z"/>
                                </svg>
                                <div class="form-outline flex-fill mb-0">
                                  <label className="form-label fw-bold text" htmlFor="password">Price (₺)</label>
                                  <input
                                    placeholder="Enter price"
                                    type="text"
                                    className="form-control text"
                                    id="price"
                                    value={form.typeSpecific.price}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      if (/^\d+(\.\d*)?(\.\d+)?$/.test(inputValue) || inputValue === "") {
                                        updateForm({ price: inputValue });
                                        updateForm({ typeSpecific: { ...form.typeSpecific, price: inputValue } });
                                      }
                                    }}
                                  />
                                </div>
                            </div>
                            <div class="d-flex flex-row align-items-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="var(--text-color)" class="bi bi-patch-check-fill fa-lg me-3 fa-fw" viewBox="0 0 16 16">
                                  <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z"/>
                                </svg>
                                <div class="form-outline flex-fill mb-0">
                                <label className="form-label fw-bold text" htmlFor="quality">Select Item's Condition</label>
                                <Dropdown onSelect={(eventKey) => updateForm({ typeSpecific: { ...form.typeSpecific, quality: eventKey } })}>
                                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                  {form.typeSpecific.quality || "Select Condition"}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item eventKey="Brand New" className="text">Brand New</Dropdown.Item>
                                  <Dropdown.Item eventKey="Used" className="text">Used</Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                              </div>
                            </div>
                            </div>
                        }
                        {form.type ===  "Borrowal Item" &&
                            <div>
                            <div class="d-flex flex-row align-items-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" color="var(--text-color)" width="32" height="32" fill="currentColor" class="bi bi-cash-stack fa-lg me-3 fa-fw" viewBox="0 0 16 16">
                                  <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
                                  <path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z"/>
                                </svg>
                                <div class="form-outline flex-fill mb-0">
                                <label className="form-label fw-bold text" htmlFor="password">Price (₺)</label>
                                <input
                                  placeholder="Enter price"
                                  type="text"
                                  className="form-control text"
                                  id="price"
                                  value={form.typeSpecific.price}
                                  onChange={(e) => {
                                    const inputValue = e.target.value;
                                    if (/^\d+(\.\d*)?(\.\d+)?$/.test(inputValue) || inputValue === "") {
                                      updateForm({ price: inputValue });
                                      updateForm({ typeSpecific: { ...form.typeSpecific, price: inputValue } });
                                    }
                                  }}
                                />
                                </div>
                            </div>
                            <div class="d-flex flex-row align-items-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="var(--text-color)" class="bi bi-patch-check-fill fa-lg me-3 fa-fw" viewBox="0 0 16 16">
                                  <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z"/>
                                </svg>
                                <div class="form-outline flex-fill mb-0">
                                <label className="form-label fw-bold text" htmlFor="quality">Select Item's Condition</label>
                                <Dropdown onSelect={(eventKey) => updateForm({ typeSpecific: { ...form.typeSpecific, quality: eventKey } })}>
                                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                  {form.typeSpecific.quality || "Select Condition"}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item eventKey="Brand New" className="text">Brand New</Dropdown.Item>
                                  <Dropdown.Item eventKey="Used" className="text">Used</Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                              </div>
                            </div>
                            <div class="d-flex flex-row align-items-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="var(--text-color)" class="bi bi-calendar-week fa-lg me-3" viewBox="0 0 16 16">
                                  <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/>
                                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                                </svg>
                                <div class="form-outline flex-fill mb-0">
                                <label className="form-label fw-bold text" htmlFor="password">Lending Duration (days)</label>
                                <input 
                                  placeholder="Enter lending duration" 
                                  type="text" 
                                  className="form-control text" 
                                  id="price" 
                                  value={form.typeSpecific.lendDuration} 
                                  onChange={(e) => {
                                    const inputValue = e.target.value;
                                    if (/^\d+$/.test(inputValue) || inputValue === ""){
                                      updateForm({ typeSpecific: { ...form.typeSpecific, lendDuration: inputValue } });
                                    }
                                  }}
                                />
                                </div>
                            </div>
                            </div>
                        }
                        {form.type ===  "Donation" && 
                            <div>
                              <div class="d-flex flex-row align-items-center mb-4">
                              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="var(--text-color)" class="bi bi-microsoft-teams fa-lg me-3 fa-fw" viewBox="0 0 16 16">
                                <path d="M9.186 4.797a2.42 2.42 0 1 0-2.86-2.448h1.178c.929 0 1.682.753 1.682 1.682zm-4.295 7.738h2.613c.929 0 1.682-.753 1.682-1.682V5.58h2.783a.7.7 0 0 1 .682.716v4.294a4.197 4.197 0 0 1-4.093 4.293c-1.618-.04-3-.99-3.667-2.35Zm10.737-9.372a1.674 1.674 0 1 1-3.349 0 1.674 1.674 0 0 1 3.349 0m-2.238 9.488c-.04 0-.08 0-.12-.002a5.19 5.19 0 0 0 .381-2.07V6.306a1.692 1.692 0 0 0-.15-.725h1.792c.39 0 .707.317.707.707v3.765a2.598 2.598 0 0 1-2.598 2.598h-.013Z"/>
                                <path d="M.682 3.349h6.822c.377 0 .682.305.682.682v6.822a.682.682 0 0 1-.682.682H.682A.682.682 0 0 1 0 10.853V4.03c0-.377.305-.682.682-.682Zm5.206 2.596v-.72h-3.59v.72h1.357V9.66h.87V5.945h1.363Z"/>
                              </svg>                             
                                <div class="form-outline flex-fill mb-0">
                                <label className="form-label fw-bold text" htmlFor="name">Organization Name</label>
                                <input 
                                  placeholder="Enter organization name" 
                                  type="text" 
                                  className="form-control text" 
                                  id="name" 
                                  value={form.typeSpecific.organizationName} 
                                  onChange={(e) => {
                                    updateForm({ typeSpecific: { ...form.typeSpecific, organizationName: e.target.value } });
                                  }}
                                />
                                </div>
                              </div>
                              <div class="d-flex flex-row align-items-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" color="var(--text-color)" width="32" height="32" fill="currentColor" class="bi bi-cash-coin fa-lg me-3 fa-fw" viewBox="0 0 16 16">
                                  <path fill-rule="evenodd" d="M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8m5-4a5 5 0 1 1-10 0 5 5 0 0 1 10 0"/>
                                  <path d="M9.438 11.944c.047.596.518 1.06 1.363 1.116v.44h.375v-.443c.875-.061 1.386-.529 1.386-1.207 0-.618-.39-.936-1.09-1.1l-.296-.07v-1.2c.376.043.614.248.671.532h.658c-.047-.575-.54-1.024-1.329-1.073V8.5h-.375v.45c-.747.073-1.255.522-1.255 1.158 0 .562.378.92 1.007 1.066l.248.061v1.272c-.384-.058-.639-.27-.696-.563h-.668zm1.36-1.354c-.369-.085-.569-.26-.569-.522 0-.294.216-.514.572-.578v1.1h-.003zm.432.746c.449.104.655.272.655.569 0 .339-.257.571-.709.614v-1.195l.054.012z"/>
                                  <path d="M1 0a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.083c.058-.344.145-.678.258-1H3a2 2 0 0 0-2-2V3a2 2 0 0 0 2-2h10a2 2 0 0 0 2 2v3.528c.38.34.717.728 1 1.154V1a1 1 0 0 0-1-1z"/>
                                  <path d="M9.998 5.083 10 5a2 2 0 1 0-3.132 1.65 5.982 5.982 0 0 1 3.13-1.567z"/>
                                </svg>                            
                                <div class="form-outline flex-fill mb-0">
                                <label className="form-label fw-bold text" htmlFor="password">Donation Goal</label>
                                <input 
                                  placeholder="Enter donation goal" 
                                  type="text" 
                                  className="form-control text" 
                                  id="price" 
                                  value={form.typeSpecific.monetaryTarget} 
                                  onChange={(e) => {
                                    const inputValue = e.target.value;
                                    if (/^\d+$/.test(inputValue) || inputValue === ""){
                                      updateForm({ price: inputValue});
                                      updateForm({ typeSpecific: { ...form.typeSpecific, monetaryTarget: inputValue } });
                                    }                                    }
                                  }
                                />
                                </div>
                              </div>
                            <div class="d-flex flex-row align-items-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="var(--text-color)" class="bi bi-bank fa-lg me-3 fa-fw" viewBox="0 0 16 16">
                                  <path d="m8 0 6.61 3h.89a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v7a.5.5 0 0 1 .485.38l.5 2a.498.498 0 0 1-.485.62H.5a.498.498 0 0 1-.485-.62l.5-2A.501.501 0 0 1 1 13V6H.5a.5.5 0 0 1-.5-.5v-2A.5.5 0 0 1 .5 3h.89zM3.777 3h8.447L8 1zM2 6v7h1V6zm2 0v7h2.5V6zm3.5 0v7h1V6zm2 0v7H12V6zM13 6v7h1V6zm2-1V4H1v1zm-.39 9H1.39l-.25 1h13.72l-.25-1Z"/>
                                </svg>                             
                                <div class="form-outline flex-fill mb-0">
                                <label className="form-label fw-bold text" htmlFor="password">IBAN</label>
                                <input 
                                  placeholder="Enter IBAN" 
                                  type="text" 
                                  className="form-control text" 
                                  id="IBAN" 
                                  value={form.typeSpecific.IBAN} 
                                  onChange={(e) => {
                                    const inputValue = e.target.value;
                                    if (/^\d+(\.\d*)?(\.\d+)?$/.test(inputValue) || inputValue === "") {
                                      updateForm({ typeSpecific: { ...form.typeSpecific, IBAN: inputValue } });
                                    }
                                  }}
                                />
                                </div>
                            </div>
                            <div class="d-flex flex-row align-items-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="var(--text-color)" class="bi bi-link-45deg fa-lg me-3 fa-fw" viewBox="0 0 16 16">
                                  <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
                                  <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"/>
                                </svg>                       
                                <div class="form-outline flex-fill mb-0">
                                <label className="form-label fw-bold text" htmlFor="password">Enter a link to your website</label>
                                <input 
                                  placeholder="Enter weblink" 
                                  type="text" 
                                  className="form-control text" 
                                  id="weblink" 
                                  value={form.typeSpecific.weblink} 
                                  onChange={(e) => {
                                    updateForm({ typeSpecific: { ...form.typeSpecific, weblink: e.target.value } });
                                  }}
                                />
                                </div>
                            </div>
                            </div>                        
                        }
                    </div>
                    <div class="d-flex flex-row align-items-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" color="var(--text-color)" height="40" fill="currentColor" class="bi bi-image-fill fa-lg me-3 fa-fw" viewBox="0 0 16 16">
                          <path d="M.002 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2V3zm1 9v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12zm5-6.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0"/>
                      </svg>
                      <div class="form-outline flex-fill mb-0">
                        <label className="form-label fw-bold text" htmlFor="password">Upload Pictures</label>
                        <input
                          className="form-control text"
                          type="file"
                          id="image"
                          accept="image/*"
                          onChange={(e) => {
                          let file = e.target.files[0];
                          let reader = new FileReader();
                          reader.onloadend = function () {
                              compressImage(reader.result, 0.1, (compress) => {
                                  updateSources(compress);
                              })
                              //updateSources(reader.result);
                          }
                          reader.readAsDataURL(file);
                          }}
                        />
                        <div style={{marginTop: "10px"}}>
                          <Button className="text" variant="secondary" onClick={() => {setSources([])}}><span className="text">Clear Selected Pictures</span> <img width={23} height={23} src={deleteIcon}/></Button>
                        </div>
                      </div>
                    </div>
                    <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                      <button type="submit" value="Create Listing" className="btn btn-dark"><span className="text">Post Listing</span></button>
                    </div>
                    <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                      <span className="text">
                          <Button variant="outline-danger" href="/profile">Cancel</Button>
                      </span>
                              </div>
                            </form>
                          </div>
                          <div className="justify-content-center col-md-10 col-lg-6 col-xl-7 align-items-center order-1 order-lg-2">
                            <p className="text-center h2 fw-bold mb-5 mx-1 mx-md-4 mt-4 text" style={{color: "var(--text-color)"}}>Selected Pictures:</p>
                            <div style={{textAlign: "center"}}>{sources.map((source) => {
                              return <img className="centered-and-cropped" width={source.width * (100 / source.height)} height="200" style={{borderRadius: "5%", margin: "10px", maxWidth: "500px"}} src={source} />
                            })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          )}
          <ToastContainer />
        </div>
      </div>
  );
}
