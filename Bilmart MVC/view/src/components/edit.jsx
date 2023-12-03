import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/esm/Button.js"; 
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from 'react-toastify';
import NavBar from "./navbar.jsx";

export default function Edit() {
 const [form, setForm] = useState({
   title: "",
   postDate: {},
   description: "",
   availability: "",
   type: "",
   postOwner: 0,
   price: "",
   images: [],
 });
 const [sources, setSources] = useState([]);
 const params = useParams();
 const navigate = useNavigate();

 useEffect(() => {
   async function fetchData() {
     const id = params.id.toString();
     const response = await fetch(`http://localhost:4000/listing/${params.id.toString()}`);

     if (!response.ok) {
       const message = `An error has occurred: ${response.statusText}`;
       window.alert(message);
       return;
     }

     const record = await response.json();
     if (!record) {
      toast.error(`Listing with id ${id} not found`, {
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
     setForm(record);
     setSources(record.images);
   }

   fetchData();

   return;
 }, [params.id, navigate]);

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

 async function onSubmit(e) {
   e.preventDefault();
   console.log(sources);
   const editedListing = {
     title: form.title,
     postDate: form.postDate,
     description: form.description,
     availability: form.availability,
     type: form.type,
     postOwner: form.postOwner,
     price: form.price,
     images: sources
   };
   if ((sources.length !== 0 && sources.length <= 5)){
    // This will send a post request to update the data in the database.
    await fetch(`http://localhost:4000/listing/${params.id}`, {
      method: "PATCH",
      body: JSON.stringify(editedListing),
      headers: {
        'Content-Type': 'application/json'
      },
    });

    navigate("/profile");    
   }
   else{
    toast.error('Please upload 1-5 pictures', {
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

 // This following section will display the form that takes input from the user to update the data.
 return (
  <div>
    <NavBar />
    <div style={{ marginTop: "-30px" }}>
    <div class="container" style={{marginTop: "5rem"}}>
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-lg-12 col-xl-11">
        <div class="card text-black" style={{borderRadius: "25px"}}>
          <div class="card-body p-md-5">
            <div class="row justify-content-center">
              <div class="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                <p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4 text">Edit Listing</p>
                <form class="mx-1 mx-md-4" onSubmit={onSubmit}>
                  <div class="d-flex flex-row align-items-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-lock-fill fa-lg me-3 fa-fw" viewBox="0 0 16 16">
                        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2"/>
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-lock-fill fa-lg me-3 fa-fw" viewBox="0 0 16 16">
                        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2"/>
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="bi bi-lock-fill fa-lg me-3 fa-fw" viewBox="0 0 16 16">
                        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2"/>
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
                      {form.type === "Sale Item" ? <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-lock-fill fa-lg me-3 fa-fw" viewBox="0 0 16 16"><path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2"/></svg> : <span></span>}
                      {form.type === "Borrowal Item" ? <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-lock-fill fa-lg me-3 fa-fw" viewBox="0 0 16 16"><path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2"/></svg> : <span></span>}
                      {form.type === "Donation" ? <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-lock-fill fa-lg me-3 fa-fw" viewBox="0 0 16 16"><path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2"/></svg> : <span></span>}
                      {form.type ===  "Sale Item" && <div className="form-group"><label className="form-label fw-bold text" htmlFor="password">Price</label><input placeholder="Enter price" type="text" className="form-control text" id="price" value={form.price} onChange={(e) => updateForm({ price: e.target.value })}/></div>}
                      {form.type ===  "Borrowal Item" && <div className="form-group"><label className="form-label fw-bold text" htmlFor="password">Price</label><input placeholder="Enter price per day" type="text" className="form-control text" id="price" value={form.price} onChange={(e) => updateForm({ price: e.target.value })}/></div>}
                      {form.type ===  "Donation" && <div className="form-group"><label className="form-label fw-bold text" htmlFor="password">Donation Goal</label><input placeholder="Enter donation goal" type="text" className="form-control text" id="price" value={form.price} onChange={(e) => updateForm({ price: e.target.value })}/></div>}
                  </div>
                  <div class="d-flex flex-row align-items-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-image-fill fa-lg me-3 fa-fw" viewBox="0 0 16 16">
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
                            // compressImage(reader.result, 0.1, (compress) => {
                            //     updatePhoto(compress);
                            // })
                            updateSources(reader.result);
                        }
                        reader.readAsDataURL(file);
                        }}
                      />
                    </div>
                  </div>
                  <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                    <button type="submit" value="Update Listing" className="btn btn-dark"><span className="text">Update Listing</span></button>
                  </div>
                  <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                    {form.availability !== "Available" ? 
                      <button type="submit" value="Mark Available" className="btn btn-success" onClick={(e) => updateForm({ availability: "Available" })}><span className="text">Mark as Available</span></button>
                    : <button type="submit" value="Mark as Sold" className="btn btn-danger" onClick={(e) => updateForm({ availability: "Sold" })}><span className="text">Mark as Sold</span></button>}
                  </div>
                  <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                    <span className="text">
                        <Button variant="outline-danger" href="/profile">Cancel</Button>
                    </span>
                  </div>
                </form>
              </div>
              <div class="justify-content-center col-md-10 col-lg-6 col-xl-7 align-items-center order-1 order-lg-2">
                <p class="text-center h2 fw-bold mb-5 mx-1 mx-md-4 mt-4 text">Selected Pictures:</p>
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
    <ToastContainer />
    </div>
  </div>
 );
}
