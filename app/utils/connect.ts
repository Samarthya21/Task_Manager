import {PrismaClient} from "@prisma/client";

let prisma: PrismaClient;
declare const global: {
  prisma?: any; // Adjust the type according to your PrismaClient type
};

if(process.env.NODE_ENV === 'production'){
    prisma= new PrismaClient();
}
else{
    if(!global.prisma){
        global.prisma= new PrismaClient();
    }
    else{
        prisma= global.prisma;
    }
}

export default prisma;
