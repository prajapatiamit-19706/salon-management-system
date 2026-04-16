
import data from "../../API/gallery.json";
import { useState } from "react";
import { BeforeAfterCard } from "./beforeAfter";
import beforeAfter from "../../API/beforeAfter.json";


export const Gallery = () => {

  const [filter, setFilter] = useState("all");

  const categories = [
    { value: "all", label: "All " },
    { value: "hair", label: "Hair" },
    { value: "beard", label: "Beard" },
    { value: "spa", label: "Spa" },
    { value: "eyebrow", label: "Eyebrow" },
    { value: "makeup", label: "MakeUp" },
    { value: "nails", label: "Nail" },
    { value: "skin", label: "Facial" },
    { value: "waxing", label: "Waxing" },

  ]

  const onHandleClick = (value) => {
    setFilter(value);
  }

  const filteredImages = data.filter((item) => {
    if (filter === "all") return true

    return item.category === filter;
  })

  return (
    <section className="container mx-auto px-5 py-16 animate-fade-up">

      {/* Heading */}

      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold italic text-primary ">
          Our Transformations ✨
        </h2>
        <p className="text-text-muted text-xl mt-4">
          Real clients. Real results. Crafted with care.
        </p>
      </div>


      {/* category grid  */}

      <div className="flex flex-wrap justify-center items-center gap-4">
        {
          categories.map((cat) => {
            return <div key={cat.value}>
              <button
                type="button"
                onClick={() => onHandleClick(cat.value)}
                className={` relative 
                    whitespace-nowrap  w-auto  flex font-medium
                  items-center text-2xl capitalize gap-2 px-5 py-3  transition-all duration-300 cursor-pointer active:scale-95
              ${filter === cat.value
                    ? " text-text-heading"
                    : ""
                  }`}
              >
                {
                  cat.label
                }
                {/* Active underline */}
                <span
                  className={`
                  absolute left-1/2 -bottom-1 h-[3px] rounded-full bg-primary
                  transition-all duration-300
                  ${filter === cat.value
                      ? "w-10 -translate-x-1/2"
                      : "w-0"
                    }
                `}
                />
              </button>
            </div>

          })
        }
      </div>

      {/* Gallery Grid */}
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-5 space-y-5 mt-10">
        {filteredImages.map((img) => (

          <div
            key={img.id}
            className="group relative overflow-hidden rounded-2xl bg-bg-panel shadow-medium cursor-pointer"
          >
            <img
              src={img.src}
              key={filter}
              alt={img.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 animate-fade-up"
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-end">
              <p className="text-white text-sm p-4 font-medium">
                {img.title}
              </p>
            </div>
          </div>



        )
        )}
      </div>

      <section className="bg-bg-main py-16">
        <div className="container mx-auto px-5">

          {/* Heading */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-text-heading">
              Before & After Transformations
            </h2>
            <p className="mt-3 text-text-muted">
              Real results that speak for themselves.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {beforeAfter.map(item => (
              <BeforeAfterCard key={item.id} item={item} />
            ))}
          </div>

        </div>
      </section>

    </section>

  );
};
