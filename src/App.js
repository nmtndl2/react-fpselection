import React from "react";
import AppRoutes from "./routes/appRoutes";
import "./styles/global.css";
import "./icon/font-awesome/css/all.min.css";

function App() {
  return (
    <div className="App">
      <div className="container">
        <AppRoutes />
      </div>
    </div>
  );
}

export default App;
