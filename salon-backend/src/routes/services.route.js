import express from "express";
import {
    getServices,
    createService,
    deleteService,
    updateService
} from "../controllers/services.controller.js";

const router = express.Router();

// insert service (temporary)

router.post("/", createService);

router.get("/", getServices);

router.delete("/:id", deleteService);

router.put("/:id", updateService);

export default router;