import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
interface SignUser{
    username : string,
    firstname : string;
    lastname : string,
    password : string
}
interface FindUser{
    firstname : string;
    lastname : string
}
export const checkUser = async (username: string) => {
    try {
        await prisma.$connect();
        const isUser = await prisma.user.findFirst({
            where: {
                username
            }
        });

        if (!isUser) {
            return 'User does not exist';
        }

        return 'User exists';
    } catch (error) {
        console.error('Error checking user:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
};
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
        console.log(user);
        return user;
    } catch (error) {
        console.log(error);
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
export const searchName = async (firstname:string,lastname:string):Promise<FindUser[]|null>=>{
    try {
        await prisma.$connect();
        const res = await prisma.user.findMany({
            where:{
                OR:[
                    {
                        firstname:{
                            startsWith:firstname,
                            mode:'insensitive',
                        }
                    },
                    {
                        lastname:{
                            startsWith:lastname,
                            mode:'insensitive',
                        }
                    }
                ]
            },
            select:{
                firstname:true,
                lastname:true
            }
        })
        return res;
    } catch (error) {
        console.log(error);
        return null;
    }finally{
        await prisma.$disconnect();
    }
}