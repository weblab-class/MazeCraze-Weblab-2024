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

  // const { loading } = location.monkey;
  // const navigate = useNavigate();
  // useEffect(() => {
  //   if (!props.userId && loading && loading.monkey) {
  //     navigate("/");
  //     // redirect("/");
  //   }
  // }, [loading]);

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
    });
  }, []);
  const handleLeft = (key) => {
    key.preventDefault();
    setLeft(left);
    post("/api/keybinds", { up: up, down: down, left: left, right: right });
  };
  const handleRight = (key) => {
    key.preventDefault();
    setRight(right);
    post("/api/keybinds", { up: up, down: down, left: left, right: right });
  };
  const handleUp = (key) => {
    key.preventDefault();
    console.log("keybind got updated in database", up);
    setUp(up);
    post("/api/keybinds", { up: up, down: down, left: left, right: right });
  };
  const handleDown = (key) => {
    key.preventDefault();
    setDown(down);
    post("/api/keybinds", { up: up, down: down, left: left, right: right });
  };
  const navigate = useNavigate();
  const navigateBack = () => {
    navigate(-1);
  };
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div class="bg-primary-pink h-screen w-full relative flex flex-col justify-center items-center text-primary-text font-custom tracking-widest">
      <div class="h-[35%] w-[20%] absolute top-0 right-0 bg-primary-bg"></div>

      <div class="h-[35%] w-[20%] absolute left-0 bottom-0 bg-primary-bg z-40"></div>
      <div class="h-[15%] flex justify-center items-center text-6xl absolute top-0 w-full text-primary-bg">
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
        <div className=" flex justify-center w-full">KeyBinds</div>

        <div className="flex justify-between flex-col h-[80%]">
          <div className=" w-full">
            <div className="inline h-20 relative inset-y-1/2">Up</div>
            <div className="text-4xl w-20 h-25 inline absolute right-0 rounded-md text-primary-bg text-center">
              <input
                maxLength="1"
                type="text"
                className="text-4xl bg-primary-text w-20 h-20 inline absolute right-0 top-0 rounded-md text-primary-bg text-center"
                value={up}
                onChange={(e) => {
                  setUp(e.target.value);
                }}
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
              <input
                maxLength="1"
                type="text"
                className="text-4xl bg-primary-text w-20 h-20 inline absolute right-0 top-0 rounded-md text-primary-bg text-center"
                value={down}
                onChange={(e) => setUp(e.target.value)}
              ></input>
              <button className="text-lg bg-primary-bg w-20 h-15 inline absolute bottom-0 right-0 rounded-md text-primary-text">
                Submit
              </button>
            </div>
          </div>

          <div className=" w-full">
            <div className="inline h-20 relative inset-y-1/2">Left</div>
            <div className="text-4xl w-20 h-25 inline absolute right-0 rounded-md text-primary-bg text-center">
              <input
                maxLength="1"
                type="text"
                className="text-4xl bg-primary-text w-20 h-20 inline absolute right-0 top-0 rounded-md text-primary-bg text-center"
                value={left}
                onChange={(e) => setUp(e.target.value)}
              ></input>
              <button className="text-lg bg-primary-bg w-20 h-15 inline absolute bottom-0 right-0 rounded-md text-primary-text">
                Submit
              </button>
            </div>
          </div>

          <div className=" w-full">
            <div className="inline h-20 relative inset-y-1/2">Right</div>
            <div className="text-4xl w-20 h-25 inline absolute right-0 rounded-md text-primary-bg text-center">
              <input
                maxLength="1"
                type="text"
                className="text-4xl bg-primary-text w-20 h-20 inline absolute right-0 top-0 rounded-md text-primary-bg text-center"
                value={right}
                onChange={(e) => setUp(e.target.value)}
              ></input>
              <button className="text-lg bg-primary-bg w-20 h-15 inline absolute bottom-0 right-0 rounded-md text-primary-text">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className=" text-primary-block text-6xl z-50 flex justify-center items-center absolute bottom-0 h-[15%] w-full">
        UserName:{" "}
        <input type="text" className="w-1/3 rounded-md bg-primary-bg text-4xl h-[55%] px-2" />
      </div>
    </div>
  );
};

export default Customize;
