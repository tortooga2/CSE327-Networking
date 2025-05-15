import React, { useState, useEffect } from "react";

const UtcClock = ({ style }) => {
    const [utcDate, setUtcDate] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setUtcDate(new Date());
        }, 1000); // update every second

        return () => clearInterval(interval); // clean up on unmount
    }, []);
    
    const formattedDate = utcDate.toLocaleString("en-US", {
        timeZone: "UTC",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });

    //return <div style={style}>{utcDate.toISOString()}</div>;
    return <div style={style}>{formattedDate} UTC</div>;
};

export default UtcClock;
