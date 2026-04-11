import Staff from "../models/staff.model.js"
import cloudinary from "../config/cloudinary.js"

// get staff data
export const getStaff = async (req, res) => {

    try {
        const staff = await Staff.find();

        return res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch staff",
            error: error.message,
        });
    }

}

// get single staff

export const getSingleStaff = async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.id);
        console.log("Backend received id:", req.params.id);

        if (!staff) {
            return res.status(404).json({
                message: "staff not found"
            })
        }
        return res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch staff",
            error: error.message,
        });
    }
}


// for admin panel

// get all staffs
export const getAllStaff = async (req, res) => {
    try {
        const staffs = await Staff.find();

        return res.status(200).json(staffs);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch staff",
            error: error.message,
        });
    }
}

// create staff
export const createStaff = async (req, res) => {
    try {
        const { name, phone, role, experience, specialties, skills, gender, rating, bio, image, availability, socials, isActive } = req.body;

        // ── Auto-generate serviceCode ──────────────────────
        // Find the latest service by serviceCode descending
        const lastStaff = await Staff.findOne({ staffCode: { $exists: true, $ne: null } })
            .sort({ staffCode: -1 })
            .select("staffCode");

        let nextCode = "stf-001"; // default if no staff exist
        if (lastStaff?.staffCode && lastStaff.staffCode.startsWith("stf-")) {
            const numPart = parseInt(lastStaff.staffCode.replace("stf-", ""), 10) || 0;
            nextCode = `stf-${String(numPart + 1).padStart(3, "0")}`;
        }
        const staff = new Staff({
            staffCode: nextCode,
            name,
            phone,
            role,
            experience,
            specialties,
            skills,
            gender,
            rating,
            bio,
            image,
            availability,
            socials,
            isActive
        })

        await staff.save();

        return res.status(200).json({
            success: true,
            message: "Staff created successfully",
            staff
        })
    } catch (error) {
        console.log(error);

        // Handle duplicate staffCode
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Staff code already exists",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create staff",
            error: error.message,
        })

    }
}

// update staff
export const updateStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, role, experience, specialties, skills, gender, rating, bio, image, availability, socials, isActive } = req.body;

        const staff = await Staff.findByIdAndUpdate(id, {
            name,
            phone,
            role,
            experience,
            specialties,
            skills,
            gender,
            rating,
            bio,
            image,
            availability,
            socials,
            isActive
        },
        );

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: "Staff not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Staff updated successfully",
            staff
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update staff",
            error: error.message,
        })
    }
}



// remove staff
export const removeStaff = async (req, res) => {

    try {

        const staff = await Staff.findById(req.params.id);

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: "Staff not found"
            })
        }

        // Delete image from Cloudinary if it exists
        if (staff.image && staff.image.includes("cloudinary")) {
            try {
                // Extract public_id from Cloudinary URL
                // URL format: https://res.cloudinary.com/xxx/image/upload/v123/salon/staff/abc123.jpg
                const urlParts = staff.image.split("/upload/");
                if (urlParts[1]) {
                    const publicId = urlParts[1].split("/").slice(1).join("/").replace(/\.[^.]+$/, "");
                    await cloudinary.uploader.destroy(publicId);
                }
            } catch (cloudErr) {
                console.error("Cloudinary delete error (non-blocking):", cloudErr.message);
            }
        }

        await Staff.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Staff removed successfully",
            staff
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to remove staff",
            error: error.message,
        })
    }
}

