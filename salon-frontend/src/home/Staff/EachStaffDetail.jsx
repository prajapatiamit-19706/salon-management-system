import { NavLink, useParams } from "react-router-dom"
// import staffData from "../../API/staff.json";
import { FaFacebook, FaInstagram } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import { fetchIndividualStaff } from "../../API/service.api";
import { LoadingSpinner } from "../../components/LoadingSpinner";

export const EachStaffDetail = () => {

  const { id } = useParams();

  console.log("StaffDetails render, id:", id);

  const {
    data: staff,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["staff", id],
    queryFn: () => fetchIndividualStaff(id),
    enabled: !!id,
  });

  console.log("Query state:", { isPending, staff });

  if (isPending) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }


  // const staff = data.find(member => member.id === id);

  const { name, image, role, rating, experience, specialties, gender, bio, availability, socials, phone } = staff;

  //  IMPORTANT SAFETY CHECK
  if (!staff) {
    return (
      <div className="page-animate min-h-screen flex items-center justify-center">
        <p className="text-text-muted text-2l">Staff not found</p>
      </div>
    );
  }
  return <>
    <section className="page-animate py-16">
      <div className="container mx-auto px-5">

        {/* Card */}
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-12 bg-bg-panel rounded-3xl shadow-soft overflow-hidden">

          {/* LEFT IMAGE */}
          <div className=" group relative h-[520px] overflow-hidden">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover group object-top transform-gpu transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* RIGHT DETAILS */}
          <div className="p-10 space-y-6 animate-fade-up">

            {/* BASIC INFO */}
            <div>
              <h1 className="text-4xl font-bold text-text-heading">
                {name}
              </h1>

              <p className="text-lg text-text-muted mt-1">
                {role}
              </p>

              <div className="flex flex-wrap gap-4 mt-4 text-text-body">
                <span className="text-xl">⭐ {rating}</span>
                <span className="text-xl">{experience}+ Years Experience</span>
                <span className="text-xl">{gender}</span>
                {phone && <span className="text-xl">📞 {phone}</span>}
              </div>
            </div>

            {/* ABOUT */}
            <div>
              <h3 className="text-2xl font-semibold text-text-heading">
                About {name}
              </h3>
              <div className="w-56 h-0.5 bg-border-soft my-2" />
              <p className="text-text-body leading-relaxed text-xl">
                {bio}
              </p>
            </div>

            {/* SPECIALTIES */}
            <div>
              <h3 className="text-2xl font-semibold text-text-heading">
                Specialties
              </h3>
              <div className="w-56 h-0.5 bg-border-soft my-2" />

              <div className="flex flex-wrap gap-2 mt-2">
                {specialties.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-[11px] rounded-full bg-bg-soft text-text-body
                transition-all duration-300
               group-hover:bg-primary
               group-hover:text-white
                 group-hover:shadow-soft"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* AVAILABILITY */}
            <div>
              <h3 className="text-2xl font-semibold text-text-heading">
                Availability
              </h3>
              <div className="w-56 h-0.5 bg-border-soft my-2" />
              <p className="text-text-body text-xl">
                {availability.join(" • ")}
              </p>
            </div>

            {/* SOCIALS */}
            {(socials?.facebook || socials?.instagram) && (
              <div>
                <h3 className="text-xl font-semibold text-text-heading">
                  Follow {name}
                </h3>

                <div className="flex gap-5 mt-4">
                  {socials?.facebook && (
                    <NavLink
                      to={socials.facebook}
                      className="bg-bg-soft p-4 rounded-full shadow-soft hover:shadow-medium transition"
                    >
                      <FaFacebook className="size-10 text-text-heading hover:scale-110 transition duration-300" />
                    </NavLink>
                  )}

                  {socials?.instagram && (
                    <NavLink
                      to={socials.instagram}
                      className="bg-bg-soft p-4 rounded-full shadow-soft hover:shadow-medium transition"
                    >
                      <FaInstagram className="size-10 text-text-heading hover:scale-110 transition duration-300" />
                    </NavLink>
                  )}
                </div>
              </div>
            )}
            <div className="mt-10 ">
              <NavLink className=" bg-primary px-4 rounded-2xl py-2" to={`/booking?staff=${staff.id}`}>
                <span className="text-text-invert"> Book With {name} !</span>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </section>

  </>
}