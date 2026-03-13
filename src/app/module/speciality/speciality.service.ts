// import { Speciality } from "../../../generated/prisma";
import { prisma } from "../../lib/prisma";
import { Speciality } from "../../../generated/prisma/client";

const createSpecialty = async (payload: Speciality): Promise<Speciality> => {
    const result = await prisma.specialty.create({
        data: payload,
    })
    return result
}


const getAllSpecialities = async (): Promise<Speciality[]> => {
    const result = await prisma.specialty.findMany()
    return result
}

const deleteSpeciality = async (id: string): Promise<Speciality> => {
    const result = await prisma.specialty.delete({
        where: {
            id,
        },
    })
    return result
}
const updateSpeciality = async (id: string, payload: Speciality): Promise<Speciality> => {
    const result = await prisma.specialty.update({
        where: {
            id,
        },
        data: payload,
    })
    return result
}
export const SpecialityService = {
    createSpecialty,
    getAllSpecialities,
    deleteSpeciality,
    updateSpeciality
}
