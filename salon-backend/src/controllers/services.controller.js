import Service from "../models/services.model.js";



// get all service
export const getServices = async (req, res) => {
  try {
    const services = await Service.find();

    if (!services || services.length === 0) {
      return res.status(404).json({
        message: "service not found"
      })
    }

    res.status(200).json(services);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch service",
      error: error.message,
    });
  }
}


// create services 
export const createService = async (req, res) => {
  try {
    const {
      displayOrder,
      name,
      category,
      description,
      gender,
      duration,
      priceFrom,
      tags,
      isActive,
    } = req.body;

    // ── Auto-generate serviceCode ──────────────────────
    // Find the latest service by serviceCode descending
    const lastService = await Service.findOne({ serviceCode: { $exists: true, $ne: null } })
      .sort({ serviceCode: -1 })
      .select("serviceCode");

    let nextCode = "srv-001"; // default if no services exist
    if (lastService?.serviceCode) {
      // Extract the number from "srv-012" → 12, then increment
      const numPart = parseInt(lastService.serviceCode.replace(/\D/g, ""), 10) || 0;
      nextCode = `srv-${String(numPart + 1).padStart(3, "0")}`;
    }


    const service = new Service({
      serviceCode: nextCode,
      displayOrder: displayOrder,
      name,
      category,
      description,
      gender,
      duration,
      priceFrom,
      tags,
      isActive,
    });

    await service.save();

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    console.error(error);

    // Handle duplicate serviceCode
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Service code already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create service",
    });
  }
};


// delete service
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
      service
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete service"
    });
  }
};

// update service

export const updateService = async (req, res) => {
  try {
    console.log("req.body →", req.body); // ← add this temporarily
    console.log("req.params.id →", req.params.id); // ← check id exists

    const {
      displayOrder,
      name,
      category,
      description,
      gender,
      duration,
      priceFrom,
      tags,
      isActive,
    } = req.body;

    // ✅ serviceCode is intentionally excluded — it is auto-generated on create and never changes
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      {
        displayOrder,
        name,
        category,
        description,
        gender,
        duration,
        priceFrom,
        tags,
        isActive,
      },
      // { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update service",
    });
  }
};


