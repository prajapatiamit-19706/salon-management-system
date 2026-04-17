export const SelectService = ({
  services,
  selectedService,
  onServiceSelect
}) => {

  return (
    <>
      <div>
        <h1 className="text-xl font-semibold mt-4 mx-2">
          Select a Service
        </h1>

        <div className="flex gap-25 mx-2">
          <div>
            <h1 className="size-7 mt-3 rounded bg-primary">
              <span className="ml-8 text-xl">Selected</span>
            </h1>
          </div>

          <div>
            <h1 className="size-7 mt-3 rounded bg-bg-panel">
              <span className="ml-8 text-xl">Available</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
        {services.map((service) => {

          const isSelected =
            selectedService?._id === service._id;

          return (
            <button
              key={service._id}
              type="button"
              onClick={() => onServiceSelect(service)}
              className={`p-3 text-xl text-start rounded-2xl transition cursor-pointer
                ${isSelected
                  ? "bg-primary text-white shadow-strong"
                  : "bg-bg-panel hover:shadow-medium"
                }
              `}
            >
              <h3 className="font-semibold">{service.name}</h3>

              {/* <span className="text-md">{service.duration} mins</span> */}

              <p className="font-semibold italic">
                From ₹{service.priceFrom}
              </p>
            </button>
          );
        })}
      </div>
    </>
  );
};