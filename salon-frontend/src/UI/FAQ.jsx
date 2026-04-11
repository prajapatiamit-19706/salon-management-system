import { useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { MdOutlineKeyboardArrowUp } from "react-icons/md";

export const FAQ = ({curData}) =>{
    const {id,question,answer} = curData;
    const [isOpen,setIsOpen] = useState(false);
    const handleToggle=(id)=>{
        setIsOpen(!isOpen);
    }
    return <>
           <li key={id} className="border-[0.1px] w-[90%] sm:w-[80%] md:w-[70%] lg:[70%] xl:w-[70%] 2xl:w-[70%] m-auto border-text-body/50 p-5 rounded-2xl">
            <p className= "text-4xl text-primary mb-5 flex justify-between">
                {question}
                <button onClick={handleToggle} className="cursor-pointer ">
                    {isOpen ? <MdOutlineKeyboardArrowUp/> : <MdOutlineKeyboardArrowDown/> }
                
                </button>
            </p>
            {isOpen && (<p className="text-3xl text-gray-600 transition-transform duration-300">
                {answer}
            </p>)}
            
           </li>
      </>
}