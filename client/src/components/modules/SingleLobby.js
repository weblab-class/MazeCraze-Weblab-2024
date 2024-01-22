import React from "react";

const SingleLobby = ({lobby}) => {
    return (
        <div  className="p-10 bg-black text-primary-text">
                    

                    {lobby.playerAmount} <br /> {lobby.lobbyName} <br /> 
        </div>
    )
}
 export default SingleLobby;
