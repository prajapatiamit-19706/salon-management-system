export const SelectStaff = ({
  staffs,
  selectedService,
  selectedStaff,
  onStaffSelect
}) => {

  // If no service selected yet
  if (!selectedService) {
    return (
      <p className="mt-3 text-lg text-gray-500">
        Please select a service first
      </p>
    );
  }

  // Filter staff by skill
  const matchingStaff = staffs.filter(member =>
    member.skills.includes(selectedService.category)
  );

  return (
    <section className="mt-4">

      <h3 className="text-xl font-semibold mb-2">
        For {selectedService.name}
      </h3>

      <div className="grid grid-cols-3 gap-2">

        {/* Matching Staff */}
        {matchingStaff.map((staff) => {

          const isSelected =
            selectedStaff?._id === staff._id;

          return (
            <button
              key={staff._id}
              type="button"
              onClick={() => onStaffSelect(staff)}
              className={`p-3 rounded-xl transition cursor-pointer
                ${isSelected
                  ? "bg-primary text-white shadow-strong"
                  : "bg-bg-panel hover:shadow-medium"
                }
              `}
            >
              <h2 className="font-semibold text-xl mb-2" >{staff.name}</h2>
              <p className="text-lg"> <span className="font-medium italic">Expertise:</span> {staff.specialties?.join(", ")}</p>
            </button>
          );
        })}

        {/* If no staff available */}
        {matchingStaff.length === 0 && (
          <span className="text-lg text-text-heading">
            No staff available for this service
          </span>
        )}

      </div>
    </section>
  );
};