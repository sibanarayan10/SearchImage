import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './Components/SignUp';
import Login from './Components/Login';
import Navbar from './Components/Navbar';
import RecentlySearched from './Components/RecentlySearched';
import Upload from './Components/Upload';
import Home from './Components/Home';
import ErrorPage from './Components/ErrorPage';
import useApi from './Hooks/useApi';
import About from './Components/About';
import { useState } from 'react';
import axios from 'axios'

const App = () => {
  
  

  // const [searchResponse,setResponse]=useState([]);
//   const handleSearch=async()=>{
//   const searchData=await axios.get("http://localhost:3000/api/user/getImages",{
//     withCredentials:true,
//     validateStatus:function(status){
//       return status>0;
//     },
//     headers: {
//       'Content-Type': 'application/json'
//     },
//   })
//   if(searchData.status==200){
//    setResponse(searchData.data);
//   }
// }
const { response, error: responseError } = useApi("http://localhost:3000/api/image/getAll","get");
  const [data1,setData]=useState([]);
  // setData(response);
  // console.log("http://localhost:3000/api/image/getAll :",data1)
  const data=useApi("http://localhost:3000/api/user/images");
 console.log("in the entry page",data1);


 
// console.log(upload)
  return (
    <Router>
      <Navbar setResponse={setData} />
      <Routes>
        <Route path='/' element={<Home data={data1.length==0?response:data1 } DeleteAndEdit={false} />} />
        {/* <Route path='/search' element={<Home data={responses.length>0?responses:response} />} /> */}
        <Route path="/sign-up" element={<SignUp/>} />
        <Route path="/sign-in" element={<Login/>} />
        <Route path="/upload" element={<Upload/>} />
<Route path="recent" element={<RecentlySearched/>}/>
        <Route path="/uploads" element={<Home data={data.response} DeleteAndEdit={true}/>} />
        <Route path="/About" element={<About/>}/>
        <Route path='/error' element={<ErrorPage/>}/>
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