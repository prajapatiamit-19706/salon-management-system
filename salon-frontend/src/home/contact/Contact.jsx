import PageMotion from "../../components/pageMotion"
import FadeUp from "../../components/FadeUp";
import { FaTelegramPlane } from "react-icons/fa";
import { FAQ } from "../../UI/FAQ";
import data from "../../API/FAQ.json";
import ContactMethods from "./ContactMethod";

export const Contact = () =>{

    
         const handleSubmit =(formData)=>{
                const formInputData = Object.fromEntries(formData.entries());
                console.log(formInputData);
                
         }

    return (
        <section className="min-h-screen">

            <PageMotion>
                <div className="container mx-auto p-6">

                    {/* heading */}
                    <h1 className="text-5xl font-bold text-bg-dark text-center mt-6">
                        Contact Glow & Grace - Customer Support & Salon Booking Help
                    </h1>

                    <p className="text-[16px] text-gray-600 max-w-4xl mx-auto mb-6 text-center mt-5 tracking-wide"> Whether you need help with <strong>salon bookings</strong>, have questions about<strong> beauty services</strong>, or want to provide feedback, we're here to help you<strong> 24/7</strong>.</p>

                   <div className="bg-white rounded-lg py-5 px-10 sm:max-w-[70%] mx-auto shadow-sm mb-20">
                    <p className=" text-2xl md:text-3xl text-center text-text-muted"> <strong className="text-text-heading"> Quick Support:</strong> For urgent salon booking issues, email us directly at </p>
                    <p className="text-center text-2xl mt-2 hover:text-blue-700 cursor-pointer text-blue-600">glowandgrace.business@gmail.com</p>
                   </div>

                     <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.5fr] shadow-custom rounded-3xl overflow-hidden">
                        {/* content */}
                      <div className="py-12 md:py-20 px-6 md:px-12 flex justify-center items-center flex-col">
                            <div className="flex justify-center px-5 md:justify-start items-start flex-col">
                                <h1 className="text-4xl font-bold text-text-heading">Send us a Message - We're Here to Help</h1>
                                <p className="text-2xl text-text-muted mt-5 leading-9 tracking-[0.020rem]">Have questions about 
                                    <span className="font-bold text-text-heading"> salon bookings, beauty services, </span> or need  <span className="font-bold text-text-heading"> technical support?</span> Fill out the form below and our team will get back to you promptly.</p>
                            </div>

                           <div className="mt-8 w-full flex justify-center md:justify-start pl-5">
                                <form action={handleSubmit} className="w-full max-w-3xl">
                                    <div className="flex gap-6 flex-col lg:flex-row w-full">
                                        <div className="flex flex-col gap-2 w-full">
                                    <label htmlFor="name" className="text-2xl font-semibold text-gray-700">Your Full Name*</label>
                                    <input type="text" name="name" required autoComplete="off" placeholder="Enter your Full Name" className="border-text-muted/50 border  outline-none transition focus:border-primary
                                   focus:ring-1 focus:ring-primary/30 p-5  rounded-2xl w-full text-2xl" />
                                       </div>
                                       <div className="flex flex-col gap-2 w-full">
                                    <label htmlFor="email" className="text-2xl font-semibold text-gray-700">Email Address*</label>
                                    <input type="email" name="email"  required autoComplete="off" placeholder="your.email.@example.com" className="border-text-muted/50 border  outline-none transition focus:border-primary 
                                   focus:ring-1 focus:ring-primary/30 p-5 rounded-2xl max-w-full text-2xl"/>
                                    </div>
                                    </div>
                                    <br />
                                    <label htmlFor="feedback" className="text-2xl font-semibold text-gray-700">How we can help you* </label>
                                    <textarea name="feedback" id="feedback"  required autoComplete="off" placeholder="Please describe your inquiry about salon booking, beauty services or any technical issues." className="w-full h-80 border-text-muted/50 border  outline-none transition focus:border-primary mt-3
                                   focus:ring-1 focus:ring-primary/30 p-5 rounded-2xl text-2xl"></textarea>
                                   <p className="text-xl text-text-muted mt-2">Typical response time: 2-4 hours for salon booking inquiries</p>
                                <div className="flex justify-center mt-6">
                                <button
                                    type="submit"
                                    className="bg-primary-soft w-full sm:w-[60%] text-text-invert text-2xl py-4 rounded-2xl flex justify-center items-center gap-4"
                                    > <span> <FaTelegramPlane size={20}/>  </span>  Send Message
                                </button>
                                </div>

                                </form>

                            </div>
                        </div>

                      {/* map */}
                        <div className="rounded-3xl lg:rounded-none overflow-hidden shadow-medium bg-primary-soft p-4 md:p-8">
                        <iframe
                            title="Salon Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29175.10860761537!2d72.34283539720163!3d23.928999377106102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395cf4fdb8907cdb%3A0xb588efce07ef80e5!2sSiddhpur%2C%20Gujarat%20384151!5e0!3m2!1sen!2sin!4v1766906583118!5m2!1sen!2sin"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"  
                            className="w-full h-[300px] md:h-[450px] lg:h-full border-0 rounded-2xl"
                        />
                        </div>

                    </div>

                       <FadeUp>
                              <div className="w-full bg-bg-soft shadow-custom pb-10 rounded-2xl mt-0">
                                <h1 className="text-[28px] text-center pt-9 gradient text-black font-semibold mt-15 mb-10">Frequently Asked Questions - Salon Booking</h1>
                                <div>
                                <ul className="grid grid-cols-1 gap-5 mx-4">
                                {
                                    data.map((curEle)=>{
                                    return <FAQ curData={curEle}/>
                                    })
                                }
                                </ul>
                            </div> 
                      </div>
                        </FadeUp> 

                        <FadeUp>
                            <ContactMethods/>
                        </FadeUp>

                </div>
            </PageMotion>

        </section>
    )
}