import { MdEmail, MdPhone, MdSupportAgent } from "react-icons/md";

const ContactMethods = () => {
  return (
    <section className="w-full px-4 py-20">
      <div className="mx-auto rounded-3xl bg-linear-to-r from-primary to-primary-soft p-10 sm:p-16 shadow-xl">

        {/* Heading */}
        <h2 className="text-4xl font-bold text-white text-center">
          Prefer Other Contact Methods?
        </h2>
        <p className="text-white/90 text-center text-2xl mt-4 max-w-4xl mx-auto">
          We're available through multiple channels to assist with your salon
          booking needs
        </p>

        {/* Cards */}
        <div className="mt-12  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Email */}
          <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300">
            <MdEmail className="text-white text-4xl mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white">
              Email Support
            </h3>
            <p className="text-white/90 text-xl mt-2">
              glowandgrace.business@gmail.com
            </p>
          </div>

          {/* Phone */}
          <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300">
            <MdPhone className="text-white text-4xl mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white">
              Phone Support
            </h3>
            <p className="text-white/90 text-xl mt-2">
              +91 88102 69376
            </p>
          </div>

          {/* Online */}
          <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300">
            <MdSupportAgent className="text-white text-4xl mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white">
              24/7 Online
            </h3>
            <p className="text-white/90 text-xl mt-2">
              Contact Form
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactMethods;
