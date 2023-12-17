import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from '../img/2.png';
import "../CSS/general.css"

function NavBar(props) {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [disabled, setDisabled] = useState(true);
  const [username, setUsername] = useState(""); 
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.userToken) {
        setDisabled(true);
      }
      const { data } = await axios.post(
        "http://localhost:4000/user/",
        {},
        { withCredentials: true }
      );
      const { status, user } = data;
      return status
        ?  (setDisabled(false), setUsername(user))
        : (removeCookie("userToken"));
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);
  const Logout = () => {
    removeCookie("userToken");
    navigate("/login");
  };
  const ChangeProfilePhoto = () => {
    navigate(`/editprofile/${username}`);
  };
  const Wishlist = () => {
    navigate(`/wishlist/${username}`);
  };
  function searchItem(){
    props.setText(searchText);
    navigate(`/home?pageNumber=1`);
  };
  return (
    <Navbar className="navbar-dark" style={{backgroundColor: "var(--text-color3)"}} expand="lg">
      <Container fluid>
        {disabled === true ? <Navbar.Brand><img src={logo} width={150} height={36}/></Navbar.Brand> : <Navbar.Brand href="/home?pageNumber=1"><img src={logo} width={150} height={36}/></Navbar.Brand>}
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px'}} navbarScroll>
            <Nav.Link href="/about" className="text">About</Nav.Link>
            <Nav.Link href="/home?pageNumber=1" disabled={disabled} className="text">Home</Nav.Link>
            <Nav.Link onClick={Wishlist} disabled={disabled} className="text">Wishlist</Nav.Link>
            <NavDropdown title="Settings" id="navbarScrollingDropdown" disabled={disabled} className="text">
              {/*<NavDropdown.Item href="#action4" className="text">Action</NavDropdown.Item>*/}
              <NavDropdown.Item className="text">
              <a onClick={ChangeProfilePhoto}>Edit Profile</a>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item className="text">
              <a onClick={Logout}>Log out</a>
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="/profile" disabled={disabled} className="text">Profile</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
