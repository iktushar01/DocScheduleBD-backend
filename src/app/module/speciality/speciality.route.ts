import express from "express";
import { SpecialityController } from "./speciality.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma";
import { multerUpload } from "../../config/multer.config";
import { validateRequest } from "../../middleware/validateRequest";
import { SpecialtyValidation } from "./specialty.validation";

const router = express.Router();

router.post("/",
    // checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    multerUpload.single("file"),
    validateRequest(SpecialtyValidation.createSpecialtyZodSchema),
    SpecialityController.createSpecialty);
router.get("/", SpecialityController.getAllSpecialities);
router.patch("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), SpecialityController.updateSpeciality);
router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), SpecialityController.deleteSpeciality);

export const SpecialityRoute = router;
