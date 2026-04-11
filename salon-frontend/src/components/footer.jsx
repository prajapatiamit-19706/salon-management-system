import { NavLink } from "react-router-dom";
import FTR from "../API/footer.json";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { BiSolidCopyright } from "react-icons/bi";

export const Footer = () => {
    return (
        <>

            <section className=" w-full bg-linear-to-r  from-primary to-primary-soft  shadow-custom py-18 px-25 mt-20">

                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-20">
                    <div className="flex items-start flex-col">
                        <div className="flex sm:flex md:flex xl:flex 2xl:flex lg:flex-col">
                            <div className="flex items-center justify-center size-25 rounded-full bg-blue-700">
                                <h1 className="  text-white text-3xl "> GG</h1>
                            </div>
                            <div className="ml-4 mt-3">
                                <h1 className="text-white font-bold text-4xl">Glow & Grace</h1>
                                <h1 className="text-gray-300 text-[12px] mt-1"> book your first appointment now</h1>
                            </div>
                        </div>
                        <div className="mt-3 ml-2">
                            <h1 className="text-gray-100 text-[16px]"> <span className="font-bold text-white"> Glow & Grace </span>online platform for salon and beauty service bookings. Book <span className="font-bold text-white"> haircuts, facials, spa treatments, and grooming services </span> with top-rated professionals.</h1>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-4xl text-white font-semibold mb-4">Salon Service</h1>
                        <hr className="text-text-muted" />

                        <ul>
                            {
                                FTR.map((curEle) => {
                                    return <li key={curEle.id}>
                                        <NavLink to={"/services"}>

                                            <div className="flex group ">
                                                <span className="group-hover:translate-x-3 transition-all duration-300">
                                                    <MdKeyboardArrowRight className="size-10 text-gray-300 mt-5" />
                                                </span>
                                                <p className="text-gray-300 text-[15px] mt-5 group-hover:text-white group-hover:cursor-pointer">{curEle.service} </p>
                                            </div>
                                        </NavLink>
                                    </li>
                                })
                            }
                        </ul>
                    </div>
                    <div>
                        <h1 className="text-4xl text-white font-semibold mb-4">Menu</h1>
                        <hr className="text-text-muted" />

                        <ul>
                            <li>
                                <NavLink to={"/"}>

                                    <div className="flex group ">
                                        <span className="group-hover:translate-x-3 transition-all duration-300">
                                            <MdKeyboardArrowRight className="size-10 text-gray-300 mt-5" />
                                        </span>
                                        <p className="text-gray-300 text-[15px] mt-5 group-hover:text-white group-hover:cursor-pointer"> Home </p>
                                    </div>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={"/Services"}>

                                    <div className="flex group ">
                                        <span className="group-hover:translate-x-3 transition-all duration-300">
                                            <MdKeyboardArrowRight className="size-10 text-gray-300 mt-5" />
                                        </span>
                                        <p className="text-gray-300 text-[15px] mt-5 group-hover:text-white group-hover:cursor-pointer"> Services </p>
                                    </div>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={"/gallery"}>

                                    <div className="flex group ">
                                        <span className="group-hover:translate-x-3 transition-all duration-300">
                                            <MdKeyboardArrowRight className="size-10 text-gray-300 mt-5" />
                                        </span>
                                        <p className="text-gray-300 text-[15px] mt-5 group-hover:text-white group-hover:cursor-pointer"> Gallery </p>
                                    </div>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={"/about"}>

                                    <div className="flex group ">
                                        <span className="group-hover:translate-x-3 transition-all duration-300">
                                            <MdKeyboardArrowRight className="size-10 text-gray-300 mt-5" />
                                        </span>
                                        <p className="text-gray-300 text-[15px] mt-5 group-hover:text-white group-hover:cursor-pointer"> About </p>
                                    </div>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={"/contact"}>

                                    <div className="flex group ">
                                        <span className="group-hover:translate-x-3 transition-all duration-300">
                                            <MdKeyboardArrowRight className="size-10 text-gray-300 mt-5" />
                                        </span>
                                        <p className="text-gray-300 text-[15px] mt-5 group-hover:text-white group-hover:cursor-pointer"> Contact </p>
                                    </div>
                                </NavLink>
                            </li>

                        </ul>
                    </div>
                    <div>
                        <h1 className="text-4xl text-white font-semibold mb-4">Contact & Support</h1>
                        <hr className="text-text-muted" />

                        <div className="flex gap-5">
                            <span className="text-3xl ">
                                <FaLocationDot className="mt-6 text-gray-300" />
                            </span>
                            <p className="text-gray-300 text-[15px] mt-5">
                                Indian Institute of Technology Mandi,
                                Kamand, Himachal Pradesh-175005,
                                India
                            </p>
                        </div>

                        <div className="flex gap-5">
                            <span className="text-3xl ">
                                <FaPhoneAlt className="mt-8 text-gray-300" />
                            </span>
                            <p className="text-gray-300 text-[15px] mt-8">
                                +91 8810269376
                            </p>
                        </div>
                        <div className="flex gap-5">
                            <span className="text-3xl ">
                                <MdEmail className="mt-8 text-gray-300" />
                            </span>
                            <p className="text-gray-300 text-[15px] mt-8">
                                glowandgrace.business@gmail.com
                            </p>
                        </div>
                        <div className="mt-3">
                            <h1 className="text-white text-2xl font-semibold">Mon-Sun: 9AM – 9PM</h1>
                        </div>

                        <h1 className="text-3xl text-gray-100 font-semibold mt-6">Follow on Socials</h1>
                        <div className="flex gap-5">
                            <div className="flex items-center justify-center size-16 hover:shadow-glow bg-bg-dark rounded-full mt-3">
                                <div>
                                    <FaFacebook className="size-10 text-white hover:rotate-360 transition duration-500" />
                                </div>
                            </div>
                            <div className="flex items-center justify-center size-16 bg-bg-dark hover:shadow-glow rounded-full mt-3">
                                <div>
                                    <FaInstagram className="size-10 text-white hover:rotate-360 transition duration-500" />
                                </div>
                            </div>
                            <div className="flex items-center justify-center size-16 bg-bg-dark hover:shadow-glow rounded-full mt-3">
                                <div>
                                    <FaTwitter className="size-10 text-white hover:rotate-360 transition duration-500" />
                                </div>
                            </div>
                            <div className="flex items-center justify-center size-16 bg-bg-dark hover:shadow-glow rounded-full mt-3">
                                <div>
                                    <FaLinkedin className="size-10 text-white hover:rotate-360 transition duration-500" />
                                </div>
                            </div>
                        </div>


                    </div>
                </div>

            </section>
            <div className="w-full bg-linear-to-r h-auto px-25 py-10 from-primary-soft to-primary">
                <div className="flex gap-5 flex-col sm:flex-col md:flex-row md:justify-between ">
                    <div className="flex gap-2">
                        <span>
                            <BiSolidCopyright className="size-8 text-white" />
                        </span>
                        <h1 className="text-gray-400 text-2xl">2026 <span className="font-bold text-white">
                            Glow & Grace. </span>  All rights reserved.</h1>
                    </div>
                    <div className="flex flex-col items-center gap-5 justify-center md:flex-row md:justify-between">

                        <NavLink to={"/privacy-policy"}>
                            <span className="text-gray-300 font-light text-[14px] hover:text-gray-50">
                                Privacy Policy
                            </span>
                        </NavLink>
                        <NavLink to={"/terms-and-condition"}>
                            <span className="text-gray-300 font-light text-[14px] hover:text-gray-50">
                                Terms & Condition
                            </span>
                        </NavLink>
                        <NavLink to={"/cancellation-policy"}>
                            <span className="text-gray-300 font-light text-[14px] hover:text-gray-50">
                                Cancellation Policy
                            </span>
                        </NavLink>
                    </div>
                </div>
                <div>
                    <p className="text-gray-400 text-xl mt-7 text-center"> Glow & Grace - Online Salon Booking | Beauty Services | Hair Salon | Spa Treatments | Facial | Haircut | Grooming |</p>
                </div>
            </div>

        </>
    )
}
