import React from "react";

const GameLobby = ({ lobbyId }) => {


  // useEffect(() => {
  //   get(`/api/user`, { userid: props.userId }).then((userObj) => setUser(userObj));
  // }, []);

  return (
    <div className="flex flex-col bg-primary-bg w-full h-full min-h-screen px-4 py-2 font-custom tracking-widest">
      <div className="text-5xl text-primary-text font-bold mb-10">GameLobby</div>
      <div className="flex gap-4 h-96">
        <div className="w-full bg-white">Player Box</div>
        <div className="bg-blue-200 w-full">
          <div className="text-2xl text-primary-text font-bold mb-5 text-center">
            Welcome to Room {lobbyId}
          </div>
          <div className="flex flex-col px-10 text-wrap text-xl ">
            <span className="text-black font-bold">
              User Name:
              <span className="font-medium"> content</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLobby;
