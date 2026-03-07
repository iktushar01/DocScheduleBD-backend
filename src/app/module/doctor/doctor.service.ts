import { prisma } from "../../lib/prisma";

const getAllDoctors = async () => {
    const result = await prisma.doctor.findMany({
        include: {
            user: true,
            specialities: {
                include: {
                    speciality: true
                }
            }
        }
    })
    return result;
}

const getSingleDoctor = async (id: string) => {
    const result = await prisma.doctor.findUnique({
        where: {
            id
        },
        include: {
            user: true,
            specialities: {
                include: {
                    speciality: true
                }
            }
        }
    })
    return result;
}

const updateDoctor = async (id: string, data: any) => {
    const result = await prisma.doctor.update({
        where: {
            id
        },
        data
    })
    return result;
}

export const DoctorService = {
    getAllDoctors,
    getSingleDoctor,
    updateDoctor
}
