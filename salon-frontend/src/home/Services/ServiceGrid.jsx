import { useState } from "react";
import { ServiceCardMain } from "./ServiceCardMain";
import { ServiceCategory } from "./ServiceCategory";
// import staff from "../../API/staff.json";
import { Staff } from "../Staff/Staff";
import { FaArrowRightLong } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import FadeUp from "../../components/FadeUp";
import { fetchStaff } from "../../API/service.api";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { ReviewCarousel } from "../../components/ReviewCarousel/ReviewCarousel";

const normalizeCategory = (category) =>
  category
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9 ]/g, "")
    .trim()
    .replace(/\s+/g, "-");


export const ServiceGrid = ({ services }) => {

  const [filtered, setFiltered] = useState("all");

  const {
    data: staffs = [],
    isPending,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ["staffs"],
    queryFn: fetchStaff,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes   
  })




  /*  filter services properly */
  const filteredCategory = services.filter((eachService) => {
    if (filtered === "all") return true;
    return normalizeCategory(eachService.category) === filtered;
  });

  const filteredStaff = staffs.filter(member => member.rating >= 4.7)


  if (isPending) return <LoadingSpinner />;
  if (isError)
    return (
      <div className="p-4">
        <p>Error: {error.message}</p>
        <button onClick={refetch}>Retry</button>
      </div>
    );

  return (<>

    {/* staff member preview  */}
    <div className="bg-bg-panel page-animate relative bg-linear-to-r from-white from-60% to-primary-soft to-50% flex shadow-soft mt-10">
      <h1 className="absolute right-[45%] mt-10 text-4xl font-bold 
                italic text-text-heading">Meet Our Expertise</h1>
      <NavLink to={"/staffs"} className="" >
        <span className="absolute group inline-flex items-center gap-2 bottom-4   right-5 md:right-[10%] mt-10 text-3xl 
               font-bold italic  text-text-invert transition-all duration-300 
                                ">Show All
          <FaArrowRightLong className="group-hover:translate-x-3 transition-all duration-300" />

        </span>
      </NavLink>

      <ul className="flex container mx-auto
               overflow-x-auto 
              gap-10 py-30  px-6 pb-20
              /* Hide scrollbar for Chrome/Safari/Firefox */
              scrollbar-hide 
               /* Snap Scroll logic */
               snap-x 
              snap-mandatory
              /* Mobile: 2 cards shown | Desktop: Grid */
                flex-nowrap 
               lg:grid lg:grid-cols-4 lg:overflow-visible ">

        {
          filteredStaff.map((stf) => {
            return <Staff key={stf.id} staff={stf} variant="preview" />
          })

        }

      </ul>
    </div>


    {/* Title */}
    <h1 className="text-5xl font-bold font-serif mt-12 text-center text-gray-700 mb-12">
      Explore Our Beauty Services
    </h1>

    <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
      {/* LEFT SIDE – CATEGORY */}
      <aside className="lg:col-span-1 lg:sticky lg:top-24 h-fit">
        <ServiceCategory
          filter={filtered}
          setFilter={setFiltered}
        />

      </aside>

      {/* RIGHT SIDE – SERVICES */}
      <section className="flex  lg:col-span-3">
        <ul key={filtered} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
          {filteredCategory.map((service) => (
            <FadeUp>
              <ServiceCardMain
                key={service.id}
                service={service}
              />
            </FadeUp>
          ))}
        </ul>
      </section>
    </div>

    {/* Client Reviews */}
    <ReviewCarousel />
  </>
  );

}


