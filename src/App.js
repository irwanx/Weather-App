import React from "react";
import CurrentLocation from "./CurrentLocation";
import "./App.css";

function App() {
  return (
    <React.Fragment>
      <div className="background-image">
        <CurrentLocation />
        <footer className="py-2">
          <p className="text-center text-gray-300 text-sm">Developed & Designed by <strong>Irwanx</strong> || &copy; All Rights Reserved</p>
        </footer>
      </div>
    </React.Fragment>
  );
}

export default App;