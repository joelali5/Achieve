import NextAuth from "next-auth"
import GoogleProvoder from "next-auth/providers/google"
import {PrismaAdapter} from "@auth/Prisma-adapter"
import {prisma} from "@"

const handler = NextAuth({
    providers: []
  
})

export { handler as GET, handler as POST }