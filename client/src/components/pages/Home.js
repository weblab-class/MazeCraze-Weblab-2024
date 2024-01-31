import React from "react";
import Dashboard from "./Dashboard.js";
import SignIn from "./SignIn.js";
const Home = ({ handleLogin, handleLogout, userId, isLoggedIn, setIsLoggedIn }) => {
  return (
    <div>
      {
        //Renders home page if  logged in and login page if logged in
        isLoggedIn ? (
          <Dashboard userId={userId} handleLogout={handleLogout} />
        ) : (
          <SignIn
            userId={userId}
            handleLogin={handleLogin}
            handleLogout={handleLogout}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
          />
        )
      }
    </div>
  );
};

export default Home;
