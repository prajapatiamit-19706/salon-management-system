export const Button=({label,onclick})=>{
    return (
         <button onClick={onclick}
         className="bg-linear-to-r from-purple-800 to-pink-800 px-15 py-5 text-3xl text-white rounded-2xl mt-7 hover:scale-105 hover:transition duration-300 cursor-pointer" >{label} </button>
    )
}






// header{
//     background-color: var(--black);
//     box-shadow: var(--shadow-md);
//     width: 100%;
//     height: 7rem;
//     /* position: fixed; */
//     margin-top: 0;
// }

// .navbar-container{
//    grid-template-columns: .5fr 1fr;
//    align-items: center;
//     height: 7rem;
//     padding: 0 3.2rem;
// }

// nav ul{
//     display: flex;
//     justify-content: flex-end;
//     align-items: center;
//     gap: 3rem;
// }

// .ham-menu{
//     display: none;
// }

// /* media queries */

// @media screen and (max-width:768px) {

   
//      .menu-web{
//         display: none;
//      }

//     .ham-menu{
//         display: inline-block;  
//         text-align: end; 
//          & button{
//             background:none;
//          }
       
//     }
//     .menu{
//         width: 4rem;
//         height: auto;
//         background-color: var(--accent-light);
//         color: #0F1722;
//     }

//      /* .menu-mobile{
//          position: absolute; 
//         top: 10rem;
//         right: 0; 
        
   
//         width: 350px;
//         height: 60vh ;
//         background-color: var(--accent-light);
//         width: 50%;
//         box-shadow: var(--shadow-xl);
//         margin-bottom: 1rem;
//         transition: all 1s;
//     }

//     .menu-mobile ul {
//         position: relative;
//         content: "";
//         display: flex;
//         flex-direction: column;
//         align-items: center;
//         transition: all 1s ease-in;
//          top: 10%;
        
             
//         & li:first-child{
//             margin-top: 1.2rem;

//         }
//         & li:last-child{
//             margin-bottom: 1.2rem;
//             order: 0;
//         }

//     } */
//    /* Base Mobile Menu State (Hidden by default) */
// .menu-mobile {
//     position: absolute; 
//     top: 7rem;
//     right: 0; 
//     width: 50%; /* Or your desired mobile menu width */
//     height: auto;
//     background-color: var(--accent-light);
//     box-shadow: var(--shadow-xl);
//     margin-bottom: 1rem;
//     z-index: 10; /* Ensure it's above other content */

//     /* --- Transition Definition --- */
//     /* Animate 'transform' and 'opacity' over 0.4 seconds with 'ease-out' */
//     transition: transform 0.4s ease-out, opacity 0.4s ease-out;

//     /* Initial Hidden Position (Off-screen to the right) */
//     transform: translateX(100%); 
//     opacity: 0;
//     /* Optional: display: none; can be added for accessibility, 
//        but use transform/opacity for the smooth animation. */
// }

// /* 🟢 Active State (Visible) */
// .menu-mobile.active {
//     /* Move back to its position (right: 0) */
    
//     transform: translateX(0); 
//     opacity: 1; 
// }

// /* 🔴 Inactive State (Optional, but good for clarity) */
// /* This class is already covered by the base .menu-mobile, but defines the end state */
// .menu-mobile.inactive {
//     transform: translateX(100%);
//     opacity: 0;
// }

// /* Your existing list styling */
// .menu-mobile ul {
//     /* ... existing styles for list ... */
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     top: 110%;
//     /* Keep the children animations subtle or remove them */
//       & li:first-child{
//             margin-top: 1.2rem;
// }

//  & li:last-child{
//             margin-bottom: 1.2rem;
//             order: 0;
//         }

// }

// }
