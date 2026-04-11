import { useState } from "react"
// import { ServiceCategory } from "./Services/ServiceCategory"
import { ServiceGrid } from "./ServiceGrid"
import { ServicesHero } from "./ServicesHero"
import { useQuery } from "@tanstack/react-query"
import { fetchServices } from "../../API/service.api"
import { LoadingSpinner } from "../../components/LoadingSpinner";
// import srv from "../../API/ServiceGrid.json";
// import { Trending } from "./Services/Trending";


export const Services = () => {

  const {
    data: services = [],
    isPending,
    isError,
    error,
    refetch,

  } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
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

  return <section className=" page-animate bg-bg-main pt-0 min-h-screen px-5">


    <ServicesHero />


    {/* <ServiceCategory
              filter={filter}
             setFilter={setFilter}
          /> */}

    <ServiceGrid services={services}
    />

  </section>
}