// UserProfileCard.js
import React from "react";

const UserProfile = ({ name, onCallButtonClick }) => {
  return (
    <div className="user-profile-card">
      <h2>{name}</h2>
      <button onClick={onCallButtonClick}>Call</button>
    </div>
  );
};

export default UserProfile; 
