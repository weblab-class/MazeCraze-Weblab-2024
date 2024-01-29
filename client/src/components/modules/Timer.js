import React, { useState, useEffect } from "react";
import { socket } from "../../client-socket";
import { round_time } from "./constants";
const Timer = () => {
  const [time, setTime] = useState(round_time);

  useEffect(() => {
    socket.on("UpdateTimer", (data) => {
      setTime(data.timeLeft);
    });
    return () =>
      socket.off("UpdateTimer", (data) => {
        setTime(data.timeLeft);
      });
  }, []);

  return <div className="font-custom text-center text-4xl text-primary-text">{time}</div>;
};

export default Timer;
