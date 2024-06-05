import React from "react";
import './Discussions.scss'
const Discussions = () => {
    return(
        <>
             <section className="discussions">
            <div className="discussion search">
              <div className="searchbar">
                <i className="fa fa-search" aria-hidden="true"></i>
                <input type="text" placeholder="Search..." />
              </div>
              <div className="buttons">
                <button className="btn-add-member">
                  <i className="fa fa-user-plus" aria-hidden="true"></i>
                </button>
                <button className="btn-add-group">
                  <i className="fa fa-users" aria-hidden="true"></i>
                </button>
              </div>
            </div>
            <div className="discussion message-active">
              <div
                className="photo"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80)"
                }}
              >
                <div className="online"></div>
              </div>
              <div className="desc-contact">
                <p className="name">Megan Leib</p>
                <p className="message">9 pm at the bar if possible 😳</p>
              </div>
              <div className="timer">12 sec</div>
            </div>
       
          </section>
        </>
    )
}

export default Discussions;