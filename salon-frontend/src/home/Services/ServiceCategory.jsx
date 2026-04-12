import srv from "../../API/ServiceGrid.json";
import {
  Sparkles,
  Scissors,
  Heart,
  Droplets,
  Sun,
  Palette,
  Footprints,
  Gift,
  Eye,
} from "lucide-react";



const iconMap = {
  all: <Sparkles size={16} />,
  hair: <Scissors size={16} />,
  beard: <Scissors size={16} />,
  spa: <Droplets size={16} />,
  waxing: <Heart size={16} />,
  "skin-and-facial": <Sun size={16} />,
  makeup: <Palette size={16} />,
  "nail-and-foot-care": <Footprints size={16} />,
  package: <Gift size={16} />,
  eyebrow: <Eye size={16} />,
};

//  normal the all category remove space and special char.
const normalizeCategory = (category) =>
  category
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9 ]/g, "")
    .trim()
    .replace(/\s+/g, "-");



export const ServiceCategory = ({ filter, setFilter }) => {


  const categories = [
    {  //for all service only
      value: "all",
      label: "All Services",
      icon: iconMap.all,
    },
    ...[      //create new array of normal name category like Hair Cut into hair-cut
      ...new Set(
        srv.map(item => normalizeCategory(item.category))
      ),
    ].map(normCat => {
      const originalLabel = srv.find(                       //convert category in original for display hair-cut into original Hair Cut
        s => normalizeCategory(s.category) === normCat
      )?.category;

      return {
        value: normCat,
        label: originalLabel,
        icon: iconMap[normCat] || null,
      };
    }),
  ];

  const handleClick = (value) => {
    setFilter(value);
    //  if (onFilterChange) onFilterChange(value);
  };



  return (<>

    {/* mobile menu */}

    <div className="flex bg-primary-soft flex-wrap gap-3 justify-center py-4 rounded-2xl lg:hidden">
      {
        categories.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setFilter(cat.value)} className={`
                    whitespace-nowrap  w-auto  flex font-medium
                  items-center text-2xl capitalize gap-2 px-5 py-3 rounded-full border hover:scale-105 transition-all duration-300 hover:border-primary active:scale-95
                 ${filter === cat.value
                ? " bg-white text-text-heading"
                : " text-white"
              }`}
          >
            {cat.icon && (
              <span
                className={` ${filter === cat.value
                  ? "animate-pulse text-text-heading drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
                  : ""
                  }`}
              >
                {cat.icon}
              </span>

            )}
            {cat.label}
          </button>
        ))}

    </div>


    {/* desktop view */}
    <section className="flex ">
      <div className="bg-primary-soft hidden lg:block space-y-3 ml-10 py-12 px-5 rounded-4xl shadow-custom mt-10 mb-10 animate-fade-in transition duration-300">
        {/* Buttons */}
        <div className="flex flex-col  justify-start flex-wrap gap-3">
          <h3 className="text-text-invert ml-4 mb-2 text-[14px]">Let's Select your category </h3>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleClick(cat.value)}
              className={`flex w-80 items-center cursor-pointer text-2xl capitalize gap-2 px-5 py-3 rounded-full  shadow-inset hover:scale-105 transition-all duration-300 hover:border-primary active:scale-95
          
              ${filter === cat.value
                  ? " bg-white text-text-heading"
                  : " text-white"
                }`}
            >
              {cat.icon && (
                <span
                  className={`${filter === cat.value
                    ? "animate-pulse text-text-heading drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
                    : ""
                    }`}
                >
                  {cat.icon}
                </span>

              )}
              {cat.label}
            </button>
          ))}
        </div>

        {/* <button className="flex w-80 items-center text-xl capitalize gap-2 px-2 text-text-invert  py-3 rounded-full mt-10 font-bold shadow-inset transition-all duration-300 active:scale-95 ">
          <span>
            <IoGiftSharp size={25} />
          </span>
          make your Custom combo</button> */}

      </div>
    </section>

  </>);
}