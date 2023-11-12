import React, {useState} from "react";
import bootstrap from "bootstrap";
import Home from "./Home.jsx";
import NavBar from "./Navbar.jsx";
import About from "./About.jsx";
import Wishlist from "./Wishlist.jsx";

 function App(){
    const [curPage, setCurPage] = useState(<Home/>);

    function setScreen(screenInput){
        if(screenInput === "#home"){
            setCurPage(<Home/>);
        } else if(screenInput === "#about"){
            setCurPage(<About/>);
        } else if(screenInput === "#wishlist"){
            setCurPage(<Wishlist/>);
        }
    }

    return(
        <div style={{backgroundColor: "#D6C7AE"}}>
            <NavBar setScreen={setScreen}/>
            <br />
            {curPage}
        </div>
    );
 }

 export default App;