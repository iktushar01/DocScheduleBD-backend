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

const updateDoctor = async (id: string, payload: any) => {
    const { password, specialities, doctor: doctorData } = payload;

    const doctorInfo = await prisma.doctor.findUniqueOrThrow({
        where: { id },
    });

    const result = await prisma.$transaction(async (tx) => {
        // 1. Update Password if provided
        if (password) {
            await tx.account.updateMany({
                where: { userId: doctorInfo.userId },
                data: { password },
            });
        }

        // 2. Update Doctor basic info
        const updatedDoctor = await tx.doctor.update({
            where: { id },
            data: doctorData,
        });

        // 3. Update Specialities if provided
        if (specialities && Array.isArray(specialities)) {
            // Delete existing
            await tx.doctorSpeciality.deleteMany({
                where: { doctorId: id },
            });

            // Create new
            const doctorSpecialityData = specialities.map((specialityId: string) => ({
                doctorId: id,
                specialityId,
            }));

            await tx.doctorSpeciality.createMany({
                data: doctorSpecialityData,
            });
        }

        // 4. Return updated doctor with relations
        return await tx.doctor.findUnique({
            where: { id },
            include: {
                user: true,
                specialities: {
                    include: {
                        speciality: true,
                    },
                },
            },
        });
    });

    return result;
};

const deleteDoctor = async (id: string) => {
    const result = await prisma.doctor.delete({
        where: {
            id
        }
    })
    return result;
}

export const DoctorService = {
    getAllDoctors,
    getSingleDoctor,
    updateDoctor,
    deleteDoctor
}
