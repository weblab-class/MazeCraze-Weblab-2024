import React, { useEffect, useState } from "react";
import { redirect, useNavigate, useLocation } from "react-router-dom";
import CustomizeBackground from "../../public/images/SettingsBackground.svg";
import { get } from "../../utilities.js";
import { post } from "../../utilities.js";
import { IoArrowBackCircle } from "react-icons/io5";
import { IoArrowBackCircleOutline } from "react-icons/io5";

const Customize = ({ userId }) => {
  const location = useLocation();
  const [up, setUp] = useState("w");
  const [down, setDown] = useState("s");
  const [left, setLeft] = useState("a");
  const [right, setRight] = useState("d");

  const [isHovered, setIsHovered] = useState(false);
  const [userName, setUsername] = useState("");
  const [userData, setUserData] = useState({});

  useEffect(() => {
    get("/api/user")
      .then((user) => {
        setUp(user.user.keybinds.up);
        setDown(user.user.keybinds.down);
        setLeft(user.user.keybinds.left);
        setRight(user.user.keybinds.right);

        setUsername(user.user.name);
        setUserData(user.user);
      })
      .catch(() => {
        navigate("/");
      });
  }, []);

  const handleSave = (event) => {
    post("/api/update_user", { name: userName, up, down, left, right })
      .then(() => {})
      .catch((err) => {
        // console.log("There was an error updating user", err);
      });
    alert("Customization Saved Successfully");
  };

  const Left = (event) => {
    event.preventDefault();
    if (event.key === "Backspace") {
      setLeft("");
    } else if (
      (event.keyCode >= 65 && event.keyCode <= 90) ||
      (event.keyCode >= 97 && event.keyCode <= 122)
    ) {
      if (event.key === "ArrowUp") {
        setLeftDisplay("↑");
        setLeft("ArrowUp");
      } else if (event.key === "ArrowDown") {
        setLeftDisplay("↓");
        setLeft("ArrowDown");
      } else if (event.key === "ArrowLeft") {
        setLeftDisplay("←");
        setLeft("ArrowLeft");
      } else if (event.key === "ArrowRight") {
        setLeftDisplay("→");
        setLeft("ArrowRight");
      } else {
        setLeft(event.key);
      }
    }
  };
  const Right = (event) => {
    event.preventDefault();
    if (event.key === "Backspace") {
      setRight("");
    } else if (
      (event.keyCode >= 65 && event.keyCode <= 90) ||
      (event.keyCode >= 97 && event.keyCode <= 122)
    ) {
      if (event.key === "ArrowUp") {
        setRightDisplay("↑");
        setRight("ArrowUp");
      } else if (event.key === "ArrowDown") {
        setRightDisplay("↓");
        setRight("ArrowDown");
      } else if (event.key === "ArrowLeft") {
        setRightDisplay("←");
        setRight("ArrowLeft");
      } else if (event.key === "ArrowRight") {
        setRightDisplay("→");
        setRight("ArrowRight");
      } else {
        setRight(event.key);
      }
    }
  };
  const Up = (event) => {
    event.preventDefault();
    if (event.key === "Backspace") {
      setUp("");
    } else if (
      (event.keyCode >= 65 && event.keyCode <= 90) ||
      (event.keyCode >= 97 && event.keyCode <= 122)
    ) {
      if (event.key === "ArrowUp") {
        setUpDisplay("↑");
        setUp("ArrowUp");
      } else if (event.key === "ArrowDown") {
        setUpDisplay("↓");
        setUp("ArrowDown");
      } else if (event.key === "ArrowLeft") {
        setUpDisplay("←");
        setUp("ArrowLeft");
      } else if (event.key === "ArrowRight") {
        setUpDisplay("→");
        setUp("ArrowRight");
      } else {
        setUp(event.key);
      }
    }
  };
  const Down = (event) => {
    event.preventDefault();
    if (event.key === "Backspace") {
      setDown("");
    } else if (
      (event.keyCode >= 65 && event.keyCode <= 90) ||
      (event.keyCode >= 97 && event.keyCode <= 122)
    ) {
      if (event.key === "ArrowUp") {
        setDownDisplay("↑");
        setDown("ArrowUp");
      } else if (event.key === "ArrowDown") {
        setDownDisplay("↓");
        setDown("ArrowDown");
      } else if (event.key === "ArrowLeft") {
        setDownDisplay("←");
        setDown("ArrowLeft");
      } else if (event.key === "ArrowRight") {
        setDownDisplay("→");
        setDown("ArrowRight");
      } else {
        setDown(event.key);
      }
    }
  };
  const CustomizeVariables = [
    {
      text: "Up",
      value: up,
      onKeyDown: Up,
    },
    {
      text: "Left",
      value: left,
      onKeyDown: Left,
    },
    {
      text: "Down",
      value: down,
      onKeyDown: Down,
    },
    {
      text: "Right",
      value: right,
      onKeyDown: Right,
    },
  ];

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

  return (
    <div className="bg-primary-pink h-screen w-full relative flex flex-col justify-center items-center text-primary-text font-custom tracking-widest">
      <div className="h-[35%] w-[20%] absolute top-0 right-0 bg-primary-bg"></div>
      <div className="h-[35%] w-[20%] absolute left-0 bottom-0 bg-primary-bg z-40"></div>

      <div className=" px-3 py-2 absolute bottom-2 flex items-center gap-2 z-50">
        <div className="text-2xl lg:text-3xl text-center text-primary-block pointer-">
          Username:
        </div>
        <input
          type="text"
          onChange={(event) => {
            setUsername(event.target.value);
          }}
          className="bg-primary-bg text-xl lg:text-3xl rounded-xl px-4 py-2  border-0 hover:border-4 border-white outline-transparent"
          value={userName}
        />
      </div>

      <div className="h-[15%] flex justify-center items-center text-5xl absolute top-0 w-full text-primary-bg">
        {isHovered ? (
          <IoArrowBackCircleOutline
            onMouseOut={handleMouseLeave}
            size={60}
            onClick={navigateBack}
            className="cursor-pointer absolute left-5 z-50"
          />
        ) : (
          <IoArrowBackCircle
            onMouseOver={handleMouseEnter}
            size={60}
            onClick={navigateBack}
            className="cursor-pointer absolute left-5 z-50"
          />
        )}
        Customize
      </div>
      <div className="h-[35%] w-[20%] absolute top-0 right-0 bg-primary-bg z-20"></div>
      <div className="h-[35%] w-[20%] absolute left-0 bottom-0 bg-primary-bg z-20"></div>
      <div
        onClick={handleSave}
        className="cursor-pointer text-primary-text text-xl flex items-center justify-center rounded-2xl absolute bottom-4 right-4 px-4 py-2 bg-primary-block"
      >
        SAVE
      </div>
      <div className="flex w-full h-[70%] justify-center gap-5 z-40">
        <div
          id="left-section"
          className="flex flex-col items-center h-full w-[35%] bg-primary-block px-3 py-2 rounded-xl"
        >
          <div className="text-2xl lg:text-4xl">KeyBinds</div>
          <div className="flex flex-col items-center w-full h-full overflow-auto  py-2 px-2 gap-2">
            {CustomizeVariables.map((data, i) => {
              return (
                <div key={i} className="flex w-full h-full justify-between items-center">
                  <div className="text-2xl xl:text-3xl mt-4">{data.text}</div>
                  <div className="flex items-end gap-2 text-primary-bg text-sm">
                    <div className="flex flex-col items-center">
                      <input
                        maxLength="1"
                        type="text"
                        className="text-2xl lg:text-3xl border-0 hover:border-2 border-white focus:bg-primary-text bg-primary-text aspect-square w-16 rounded-xl text-center  outline-transparent"
                        value={data.value}
                        onChange={data.onKeyDown}
                        onKeyDown={data.onKeyDown}
                      />{" "}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div id="right_section" className="relative h-full w-[45%] bg-primary-block rounded-xl">
          <div className="flex flex-col items-center justify-start w-full h-full pt-2 pb-4 px-2 overflow-auto">
            <div className="absolute px-2 py-2 bottom-2 right-2 cursor-pointer">
              → See Global Leaderboard
            </div>
            <div className="text-2xl lg:text-4xl text-primary-text "> Statistics</div>
            <div className=" flex w-full h-full justify-around items-center py-2">
              <div className="flex flex-col w-[50%] justify-center items-center gap-2">
                <div className="glow text-4xl xl:text-5xl  text-center font-extrabold ">
                  {userData.games_played}
                </div>
                <div className="text-center text-xl">
                  Games <br /> Played
                </div>
              </div>
              <div className="w-1 h-full bg-primary-bg rounded-full" />
              <div className="flex flex-col w-[50%] justify-center items-center gap-2 ml-2">
                <div className="glow  text-4xl xl:text-5xl   text-center  font-extrabold drop-shadow-2xl text-clip">
                  {userData.lifetime_coins}
                </div>
                <div className="text-center text-xl">
                  Lifetime <br /> Coins
                </div>
              </div>
            </div>
            <div className="h-2 bg-primary-bg w-full mt-2 rounded-full" />
            <div className="flex w-full h-full justify-around items-center px-16 py-2">
              <div className="flex flex-col justify-center items-center gap-2">
                <div className="glow text-4xl xl:text-5xl  text-center font-extrabold drop-shadow-2xl ">
                  {userData.games_won}
                </div>
                <div className="text-center text-xl">Wins</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customize;
