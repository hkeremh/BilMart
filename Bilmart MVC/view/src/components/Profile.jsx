import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from "react-bootstrap/esm/Col";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";
import LogoBar from "./LogoBar.jsx";
import ItemCard from "./Card.jsx";
import createIcon from "../img/plus.png";
import NavBar from "./navbar.jsx";

function Profile(){
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [profileUser, setProfileUser] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  async function fetchData(username) {
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
    setProfileUser(user);
  }
  useEffect(() => {
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
        ?  console.log(user)
        : (removeCookie("userToken"), navigate("/login"));
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);
  useEffect(()=>{
    async function fetchPosts() {
      const response = await fetch(`http://localhost:4000/listing/userPosts/${profileUser._id}`);
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        toast.error(`${message}`, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          });
        return;
      }
      const userPosts = await response.json();
      setUserPosts(userPosts);  
    }
    fetchPosts();
  });
 
  // This method will delete a record
  async function deleteRecord(id) {
    const newRecords = userPosts.filter((el) => el._id !== id);
    setUserPosts(newRecords);    
    await fetch(`http://localhost:4000/listing/${id}`, {
      method: "DELETE"
    });
  }
 
  // This method will map out the records on the table
  function recordList() {
    return userPosts.map((record) => {
        return <ItemCard record={record} key={record._id} deleteRecord={deleteRecord} onProfile={true} />
    });
  }
  
  return (
    <div>
    <NavBar />
    <div style={{ backgroundColor: "#D6C7AE", marginTop: 15 }}>
    <Container fluid>
        <LogoBar />
        <Container style={{marginTop: "15px"}} fluid>
        <Row>
            <Col lg={3}>
                <Container fluid className="d-flex justify-content-center align-items-center">
                <div className="userInfo">
                  {profileUser.profileImage === "" ? <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="profilePhoto bi bi-person-circle" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                    <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                  </svg> : <img className="profilePhoto" src={profileUser.profilePhoto}/>}
                  <h1>{profileUser.username}</h1>
                  <h4>{profileUser.description || "Description"}</h4>
                  <hr/>
                  <h1>{userPosts.length}</h1>
                  <h3>Posts</h3>
                  <hr/>
                  <Link to={`/create`}><Button className="createListing" variant="secondary" style={{backgroundColor: "#192655"}}><div className="text" style={{fontSize: "20px"}}>New Post <img width={20} height={20} src={createIcon}/></div></Button></Link>
                </div>
                </Container>
            </Col>
            <Col lg={9}>
                <Container fluid>
                <div className="userListings">
                  <Container className="logoBar" fluid>
                    <h1>Posts</h1>
                  </Container>
                  <Container className="profileItems" style={{textAlign: "center"}} fluid>
                    {recordList()}
                  </Container>
                </div>
                </Container>
            </Col>
        </Row>
        </Container>
    </Container>
    </div>
    </div>
  );
};
 export default Profile;