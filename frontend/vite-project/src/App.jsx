import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './Components/SignUp';
import Login from './Components/Login';
import Navbar from './Components/Navbar';
import Upload from './Components/Upload';
import Home from './Components/Home';
import useApi from './Hooks/useApi';
import { useState } from 'react';
import axios from 'axios'

const App = () => {
  
  const { response, error: responseError } = useApi("http://localhost:3000/api/image/getAll", "get");
  const [responses, setResponse] = useState([]);
 
  const data=useApi("http://localhost:3000/api/user/getImages");
 console.log(responses);
 console.log(responses.length);


 
// console.log(upload)
  return (
    <Router>
      <Navbar setResponse={setResponse} />
      <Routes>
        <Route path='/' element={<Home data={ response } />} />
        <Route path='/search' element={<Home data={responses.length>0?responses:response} />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<Login />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/uploads" element={<Home data={data.response} />} />
      </Routes>
    </Router>
  );
};

export default App;



 // const[upload,setUpload]=useState([]);
  // const handleApi=async()=>{
// const data=await axios.get("http://localhost:3000/api/user/getImages",{
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   withCredentials: true, 
//   validateStatus:function(status) {
//     return status>0;  
//   }
// })
// if(data.status==200){
// setUpload(data.data.data);
  
// }

//   }
//   handleApi();
// console.log(upload)

{/* {responseError || uploadError ? (
        <div className="error-message">
          {responseError || uploadError}
        </div>
      ) : null} */}