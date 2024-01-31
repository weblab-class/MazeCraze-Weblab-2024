import React, { useEffect, useState } from "react";
import { get } from "../../utilities";
import { IoArrowBackCircle } from "react-icons/io5";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
const Leaderboard = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [sortFunction, setSortFunction] = useState(compareCoins);
  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();
  const navigateBack = () => {
    navigate("/");
  };
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  useEffect(() => {
    get("/api/user")
      .then(() => 0)
      .catch(() => {
        navigate("/");
      });
  }, []);
  useEffect(() => {
    get("/api/allusers")
      .then((data) => {
        setAllUsers(data.allUsers);
        console.log("HERE ARE ALL THE USERS", data.allUsers);
      })
      .catch(() => {});
  }, []);
  //SORTING FUNCTIONS
  const compareRounds = (player_one, player_two) => {
    const first = player_one.games_played;
    const second = player_two.games_played;
    return second - first;
  };
  const compareWins = (player_one, player_two) => {
    const first = player_one.games_won;
    const second = player_two.games_won;
    return second - first;
  };
  const compareCoins = (player_one, player_two) => {
    const first = player_one.lifetime_coins;
    const second = player_two.lifetime_coins;
    return second - first;
  };
  const Comparator = [
    { title: "Lifetime Coins", compareFunc: compareCoins },
    { title: "Wins", compareFunc: compareWins },
    { title: "Games Played", compareFunc: compareRounds },
  ];
  return (
    <>
      <div className="font-custom tracking-widest w-full h-screen bg-primary-bg flex flex-col  py-4 px-4">
        <div id="header" className="h-[15%] flex justify-between px-5 items-center ">
          <div className="cursor-pointer bg-primary-bg text-primary-text">
            {isHovered ? (
              <IoArrowBackCircleOutline
                onMouseOut={handleMouseLeave}
                size={60}
                onClick={navigateBack}
              />
            ) : (
              <IoArrowBackCircle onMouseOver={handleMouseEnter} size={60} onClick={navigateBack} />
            )}
          </div>
          <div className="text-primary-text text-5xl">Leaderboard</div>
          <div />
        </div>
        <div className="flex flex-col w-full h-full items-center">
          <div className="cursor-pointer flex justify-between items-center bg-primary-block w-[60%] rounded-xl py-2 px-2 gap-4">
            {Comparator.map((data, i) => {
              return (
                <>
                  <div
                    key={i}
                    onClick={(e) => {
                      e.preventDefault();
                      setSortFunction(data.compareFunc);
                    }}
                    className="w-full bg-primary-bg rounded-xl text-center text-primary-text text-xl py-2 px-2 "
                  >
                    {data.title}
                  </div>
                </>
              );
            })}
          </div>
          <div className="w-[85%] mt-5 rounded-xl bg-primary-block h-full overflow-auto">
            {allUsers
              .sort(sortFunction)
              .splice(0, 10)
              .map((user, i) => {
                <div className="w-full bg-white rounded-xl py-5 px-2">{user.name}</div>;
              })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
