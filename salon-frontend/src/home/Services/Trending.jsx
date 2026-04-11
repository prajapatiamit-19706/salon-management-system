// import srv from "../../API/ServiceGrid.json";
import { ServiceCardMain } from "./ServiceCardMain";

export const Trending = ({service=[]}) =>{

   const trendingService = service.filter(service=>service?.rating>=4.5).slice(0,3);

        return <>
        <h1 className="text-center text-4xl font-bold font-serif mt-8"> Trending Services 🔥</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingService.map(service => (
              <ServiceCardMain
              key={service.id}
             service={service} 
             variant="trending"
             />
         ))}
</div>
        </>
}