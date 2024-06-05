
  import React from "react";
  import "font-awesome/css/font-awesome.min.css";
  import "./HomePage.scss";
  import Discussions from "./Discussions";
  import Chat from "./Chat";
import Menu from "./Menu";
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
  
  
