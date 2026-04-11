export const FavoriteStaffCard = ({ appointments }) => {

  const staffCount = appointments.reduce((acc, curr) => {
    acc[curr.staff] = (acc[curr.staff] || 0) + 1;
    return acc;
  }, {});

  const favorite = Object.entries(staffCount).sort(
    (a, b) => b[1] - a[1]
  )[0];

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold mb-3">
        Favorite Staff
      </h2>
      <p className="text-gray-600">
        {favorite ? favorite[0] : "No bookings yet"}
      </p>
    </div>
  );
};