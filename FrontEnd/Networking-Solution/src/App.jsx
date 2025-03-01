import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import Button from "./Components/Button";
import FileItem from "./Components/FileItem";

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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "80vw",
        }}
      >
        <FileItem />
      </div>
    </>
  );
}

export default App;
