import React from "react";
import './Discussions.scss'
import UserDicusstion from "./UserDicusstion";
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
         {/* <UserDicusstion/>
        */}
          </section>
        </>
    )
}

export default Discussions;