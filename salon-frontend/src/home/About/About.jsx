import { motion } from "framer-motion";
import FadeUp from "../../components/FadeUp";
import features from "../../API/whyChooseUs.json";
import { NavLink } from "react-router-dom";
import stats from "../../API/stats.json"
import PageMotion from "../../components/pageMotion";

export const About = () => {
  return (
    <section className="min-h-screen bg-bg-main">

      {/* HERO */}
      <PageMotion>
        <div className="container mx-auto px-6 text-center pt-20">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-text-heading">
            Where Style Meets Confidence
          </h1>
          <p className="mt-6 text-xl text-text-muted max-w-3xl mx-auto">
            We don’t just style hair — we craft confidence, comfort, and unforgettable experiences.
          </p>
        </div>


        {/* STORY + IMAGE */}
        <FadeUp>
          <section className="container mx-auto px-6 py-20 grid md:grid-cols-2 gap-14 items-center">

            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-semibold text-text-heading">
                Our Story
              </h2>

              <p className="mt-6 text-lg md:text-xl text-text-muted leading-relaxed">
                Founded with a passion for beauty and self-expression, our salon was created
                to be more than just a place for grooming. It is a space where creativity
                meets care, and every client feels valued.
              </p>

              <p className="mt-4 text-lg md:text-xl text-text-muted leading-relaxed">
                What started as a small vision has grown into a trusted destination for
                people who believe in quality, hygiene, and personalized service.
              </p>

              {/* Philosophy */}
              <h3 className="mt-10 text-3xl font-serif font-semibold text-text-heading">
                💎 Our Philosophy
              </h3>

              <p className="mt-4 text-lg text-text-muted">
                We don’t follow trends blindly — we adapt them to you.
              </p>

              <ul className="mt-5 space-y-2 text-lg text-text-muted list-disc list-inside">
                <li>Listen carefully</li>
                <li>Work professionally</li>
                <li>Deliver confidently</li>
              </ul>

              <p className="mt-4 text-lg text-text-muted">
                Every haircut, makeover, and treatment is performed with precision,
                patience, and pride.
              </p>

              {/* Values */}
              <h3 className="mt-10 text-3xl font-serif font-semibold text-text-heading">
                🌱 Our Values
              </h3>

              <ul className="mt-5 space-y-2 text-lg text-text-muted list-disc list-inside">
                <li>Quality over quantity</li>
                <li>Client-first mindset</li>
                <li>Transparency and trust</li>
                <li>Respect for individuality</li>
              </ul>

              <p className="mt-4 text-lg text-text-muted">
                These values guide every decision we make — from services to customer care.
              </p>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-medium">
              <img
                src="/images/galleryp1.jpg"
                alt="Our Salon"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

          </section>
        </FadeUp>

        {/* WHY CHOOSE US */}
        <FadeUp>
          <section className="bg-bg-soft py-20">
            <div className="container mx-auto px-6">
              <h2 className="text-center text-5xl font-serif font-semibold text-text-heading">
                Why Choose Us
              </h2>

              <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {features.map((item, i) => (
                  <div
                    key={i}
                    className="bg-bg-panel p-6 rounded-2xl shadow-soft hover:shadow-medium transition"
                  >
                    <h3 className="text-3xl font-semibold text-text-heading">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-xl text-text-muted">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </FadeUp>

        {/* STATS */}
        <section className="container mx-auto px-6 py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
            {stats.map((stat, index) => (
              <FadeUp key={stat.id} delay={index * 0.08}>
                <div>
                  <h3 className="text-5xl font-bold text-primary">
                    {stat.value}
                  </h3>
                  <p className="mt-2 text-text-muted">
                    {stat.label}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* TEAM INTRO */}
        <section className="bg-bg-soft py-20">
          <div className="container mx-auto px-6 text-center">
            <FadeUp>
              <h2 className="text-4xl font-serif font-semibold text-text-heading">
                Meet Our Experts
              </h2>
              <p className="mt-4 text-lg text-text-muted max-w-2xl mx-auto">
                Our team is made up of passionate professionals who love what
                they do — delivering creativity, precision, and care in
                every service.
              </p>

              <NavLink
                to="/staffs"
                className="inline-block mt-10 px-8 py-4 bg-primary rounded-2xl font-semibold hover:scale-105 transition"
              >
                <span className="text-text-invert"> View Our Team </span>
              </NavLink>
            </FadeUp>
          </div>
        </section>


        {/* CTA */}
        <FadeUp>
          <section className="bg-primary text-white py-20 text-center">
            <h2 className="text-4xl font-serif font-semibold">
              Ready to Transform Your Look?
            </h2>
            <p className="mt-4 text-lg opacity-90">
              Book your appointment today and experience the difference.
            </p>

            <NavLink
              to="/booking"
              className="inline-block mt-8 px-10 py-4 bg-bg-main rounded-2xl font-semibold hover:scale-105 transition"
            >
              <span className="text-primary">Book Now</span>
            </NavLink>

            <NavLink
              to="/contact"
              className=" group inline-block mt-8 px-10 py-4 bg-transparent border ml-8 hover:bg-bg-main rounded-2xl font-semibold hover:scale-105 transition"
            >
              <span className="text-text-invert group-hover:text-primary transition duration-300">Contact Us</span>
            </NavLink>
          </section>
        </FadeUp>
      </PageMotion>
    </section>
  );
};
