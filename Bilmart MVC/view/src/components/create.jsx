import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from 'react-bootstrap/Form';
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import NavBar from "./navbar.jsx";

export default function Create() {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [owner, setOwner] = useState({});
  const [form, setForm] = useState({
    title: "",
    postDate: new Date(),
    description: "",
    availability: "Available",
    type: "",
    price: "",
  });
  async function fetchData(username) {
    const response = await fetch(`http://localhost:4000/user/${username}`);
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
  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
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
        ?  console.log(user)
        : (removeCookie("token"), navigate("/login"));
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

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();
    if ((form.type === "Donation") || (sources.length !== 0 && sources.length <= 5)) {
      // When a post request is sent to the create url, we'll add a new record to the database.
      const userID = owner._id;
      const newItem = { ...form, postOwner: userID, images: sources };
      await fetch("http://localhost:4000/listing", {
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

      setForm({ title: "", postDate: new Date(), description: "", availability: "Available", type: "", price: ""});
      navigate("/");
    }
    else {    
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
      setForm({ title: "", description: "", availability: "Available", type: "", price: ""});
    }
  }

  // This following section will display the form that takes the input from the user.
  return (
    <div>
    <NavBar />
    <div style={{ marginTop: 15 }}>
      <h3>Create New Listing</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={form.title}
            onChange={(e) => updateForm({ title: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            className="form-control"
            id="description"
            value={form.description}
            onChange={(e) => updateForm({ description: e.target.value })}
          />
        </div>
        <div className="form-group">
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
            <label htmlFor="saleItem" className="form-check-label">Sale Item</label>
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
            <label htmlFor="borrowalItem" className="form-check-label">Borrowal Item</label>
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
            <label htmlFor="lostItem" className="form-check-label">Lost Item</label>
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
            <label htmlFor="foundItem" className="form-check-label">Found Item</label>
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
            <label htmlFor="Donation" className="form-check-label">Donation</label>
          </div>
          {form.type ===  "Sale Item" && <div className="form-group"><label htmlFor="price">Price</label><input type="text" className="form-control" id="price" value={form.price} onChange={(e) => updateForm({ price: e.target.value })}/></div>}
          {form.type ===  "Borrowal Item" && <div className="form-group"><label htmlFor="price">Price</label><input type="text" className="form-control" id="price" value={form.price} onChange={(e) => updateForm({ price: e.target.value })}/></div>}
          {form.type ===  "Donation" && <div className="form-group"><label htmlFor="price">Donation Goal</label><input type="text" className="form-control" id="price" value={form.price} onChange={(e) => updateForm({ price: e.target.value })}/></div>}
          {form.type !== "Donation" &&       
          <Form.Group className="mb-3">
          <Form.Label>Upload Pictures</Form.Label>
          <Form.Control
            type="file"
            className="form-control"
            id="image"
            accept="image/x-png,image/jpeg"
            onChange={(e) => {
              let file = e.target.files[0];
              let reader = new FileReader();
              reader.onloadend = function () {
                console.log(reader.result); // This will log the base64 string
                updateSources(reader.result);
              }
              reader.readAsDataURL(file);
            }}
          />
          <h4>Selected Pictures:</h4>
          <div>{sources.map((source) => {
            return <img className="centered-and-cropped" width="100" height="100" style={{borderRadius: "50%"}} src={source} />
          })}
          </div>
        </Form.Group>
        }
        </div>
        <div className="form-group">
          <input
            type="submit"
            value="Create Listing"
            className="btn btn-primary"
          />
        </div>
      </form>
      <ToastContainer />
    </div>
    </div>
  );
}
