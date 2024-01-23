import React from "react";

const SingleLobby = ({ lobby }) => {
  return (
    <div className="p-10 text-primary-text">
      Lobby Amount:{lobby.user_ids.length} <br /> LobbyID: {lobby.lobby_id} <br />
    </div>
  );
};
export default SingleLobby;
