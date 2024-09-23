import React from "react";
/**
 * for each element over the response I gonna populate the Image component multiple times
 * taking the props from the app.jsx
 * making a div in Image component in which we are going to handle max-image file over a row and over a col
 * adding infinite scroll concept to the project
 * 
 */
const Image=(props)=>{

return(<>

<img src={props.src} alt="" />
</>)
}
export default Image;