
import { useQuery } from "@tanstack/react-query";
// import staff from "../../API/staff.json";
import { Staff } from "./Staff";
import { fetchStaff } from "../../API/service.api";
import { LoadingSpinner } from "../../components/LoadingSpinner";


export const AllStaff =()=>{

    const {
        data : staffs= [],
        isPending,
        isError,
        error,
        refetch
    } = useQuery({
            queryKey:["staffs"],
            queryFn:fetchStaff,
            staleTime: 5 * 60 * 1000, // cache for 5 minutes   
         })    

          if (isPending) return <LoadingSpinner />;
             if (isError)
               return (
                    <div className="p-4">
                      <p>Error: {error.message}</p>
                      <button onClick={refetch}>Retry</button>
                    </div>
                  );

    return <>
       <section className="bg-bg-main  ">
            <div className="container mx-auto h-full">
                <h1 className="text-center text-4xl text-text-heading font-bold italic mt-10">Meet the Experts Behind Your Style</h1>
                <ul className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:grid-cols-4 mt-15">
                    {
                        staffs.map((stf,index)=>{
                            // const { id,image, name, role, experience, specialties } = stf;
                            return <Staff key={stf.id} staff={stf} index={index} variant="full"/>     //reuse same component by variant

                        })
                    }
                </ul>
            </div>
       </section>
    </>

}