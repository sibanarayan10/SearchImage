import { useEffect, useState } from "react";
import axios from "axios";

const useApi = (api, method = 'get', requestData = null) => {
  const [response, setResponse] = useState([]);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          method: method, 
          url: api,      
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true, 
          validateStatus:function(status) {
            return status>0;  
          }
        };

        if (method !== 'get' && requestData) {
          config.data = requestData;
        }

        const apiResponse = await axios(config);
        console.log("Api response for :",api,apiResponse);

        if (apiResponse.status === 200) {
          setResponse(apiResponse.data.data || []); 
        } else {
          setError("No data found!"); 
        }
      } catch (err) {
        setError("An error occurred while fetching data.");
        console.error("Error fetching data:", err);
      }
    };

    if (api) {
      fetchData();
      console.log("response after axios fetch in useApi hook:",response);

    }
  }, [api, method]);  

  return { response, error };
};

export default useApi;