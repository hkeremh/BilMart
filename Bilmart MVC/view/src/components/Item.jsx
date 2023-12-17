import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import axios from "axios";
import Container from "react-bootstrap/esm/Container";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from 'react-toastify';
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Carousel from 'react-bootstrap/Carousel';
import Button from "react-bootstrap/esm/Button";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import ProgressBar from 'react-bootstrap/ProgressBar';
import LogoBar from "./LogoBar";
import NavBar from "./navbar";
import "../CSS/general.css"
import { toggleState2, setToggleState2 } from "./recordList.jsx";

export default function Item() {
 setToggleState2(false);
 console.log("Toggle state 2 in Item: ", toggleState2);
 const navigate = useNavigate();
 const [showModal, setShowModal] = useState(false);
 let reportText = "";
 const handleClose = () => setShowModal(false);
 const handleShow = () => setShowModal(true);
 const [isPostLoading, setIsPostLoading] = useState(true);
 const [isUserLoading, setIsUserLoading] = useState(true);
 const [cookies, removeCookie] = useCookies([]);
 const [owner, setOwner] = useState({});
 const [item, setItem] = useState({
   title: "",
   postDate: {},
   description: "",
   availability: "",
   type: "",
   tags: "",
   postOwner: "",
   images: [],
   tags: [],
   typeSpecific: {},
   wishlistCount: 0,
 });
 const [profileUser, setProfileUser] = useState({
  email: "",
  username: "",
  password: "",
  postList: [],
  settings: {},
  profileImage: "",
  wishList: [],
  description: "",
  rating: 0,
  ratedamount: 0,
  createdAt: ""
 });
 const [userWishlist, setUserWishlist] = useState([]);
 const [itemWishlist, setItemWishlist] = useState([]);
 const [isButtonDisabled, setIsButtonDisabled] = useState(false);
 async function fetchData(username) {
  console.log(params);
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
  setUserWishlist(user.wishList);
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
      ?  setIsUserLoading(false)
      : (removeCookie("userToken"), navigate("/login"));
  };
  verifyCookie();
}, [cookies, navigate, removeCookie]);
 const params = useParams();
 async function fetchUserData(id) {
  const response = await fetch(`http://localhost:4000/user/id/${id}`);
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
  setIsPostLoading(false);
}
 useEffect(() => {
   async function fetchPostData() {
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
       navigate("/home?pageNumber=1");
       return;
     }

     setItem(record);
     setItemWishlist(record.wishlist);
     const userID = record.postOwner;
     fetchUserData(userID);
   }
   fetchPostData();
   return;
 }, [params.id, navigate]);
 
 async function addToWishlist() {
  async function addToWishlist() {
    if (userWishlist.includes(item._id) || itemWishlist.includes(profileUser._id)) {
      toast.error(`Listing is already in wishlist`, {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
      return;
    } else{
      const updatedOwnerWishlist = [...userWishlist, item._id];
      const updatedPostWishlist = [...itemWishlist, profileUser._id]; //works correctly

      const editedUser = {
        email: profileUser.email,
        username: profileUser.username,
        password: profileUser.password,
        postList: profileUser.postList,
        settings: profileUser.settings,
        profileImage: profileUser.profileImage,
        wishList: updatedOwnerWishlist,
        description: profileUser.description,
        rating: profileUser.rating,
        ratedamount: profileUser.ratedamount,
        createdAt: profileUser.createdAt,
        postOwner: owner,
        item: item
      };
      const editedPost = {
          postId: item._id,
          userId: profileUser._id,
          wishlist: updatedPostWishlist,
          wishlistCount: updatedPostWishlist.length
      };
      const edits = {editedUser, editedPost}

      const response = await fetch(`http://localhost:4000/user/wishlist/${profileUser.username}`, {
        method: "PATCH",
        body: JSON.stringify(edits),
        headers: {
          'Content-Type': 'application/json'
        },
      });


      if (!response.ok) {
        const message = `Could not add to wishlist, an error has occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const result = await response.json();
      if (!result) {
        toast.error(`Listing couldn't be added to wishlist`, {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
      } else{
        setUserWishlist(updatedOwnerWishlist);
        setItemWishlist(updatedPostWishlist);
        toast.success(`Listing added to wishlist`, {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          });
      }      
    }
  }

  await addToWishlist();

  return;
 }

 async function requestContact() {
     async function sendRequestContact() {

         const contact = {
             viewingUser: profileUser,
             post: item
         }

         const response = await fetch(`http://localhost:4000/user/request-contact/${profileUser.username}`, {
             method: "POST",
             body: JSON.stringify(contact),
             headers: {
                 'Content-Type': 'application/json'
             },
         });

         if (!response.ok) {
             const message = `Could not add to wishlist, an error has occurred: ${response.statusText}`;
             window.alert(message);
             return;
         }

         const result = await response.json();
         console.log(result);
         if (!result) {
             toast.error(`Email could not be sent due to server issues`, {
                 position: "top-center",
                 autoClose: 1500,
                 hideProgressBar: false,
                 closeOnClick: true,
                 pauseOnHover: true,
                 draggable: true,
                 progress: undefined,
                 theme: "colored",
             });
         } else{
             setIsButtonDisabled(true);
             toast.success(`Email sent`, {
                 position: "top-center",
                 autoClose: 1500,
                 hideProgressBar: false,
                 closeOnClick: true,
                 pauseOnHover: true,
                 draggable: true,
                 progress: undefined,
                 theme: "colored",
             });
         }

     }

     await sendRequestContact();
     return;
 }

 async function removeFromWishlist() {
      async function removeFromWishlist() {
        if (userWishlist.includes(item._id)) {

        const updatedOwnerWishlist = userWishlist.filter((listing) => listing !== item._id);

        let list = itemWishlist;
        if (item.wishlist.includes(profileUser._id)) {
          list = list.filter((userID) => userID !== profileUser._id);
        }
        const updatedPostWishlist = list;

          const editedUser = {
            email: profileUser.email,
            username: profileUser.username,
            password: profileUser.password,
            postList: profileUser.postList,
            settings: profileUser.settings,
            profileImage: profileUser.profileImage,
            wishList: updatedOwnerWishlist,
            description: profileUser.description,
            rating: profileUser.rating,
            ratedamount: profileUser.ratedamount,
            createdAt: profileUser.createdAt
          };

          const editedPost = {
                postId: item._id,
                userId: profileUser._id,
                wishlist: updatedPostWishlist,
                wishlistCount: updatedPostWishlist.length
          }

          const edits = {editedUser, editedPost};

          const response = await fetch(`http://localhost:4000/user/wishlist/${profileUser.username}`, {
            method: "PATCH",
            body: JSON.stringify(edits),
            headers: {
              'Content-Type': 'application/json'
            },
          });

          if (!response.ok) {
            const message = `An error has occurred: ${response.statusText}`;
            window.alert(message);
            return;
          }
          const result = await response.json();
          if (!result) {
            toast.error(`Listing couldn't be removed from wishlist`, {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
          } else{
            setUserWishlist(updatedOwnerWishlist);
            setItemWishlist(updatedPostWishlist);

            toast.success(`Listing removed from wishlist`, {
              position: "top-center",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              });
          }
        } else {
          toast.error(`Listing is not in wishlist`, {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          return;
        }
      }

     await removeFromWishlist();

     return;
 }
 async function callReportPost() {
  async function reportPost() {
    const report = {
      reporter: profileUser,
      reportedPost: item,
      reportReason: reportText
    }
    const response = await fetch(`http://localhost:4000/listing/report/${item._id}`, {
      method: "POST",
      body: JSON.stringify(report),
      headers: {
        'Content-Type': 'application/json'
      },
    });
    if (!response.ok) {
      const message = `An error has occurred: ${response.statusText}`;
      window.alert(message);
      return;
    }
    const result = await response.json();
    if (!result.success) {
      toast.error(`Listing couldn't be reported`, {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      });
      return;
    } else{
      toast.success(`${result.message}`, {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
        return;
    }
  }
  if(showModal){
    await reportPost();
    setShowModal(false);
    return;
  }
  else {
    return;
  }
 }
 function ReportModal() {
  const [localReportText, setLocalReportText] = useState("");
  return (
    <Modal show={showModal} onHide={handleClose} centered>
    <Modal.Header closeButton>
      <Modal.Title>Report Post</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group
          className="mb-3"
          controlId="exampleForm.ControlTextarea1"
        >
          <Form.Label>Please write your reasons for reporting this post</Form.Label>
          <Form.Control as="textarea" value={localReportText} onChange={(e) => setLocalReportText(e.target.value)} rows={3} />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="outline-danger" onClick={handleClose}>
        Cancel
      </Button>
      <Button variant="secondary" onClick={(reportText = localReportText, callReportPost)}>
        Report
      </Button>
    </Modal.Footer>
  </Modal>
  );
}
 function itemPhotos() {
    return item.images.map((source) => {
        return(
        <Carousel.Item>
        <div style={{justifyContent: "center", textAlign: "center"}}>
            <img className="rounded-3" src={source} width={"auto"} height={"520px"} style={{maxWidth: "700px"}}/> 
        </div>
        </Carousel.Item>
        );
    });
 }
 // This following section will display the form that takes input from the user to update the data.
 return (
  <div className="primary-color">
   <NavBar />
   <div>
   {(isPostLoading || isUserLoading) ? (
      <div style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    ) : (
    <Container fluid style={{ marginTop: 15 }}>
      <LogoBar />
      <Container style={{marginTop: "15px"}} fluid>
          <Row>
              <Col xl={7}>
                  <div className="itemCarousel" style={{marginBottom: "20px"}}>
                  <Carousel>
                      {itemPhotos()}
                  </Carousel>
                  </div>
              </Col>
              <Col xl={5}>
                  <Container className="itemCardInfo" fluid>
                    {owner.username !== profileUser.username ? <div style={{display: "flex", alignItems: "center"}}>
                      {item.type === "Donation" && <h1 className="itemPrice" style={{color: "var(--text-color)"}}>{item.typeSpecific.monetaryTarget + "₺ Goal"}</h1>}
                      {(item.type === "Sale Item" || item.type === "Borrowal Item") && <h1 className="itemPrice" style={{color: "var(--text-color)"}}>{item.typeSpecific.price}₺</h1>}
                      {item.type === "Lost Item" && <h1 className="itemPrice" style={{color: "var(--text-color)"}}>Lost Item</h1>}
                      {item.type === "Found Item" && <h1 className="itemPrice" style={{color: "var(--text-color)"}}>Found Item</h1>}
                      {userWishlist.includes(item._id) ? <Button className="primary-accent" variant="secondary" style={{position: "absolute", right: "45px", backgroundColor: "var(--text-color3)"}} onClick={removeFromWishlist}>
                        <div className="text" style={{alignItems: "center"}}>Remove from Wishlist <span><svg style={{marginBottom: "5px"}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bag-heart-fill" viewBox="0 0 16 16">
                            <path d="M11.5 4v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m0 6.993c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132"/>
                          </svg></span>
                        </div>
                      </Button>: <Button className="primary-accent" variant="secondary" style={{position: "absolute", right: "45px", backgroundColor: "var(--text-color3)"}} onClick={addToWishlist}>
                        <div className="text" style={{alignItems: "center"}}>Add to Wishlist <span><svg style={{marginBottom: "5px"}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bag-heart-fill" viewBox="0 0 16 16">
                            <path d="M11.5 4v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m0 6.993c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132"/>
                          </svg></span>
                        </div>
                      </Button>}
                    </div> : <div style={{display: "flex", alignItems: "center"}}>
                      {item.type === "Donation" && <h1 className="itemPrice" style={{color: "var(--text-color)"}}>{item.typeSpecific.monetaryTarget + "₺ Goal"}</h1>}
                      {(item.type === "Sale Item" || item.type === "Borrowal Item") && <h1 className="itemPrice" style={{color: "var(--text-color)"}}>{item.typeSpecific.price}₺</h1>}
                      {item.type === "Lost Item" && <h1 className="itemPrice" style={{color: "var(--text-color)"}}>Lost Item</h1>}
                      {item.type === "Found Item" && <h1 className="itemPrice" style={{color: "var(--text-color)"}}>Found Item</h1>}
                    </div>}
                    <hr style={{border: "1px solid #544C4C", marginTop: "-2px", marginLeft: "15px", marginRight: "15px"}}/>
                    <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                      <h3 style ={{color: "var(--text-color2)"}}>{item.title || "Title"} </h3>
                    </div> 
                    <hr style={{border: "1px solid #544C4C", marginLeft: "15px", marginRight: "15px"}}/>
                    <div className="postDate" style={{alignItems: "center", display: "flex"}}>
                      <h3 style={{fontWeight: "bolder", color: "var(--text-color)"}}>Post Date: </h3>
                      <h3 style={{color: "var(--text-color2)", marginLeft: "10px"}}>{item.postDate.toString().substring(0, 10)}</h3>
                    </div>
                  </Container>
                  <Container className="itemCardUserInfo" fluid style={{marginBottom: "20px"}}>
                    <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                      <div style={{marginRight: "10px"}}>
                      {owner.profileImage === "" ? <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="var(--text-color)" className="itemProfilePhoto bi bi-person-circle" viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                        <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                      </svg> : <img className="itemProfilePhoto" width="150" height="150" style={{borderRadius: "50%"}} src={owner.profileImage}/>}
                      </div>
                      <div className="itemUserInfo" style={{marginLeft: "10px"}}>
                        <h1 style={{color: "var(--text-color3)"}}>{owner.username}</h1>
                        <hr style={{border: "1px solid #544C4C", marginLeft: "15px", marginRight: "15px"}}/>
                        <h5 style={{alignItems: "center", fontWeight: "bold"}}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" fill="currentColor" className="bi bi-person-lines-fill me-3" viewBox="0 0 16 16">
                              <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z"/>
                          </svg>{owner.description || "Title"}
                        </h5>
                      </div>
                    </div>
                    <hr style={{border: "1px solid #544C4C", marginLeft: "15px", marginRight: "15px"}}/>
                    {owner.username !== profileUser.username ? <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                      {item.type === "Donation" ? <h3 className="text">{"IBAN: "+item.typeSpecific.IBAN}</h3> : <Button disabled={isButtonDisabled} variant="secondary" style={{backgroundColor: "var(--text-color3)"}}><div className="text" onClick={requestContact}>Request Contact</div></Button>}
                    </div> : <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                      <Button className="primary-accent" variant="secondary" href="/profile"><div className="text">Go to Profile</div></Button>
                    </div>  }
                  </Container>
              </Col>
          </Row>
          <Row>
              <Col lg={12}>
                  <Container className="itemCardDetails text" fluid>
                  <div>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <h1 style={{fontWeight: "bolder"}}>Details</h1>
                        <p style={{position: "absolute", right: "45px", color: "var(--text-color2)"}}><span className="text" style={{fontWeight: "bold",}}>ID: </span>{item._id}</p>
                    </div>
                    <div style={{alignItems: "center", display: "flex"}}>
                        {item.type !== "Donation" && <h3  style={{color: "var(--text-color)"}}>Condition: </h3>}
                        {(item.type === "Sale Item" || item.type === "Borrowal Item") && <h3 style={{color: "var(--text-color2)", marginLeft: "10px"}}>{item.typeSpecific.quality}</h3>}
                        {(item.type === "Lost Item" || item.type === "Found Item") && <h3 style={{color: "var(--text-color2)", marginLeft: "10px"}}>{item.typeSpecific.status === true ? "Found" : "Still Lost"}</h3>}
                        {item.type === "Donation" && <h3 style={{color: "var(--text-color)"}}>Progress: </h3>}
                        {item.type === "Donation" && <ProgressBar variant="secondary" className="text" style={{marginBottom: "5px", marginLeft: "15px", width: "915px", height: "30px"}} now={item.typeSpecific.monetaryTarget/item.typeSpecific.monetaryTarget*100} label={`${(item.typeSpecific.monetaryTarget/item.typeSpecific.monetaryTarget*100)}% Reached`} animated/>}
                        {owner.username === profileUser.username ? <div></div> : <Button variant="outline-danger" style={{position: "absolute", right: "45px", marginBottom: "15px"}} onClick={handleShow}>Report Post</Button>}
                    </div>
                  </div>
                  <hr style={{border: "1px solid #544C4C", marginLeft: "15px", marginRight: "15px", marginTop: "-1px"}}/>
                  <div style={{marginBottom: "15px"}}>
                    <div style={{display: "flex", alignItems: "center", marginTop: "-10px"}}>
                        <h1 style={{fontWeight: "bolder"}}>Description</h1>
                        {item.type === "Donation" && <p style={{position: "absolute", right: "45px", color: "var(--text-color2)"}}><span className="text" style={{fontWeight: "bold", color: "var(--text-color2)"}}>Website Link: </span>{item.typeSpecific.weblink}</p>}
                    </div>
                    <h3 style={{color: "var(--text-color2)"}}>{item.description}</h3>
                    <div style={{height: "10px"}}></div>
                    <h1 style={{ fontWeight: "bolder" }}>Tags</h1>
                    <h3 style={{color: "var(--text-color2)"}}>{item.tags.join(', ')}</h3>
                    <div style={{ height: "10px" }}></div>
                  </div>
                  {/* <hr style={{border: "1px solid #544C4C", marginLeft: "15px", marginRight: "15px", marginTop: "-1px"}}/>
                  <div style={{marginBottom: "15px"}}>
                    <div style={{display: "flex", alignItems: "center", marginTop: "-10px"}}>
                        <h1 style={{fontWeight: "bolder"}}>Tags</h1>
                        {item.type === "Donation" && <p style={{position: "absolute", right: "45px"}}><span className="text" style={{fontWeight: "bold"}}>Website Link: </span>{item.typeSpecific.weblink}</p>}
                    </div>
                    <h3 >{item.tags}</h3>
                    <div style={{height: "10px"}}></div>
                  </div> */}

                  </Container>
              </Col>
          </Row>
      </Container>
      <ReportModal />
      <ToastContainer />
    </Container>
    )}
   </div>
   </div>
 );
}