import express from "express";
import { SpecialityController } from "./speciality.controller";

const router = express.Router();

router.post("/", SpecialityController.createSpeciality);

export const SpecialityRoute = router;
