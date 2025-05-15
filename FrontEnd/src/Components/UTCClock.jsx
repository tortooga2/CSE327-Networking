import React, { useState, useEffect } from "react";

const UtcClock = ({ style }) => {
    const [utcDate, setUtcDate] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setUtcDate(new Date());
        }, 1000); // update every second

        return () => clearInterval(interval); // clean up on unmount
    }, []);

    return <div style={style}>{utcDate.toISOString()}</div>;
};

export default UtcClock;
