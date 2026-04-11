import { NavLink } from "react-router-dom";

export const ServiceCardMain = ({ service }) => {
   const { id, name, category, description, gender, duration, priceFrom, tags, rating } = service;
   return <li key={id} className={`shadow-custom relative bg-bg-panel border border-bg-soft rounded-2xl hover:outline-0 hover:shadow-[0_0_8px_rgba(59,130,246,0.35),0_0_16px_rgba(168,85,247,0.25)]
                    hover:-translate-y-1 animate-fade-in transition duration-300 h-fit list-none animate-fade-up
                        }`} style={{ animationDelay: `${id * 100}ms` }}>
      <div className="w-full p-0">
         {/* <img src={img_url} alt="haircut" className="w-full h-auto bg-cover" /> */}
      </div>
      <div className="py-5 px-10">

         <h1 className="text-[25px] text-text-heading font-semibold">{name} </h1>
         <p className="text-text-body text-2xl mt-3 mb-2 ">{description} </p>
         <span className="text-end text-xl font-semibold">{gender} </span>
         <div className="mt-2 flex items-end justify-between gap-2">
            <div className="text-xl flex items-center gap-6 mb-3 md:text-sm text-text">
               <p className="font-medium text-2xl text-heading">From ₹{priceFrom}</p>
               <p className="text-[11px] text-muted mt-2">Approx. {duration}mins</p>
            </div>
         </div>
         <div className="flex items-center gap-5 mt-2">


            {tags?.map((tag, index) => (
               <span
                  key={index}
                  className="bg-bg-soft text-primary px-2 py-1 text-[12px] rounded"
               >
                  {tag}
               </span>
            ))}


            <span className="bg-bg-soft text-primary py-2 px-4 text-[12px] rounded">{category} </span>
         </div>
      </div>
      <div className="flex justify-between mb-4 mr-5">
         <h1 className="text-2xl mt-1 ml-10">Rating⭐: {rating} </h1>
         <NavLink to={`/booking?service=${service._id}`}>
            <button className="text-2xl bg-linear-to-tl bg-[#0B3558] py-2 mb-4 px-3 text-white cursor-pointer hover:shadow-glow rounded-2xl">
               Book Now!
            </button>
         </NavLink>
      </div>
   </li>
}