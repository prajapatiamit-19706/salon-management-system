import User from "../models/user.model.js";

const fetchCustomers = async (req, res) => {
    try {
        const customers = await User.aggregate([
            {
                $match: { role: "user" }
            },
            {
                $lookup: {
                    from: "appointments",
                    localField: "_id",
                    foreignField: "userId",
                    as: "appointments"
                }
            },
            {
                $addFields: {
                    totalAppointments: { $size: "$appointments" },
                    // Sort by date inside the server/mongodb if needed, or simply map it. 
                    // To keep it simple, we just extract the most recent date if exists.
                    lastVisit: {
                        $max: "$appointments.date"
                    }
                }
            },
            {
                $project: {
                    password: 0,
                    otp: 0,
                    otpExpiry: 0,
                    appointments: 0 // Remove heavy raw appointments array
                }
            },
            {
                $sort: { createdAt: -1 } // Sort newest members first
            }
        ]);

        if (!customers) {
            return res.status(404).json({
                success: false,
                message: "No customers found"
            })
        }

        res.status(200).json({
            success: true,
            customers
        })

    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch customers"
        })
    }
}

export default fetchCustomers;