import React, {useState, useEffect} from "react";
import {socket} from "../../client-socket";

const Timer = () => {

    const [time, setTime] = useState(30);

    useEffect(() => {
        socket.on("UpdateTimer", (data) => {
            setTime(data.timeLeft);
        });
        return () => (
            socket.off("UpdateTimer")
        );
    },[]);

    return (
        <div className="font-custom tracking-widest text-center text-4xl text-primary-text">
            {time}
        </div>
    );
};

export default Timer;
