import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import Navbar from "./Components/Navbar";
import Upload from "./Components/Upload";
import Gallery from "./Components/Gallery";
import useApi from "./Hooks/useApi";
import About from "./Components/About";
import { useState } from "react";
import CustomAlert from "./Components/CustomAlert";
import ScrollingText from "./Components/ScrollingText";

const App = () => {
  const [logout, setLogout] = useState(false);
  const { response } = useApi(
    `${import.meta.env.VITE_API_URL}/api/image/getAll`,
    "get"
  );
  console.log(response);
  const { response: data } = useApi(
    `${import.meta.env.VITE_API_URL}/user/images`
  );

  const [data1, setData] = useState([]);

  return (
    <div className="bg-[#0C1521]  h-screen">
      <Router>
        <ScrollingText />

        <Navbar setResponse={setData} setLogout={setLogout} />
        <Routes>
          {response && (
            <Route
              path="/"
              element={<Gallery data={response.data} DeleteAndEdit={false} />}
            />
          )}
          <Route path="/:search" element={<Gallery data={data1} />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
