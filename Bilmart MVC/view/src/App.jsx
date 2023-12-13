import React from "react";
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
// We import all the components we need in our app
import Home from "./components/recordList.jsx";
import Edit from "./components/edit.jsx";
import Create from "./components/create.jsx";
import SignUp from "./components/SignUp.jsx";
import Login from "./components/login.jsx";
import Profile from "./components/Profile.jsx";
import EditProfile from "./components/EditProfile.jsx"; 
import About from "./components/About.jsx";
import Item from "./components/Item.jsx";
import Verify from "./components/Verify.jsx"
import Wishlist from "./components/Wishlist.jsx"

const App = () => {
  return (
    <div style={{backgroundColor: "#D6C7AE"}}>
      <div>
      <Routes>
        <Route exact path="/home" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/create" element={<Create />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/editprofile/:username" element={<EditProfile />} />
        <Route path="/about" element={<About />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/item/:id" element={<Item />} />
        <Route path="/wishlist/:username" element={<Wishlist />} />
      </Routes>
      </div>
    </div>
  );
};

export default App;

