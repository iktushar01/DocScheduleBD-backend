import { Role, User } from "../../../generated/prisma";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

interface IRegisterPatient {
    name: string;
    email: string;
    password: string;
}

const registerPatient = async (payload: IRegisterPatient) => {
    const {name, email, password} = payload;
     
    const data = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password,
        }
    })

    if(!data.user){
        throw new Error("User registration failed")
    }

    //:TODO: create patient profile 
    // const patient = await prisma.$transaction(async (tx) => {
    //     const user = await tx.user.update({
    //         where: {
    //             id: data.user?.id
    //         },
    //         data: {
    //             needPasswordChange: true,
    //             role: Role.PATIENT,
    //         }
    //     })
    // })

    return data
}

export const AuthService = {
    registerPatient
}