
  import React from "react";
  import "font-awesome/css/font-awesome.min.css";
  import "./HomePage.scss";
  import Discussions from "../Discussions/Discussions";
  import Chat from "../Chat/Chat";
import Menu from "../Menu/Menu";
  const HomePage = () => {
    return (
      <div className="container">
        <div className="row">
          
          <Menu/>
          <Discussions/>
         <Chat/>
         
        </div>
      </div>
    );
  };

  export default HomePage;
  
  
