import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
    const [count, setCount] = useState(0);
    const [data, setData] = useState(null); //useState, when changed will trigger a re-render. We need this to update our dom with new data

    // Fetch example data from the backend
    //useEffect is a hook that runs after the first render of the component
    //ergo, we fetch data after our app has rendered
    useEffect(() => {
        async function fetchData() {
            const response = await fetch("http://localhost:3000/example"); //Need to configure with .env
            const data = await response.json();
            console.log(data);
            setData(data);
        }

        fetchData();
    }, []);

    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img
                        src={reactLogo}
                        className="logo react"
                        alt="React logo"
                    />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.jsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
            <p>
                <strong>Example Data:</strong>
                {data ? ( //If data is not null, display the data
                    <p>
                        {data.message}
                        <br />
                        {data.data}
                    </p>
                ) : (
                    //If data is null, display loading
                    <p>Loading...</p>
                )}
            </p>
        </>
    );
}

export default App;
