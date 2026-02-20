import { Speciality } from "../../../generated/prisma";
import { prisma } from "../../lib/prisma";

const createSpeciality = async (payload: Speciality): Promise<Speciality> => {
    const result = await prisma.speciality.create({
        data: payload,
    })
    return result
}

export const SpecialityService = {
    createSpeciality,
}
