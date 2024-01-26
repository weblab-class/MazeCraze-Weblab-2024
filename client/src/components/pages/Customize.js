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
  const [upDisplay, setUpDisplay] = useState("");
  const [downDisplay, setDownDisplay] = useState("");
  const [leftDisplay, setLeftDisplay] = useState("");
  const [rightDisplay, setRightDisplay] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [userName, setUsername] = useState("");
  const [userNameDisplay, setUserNameDisplay] = useState("");

  // const { loading } = location.monkey;
  // const navigate = useNavigate();
  // useEffect(() => {
  //   if (!props.userId && loading && loading.monkey) {
  //     navigate("/");
  //     // redirect("/");
  //   }
  // }, [loading]);
  // useEffect(() => {
  //   window.addEventListener("keydown");

  //   // remove event listener on unmount
  //   return () => {
  //     window.removeEventListener("keydown");
  //   };
  // }, []);

  useEffect(() => {}, [up]);
  useEffect(() => {}, [down]);
  useEffect(() => {}, [left]);
  useEffect(() => {}, [right]);
  useEffect(() => {
    get("/api/user", { userid: userId }).then((user) => {
      console.log("HIIII", user.user.keybinds);
      setUp(user.user.keybinds.up);
      setDown(user.user.keybinds.down);
      setLeft(user.user.keybinds.left);
      setRight(user.user.keybinds.right);
      setUpDisplay(user.user.keybinds.up);
      setDownDisplay(user.user.keybinds.down);
      setLeftDisplay(user.user.keybinds.left);
      setRightDisplay(user.user.keybinds.right);
      setUserNameDisplay(user.user.name);
    });
  }, []);
  const handleLeft = (key) => {
    key.preventDefault();
    setLeft(left);
    setLeftDisplay(left);
    post("/api/keybinds", { up: up, down: down, left: left, right: right });
  };
  const handleRight = (key) => {
    key.preventDefault();
    setRight(right);
    setRightDisplay(right);
    post("/api/keybinds", { up: up, down: down, left: left, right: right });
  };
  const handleUp = (key) => {
    key.preventDefault();
    console.log("keybind got updated in database", up);
    setUp(up);
    setUpDisplay(up);
    post("/api/keybinds", { up: up, down: down, left: left, right: right });
  };
  const handleDown = (key) => {
    // key.preventDefault();
    setDown(down);
    setDownDisplay(down);
    post("/api/keybinds", { up: up, down: down, left: left, right: right });
  };
  const Left = (event) => {
    event.preventDefault();
    if (event.key === "Backspace") {
      setLeft("");
    } else if (
      (event.keyCode >= 65 && event.keyCode <= 90) ||
      (event.keyCode >= 97 && event.keyCode <= 122) ||
      (event.keyCode >= 37 && event.keyCode <= 40)
    ) {
      if (event.key === "ArrowUp") {
        setLeft("↑");
      } else if (event.key === "ArrowDown") {
        setLeft("↓");
      } else if (event.key === "ArrowLeft") {
        setLeft("←");
      } else if (event.key === "ArrowRight") {
        setLeft("→");
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
      (event.keyCode >= 97 && event.keyCode <= 122) ||
      (event.keyCode >= 37 && event.keyCode <= 40)
    ) {
      if (event.key === "ArrowUp") {
        setRight("↑");
      } else if (event.key === "ArrowDown") {
        setRight("↓");
      } else if (event.key === "ArrowLeft") {
        setRight("←");
      } else if (event.key === "ArrowRight") {
        setRight("→");
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
      (event.keyCode >= 97 && event.keyCode <= 122) ||
      (event.keyCode >= 37 && event.keyCode <= 40)
    ) {
      if (event.key === "ArrowUp") {
        setUp("↑");
      } else if (event.key === "ArrowDown") {
        setUp("↓");
      } else if (event.key === "ArrowLeft") {
        setUp("←");
      } else if (event.key === "ArrowRight") {
        setUp("→");
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
      (event.keyCode >= 97 && event.keyCode <= 122) ||
      (event.keyCode >= 37 && event.keyCode <= 40)
    ) {
      if (event.key === "ArrowUp") {
        setDown("↑");
      } else if (event.key === "ArrowDown") {
        setDown("↓");
      } else if (event.key === "ArrowLeft") {
        setDown("←");
      } else if (event.key === "ArrowRight") {
        setDown("→");
      } else {
        setDown(event.key);
      }
    }
  };
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
  const submitUserName = () => {
    setUserNameDisplay(userName);
    post("/api/user", { name: userName });
  };

  return (
    <div class="bg-primary-pink h-screen w-full relative flex flex-col justify-center items-center text-primary-text font-custom tracking-widest">
      <div class="h-[35%] w-[20%] absolute top-0 right-0 bg-primary-bg"></div>

      <div class="h-[35%] w-[20%] absolute left-0 bottom-0 bg-primary-bg z-40"></div>
      <div className="absolute h-full w-full">
        <div className="text-3xl h-20% w-full text-center flex justify-center items-center absolute inset-y-[88%] text-primary-block z-50">
          UserName:{userNameDisplay}
        </div>
        <div className="w-full relative h-full ">
          <input
            type="text"
            className="absolute bottom-1 w-[28%] h-[7%] rounded-md bg-primary-bg text-xl px-2 z-50 inset-x-[30%] font-custom tracking-widest"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <button
            className="absolute bottom-1 inset-x-[60%] h-[7%] w-[10%] bg-primary-bg rounded-md text-m z-50 font-custom tracking-widest"
            onClick={submitUserName}
          >
            Submit Username
          </button>
        </div>
      </div>
      <div class="h-[15%] cursor-pointer flex justify-center items-center text-6xl absolute top-0 w-full text-primary-bg">
        {isHovered ? (
          <IoArrowBackCircleOutline
            onMouseOut={handleMouseLeave}
            size={60}
            onClick={navigateBack}
            className="absolute left-0 z-50"
          />
        ) : (
          <IoArrowBackCircle
            onMouseOver={handleMouseEnter}
            size={60}
            onClick={navigateBack}
            className="absolute left-0 z-50"
          />
        )}
        Customize
      </div>
      <div class="h-[35%] w-[20%] absolute top-0 right-0 bg-primary-bg"></div>

      <div class="h-[35%] w-[20%] absolute left-0 bottom-0 bg-primary-bg z-40"></div>
      <div class="h-[15%] flex justify-center items-center text-6xl absolute top-0 w-full text-primary-bg">
        Customize
      </div>

      <div class="h-[70%] w-[85%] relative bg-primary-block text-4xl px-3 py-2 mb-4 z-40">
        <div className="absolute inset-y-1/2 inset-x-[45%] flex justify-center items-center"></div>
        <div className=" flex justify-center w-full">KeyBinds</div>

        <div className="flex justify-between flex-col h-[80%]">
          <div className=" w-full">
            <div className="inline h-20 relative inset-y-1/2">Up</div>
            <div className="text-4xl w-20 h-25 inline absolute right-0 rounded-md text-primary-bg text-center">
              <div className="text-4xl bg-primary-text w-20 h-20 absolute right-24 top-0 rounded-md text-primary-bg flex justify-center items-center">
                {upDisplay}
              </div>
              <input
                maxLength="1"
                type="text"
                className="text-4xl bg-primary-text w-20 h-20 inline absolute right-0 top-0 rounded-md text-primary-bg text-center"
                value={up}
                onKeyDown={Up}
              ></input>
              <button
                className="text-lg bg-primary-bg w-20 h-15 inline absolute bottom-0 right-0 rounded-md text-primary-text"
                onClick={handleUp}
              >
                Submit
              </button>
            </div>
          </div>

          <div className="w-full">
            <div className="inline h-20 relative inset-y-1/2">Down</div>
            <div className="text-4xl w-20 h-25 inline absolute right-0 rounded-md text-primary-bg text-center">
              <div className="text-4xl bg-primary-text w-20 h-20 absolute right-24 top-0 rounded-md text-primary-bg flex justify-center items-center">
                {downDisplay}
              </div>
              <input
                maxLength="1"
                type="text"
                className="text-4xl bg-primary-text w-20 h-20 inline absolute right-0 top-0 rounded-md text-primary-bg text-center"
                value={down}
                onKeyDown={Down}
              ></input>
              <button
                className="text-lg bg-primary-bg w-20 h-15 inline absolute bottom-0 right-0 rounded-md text-primary-text"
                onClick={handleDown}
              >
                Submit
              </button>
            </div>
          </div>

          <div className=" w-full">
            <div className="inline h-20 relative inset-y-1/2">Left</div>
            <div className="text-4xl w-20 h-25 inline absolute right-0 rounded-md text-primary-bg text-center">
              <div className="text-4xl bg-primary-text w-20 h-20 absolute right-24 top-0 rounded-md text-primary-bg flex justify-center items-center">
                {leftDisplay}
              </div>
              <input
                maxLength="1"
                type="text"
                className="text-4xl bg-primary-text w-20 h-20 inline absolute right-0 top-0 rounded-md text-primary-bg text-center"
                value={left}
                onKeyDown={Left}
              ></input>
              <button
                className="text-lg bg-primary-bg w-20 h-15 inline absolute bottom-0 right-0 rounded-md text-primary-text"
                onClick={handleLeft}
              >
                Submit
              </button>
            </div>
          </div>

          <div className=" w-full">
            <div className="inline h-20 relative inset-y-1/2">Right</div>
            <div className="text-4xl w-20 h-25 inline absolute right-0 rounded-md text-primary-bg text-center">
              <div className="text-4xl bg-primary-text w-20 h-20 absolute right-24 top-0 rounded-md text-primary-bg flex justify-center items-center">
                {rightDisplay}
              </div>
              <input
                maxLength="1"
                type="text"
                className="text-4xl bg-primary-text w-20 h-20 inline absolute right-0 top-0 rounded-md text-primary-bg text-center"
                value={right}
                onKeyDown={Right}
              ></input>
              <button
                className="text-lg bg-primary-bg w-20 h-15 inline absolute bottom-0 right-0 rounded-md text-primary-text"
                onClick={handleRight}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className=" text-primary-block text-6xl z-50 flex justify-center items-center absolute bottom-0 h-[full%] w-full"></div>
    </div>
  );
};

export default Customize;
