import SRQ from "../../API/services.json";
import WCU from "../../API/whyChooseUs.json";
import Faq from "../../API/FAQ.json";
import { FAQ } from "../../UI/FAQ";
import { ServiceCard } from "../../UI/ServiceCard";
import { Steps } from "../../UI/Step";
import { WhyChooseUS } from "../../UI/WhyChooseUs";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { GalleryPreview } from "../gallery/GalleryPreview";
import { ReelsSection } from "../../components/ReelsSection";
import { Carousel } from "./carousel";
import { FaArrowRightLong } from "react-icons/fa6";
import FadeUp from "../../components/FadeUp";

export const Landing = () => {

  const [data, setData] = useState([]);

  useEffect(() => {
    setData(Faq);
  }, [])

  return (<>
    <div className="animate-fade-up">
      <Carousel />
    </div>

    <main className="font-sans">
      {/* <div className="bg-linear-to-r to-white from-10% from-black/50 to-50%"> */}
      <div className=" container mx-auto px-5 md:px-1 lg:px-0">
        <ReelsSection />
      </div>
      {/* </div>                 */}
      <section className="relative w-full m-0 p-0 py-24 overflow-hidden">
        <div
          className="
                    absolute inset-0
                     bg-[url('/bg.jpg')]
                 bg-cover bg-center
                 bg-scroll md:bg-fixed
                "
        />
        <div
          className="absolute inset-0 bg-black/50
                 transition duration-500"

        />
        <div className="relative">

          {/* section heading*/}
          <h1 className="text-4xl text-center mb-12 gradient text-text-invert font-serif font-semibold">
            Our salon's Best services
          </h1>

          {/* services preview card */}
          <div className="flex justify-center items-center flex-col">

            <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {SRQ.map((service, index) => (
                <FadeUp delay={index * 0.1}>
                  <ServiceCard service={service} key={service.id} />
                </FadeUp>
              ))}
            </ul>

            <div className="flex justify-center mt-16">
              <NavLink
                to="/services"
                className="
                                  group inline-flex items-center gap-3
                                  text-text-invert! font-medium
                                  cursor-pointer
                                  transition-all duration-300
                                  hover:text-primary!
                                "
              >
                <span className="text-3xl font-bold font-serif group-hover:scale-95 transition duration-300 ">
                  SHOW ALL SERVICES
                </span>

                <FaArrowRightLong
                  className="
                                   text-2xl
                                    transition-transform duration-300
                                    group-hover:translate-x-4
                                  "
                />
              </NavLink>
            </div>

          </div>
        </div>
      </section>

      <section className="bg-bg-main py-24">
        <div className="container mx-auto px-6">
          <FadeUp>
            <GalleryPreview />
          </FadeUp>
        </div>
      </section>


      <section className="bg-bg-main">
        <FadeUp>
          <div className="container mx-auto px-6">

            <div className=" bg-bg-soft rounded-3xl h-auto shadow-custom py-10 mt-20">
              <div>
                <h1 className="text-5xl text-center pt-7 gradient text-text-heading font-semibold">Ready to Book Your Salon Appointment?</h1>
                <p className="text-3xl text-text-body text-center px-25 pt-12  ">Join thousands of satisfied customers who book their beauty services through Glow & Grace</p>
                <div className="flex justify-center items-center mt-7">
                  <NavLink to={"/booking"}>
                    <button className="bg-linear-to-r from-primary to-primary-soft px-15 py-5 text-3xl text-white font-bold rounded-2xl mt-7 hover:scale-x-110 hover:transition duration-300 cursor-pointer" >Book Your Appointment Now!</button>
                  </NavLink>
                  {/* <Button label="Book Salon Appointment Now"/> */}
                </div>
                <p className="text-center mt-10 text-2xl text-text-muted">
                  <span className="hover:text-primary-soft">
                    Easy booking {" "}
                  </span>
                  <span className="hover:text-primary-soft">
                    • Best salons  {" "}
                  </span>
                  <span className="hover:text-primary-soft">
                    • Real-time availability {" "}
                  </span>
                  <span className="hover:text-primary-soft">
                    • Secure payments {" "}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </FadeUp>
      </section>
    </main>
  </>);
}