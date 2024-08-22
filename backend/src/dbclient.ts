import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
interface SignUser{
    username : string,
    firstname : string;
    lastname : string,
    password : string
}
export const checkUser = async (username:string)=>{
    try {
        await prisma.$connect();
        const isUser = await prisma.user.findUnique({
            where:{
                username
            }
        })
        return 'User is Not existed'
    } catch (error) {
        return null
    }finally{
        await prisma.$disconnect();
    }
}
export const createUser = async ({username,firstname,lastname,password}:SignUser):Promise<SignUser|null>=>{
    try {
        await prisma.$connect();
        const user = await prisma.user.create({
            data:{
                username,
                firstname,
                lastname,
                password
            }
        })
        return user;
    } catch (error) {
        return null
    }finally{
        await prisma.$disconnect();
    }
}
export const findUser = async (username:string,password:string):Promise<SignUser|null>=>{
    try {
        await prisma.$connect();
        const user = await prisma.user.findUnique({
            where:{
                username,
                password
            }
        })
        return user
    } catch (error) {
        return null
    }finally{
        await prisma.$disconnect();
    }
}