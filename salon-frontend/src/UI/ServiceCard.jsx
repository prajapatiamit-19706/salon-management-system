

export const ServiceCard=({service})=>{
    const {title,body,img_url} = service;
    return <li 
            
              className=" group relative h-[225px] w-[210px] overflow-hidden shadow-custom bg-surface duration-300">
            <div className="w-full p-0">
            <img src={img_url} alt="haircut" className="absolute inset-0 w-full h-full object-cover
                 transition duration-500 group-hover:scale-110 group-hover:rotate-6" />
            </div>
              {/* Black overlay */}
            <div
               className="absolute inset-0 bg-black/0
                 transition duration-500
                 group-hover:bg-black/60"
           />
         <div className="absolute inset-0 flex flex-col justify-end p-5
                 opacity-0 translate-y-4
                 transition duration-1000
                 group-hover:opacity-100 group-hover:translate-y-0">
            <h1 className="text-white text-3xl font-semibold">{title} </h1>
            <p className="text-2xl text-gray-200 mt-3">{body} </p>
        </div>
        
    </li>
}