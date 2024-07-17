// import React from "react";

// class UserDicusstion extends React.Component {
//   render() {
//     const { name, message, type } = this.props;

//     return (
//       <div className="discussion message-active">
//         <div
//           className="photo"
//           style={{
//             backgroundImage:
//               "url(https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80)"
//           }}
//         >
//           <div className="online"></div>
//         </div>
//         <div className="desc-contact">
//         <p className="name">{name}</p>
//         </div>
//         <div className="status">{type === 0 ? 'people' : 'room' }</div>
//       </div>
//     );
//   }
// }

// export default UserDicusstion;

import React from "react";

class UserDiscussion extends React.Component {
  render() {
    const { name, message, type } = this.props;

    // Check if name is defined and has a length greater than 0
    if (!name || name.length === 0) {
      return null; // or handle this case differently based on your application's logic
    }

    // Get the first character or number from the name
    const firstCharacter = name.charAt(0);

    // Define styles for the initials container
    const initialsStyle = {
      backgroundColor: "#4CAF50", // Custom background color
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      fontSize: "24px",
      fontWeight: "bold",
      color: "#FFFFFF", // Text color
    };

    return (
      <div className="discussion message-active">
        <div className="photo" style={initialsStyle}>
          {firstCharacter}
        </div>
        <div className="desc-contact">
          <p className="name">{name}</p>
        </div>
        <div className="status">{type === 0 ? 'people' : 'room'}</div>
      </div>
    );
  }
}

export default UserDiscussion;
