import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import Button from "./Components/Button";

function App() {
  return (
    <>
      <div className={"title"}>
        <p className={"special"}> Welcome to </p>
        <h1>
          Bundle, <span className="miamor"> mi amore</span>
        </h1>
      </div>
      <Button>Click Me</Button>
    </>
  );
}

export default App;
