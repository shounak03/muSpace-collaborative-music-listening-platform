import NextAuth, { AuthError, CredentialsSignin } from "next-auth"
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./schema";
import GoogleProvider from "next-auth/providers/google"

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { type: "email", label: "Email" },
        password: { type: "password", label: "Password" }
      },
      async authorize(credentials) {
        try {
          const { email, password } = await LoginSchema.parseAsync(credentials);

          if (!email || !password) {
            throw new CredentialsSignin({cause:"Please provide both email and password"});
          }

          const user = await prisma.user.findUnique({
            where: { email: email }
          });

          if (!user) {
            throw new CredentialsSignin({cause:"User not found"});
          }
          if (!user.password) {
            throw new CredentialsSignin({cause:"User not found"});
          }

          const isPasswordValid = await bcrypt.compare(password, user.password );

          if (!isPasswordValid) {
            throw new CredentialsSignin({cause: "Invalid email or password"});
          }

          return { id: user.id, name: user.username, email: user.email };
        } catch (error:any) {
          throw new CredentialsSignin({cause:error.message});
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    signIn: async({ user, account }) => {
      if(account?.provider === 'google') {
        try {
          const  {email, name, id} = user;
          
          if(!email){
            throw new CredentialsSignin({cause:"Email not found"});
          }

          const existingUser = await prisma.user.findUnique({
            where: { email }
          });
      
          
          if (existingUser) 
            await prisma.user.create({
              data: {
                email,
                username:name,
              },
            });
          return true
        } catch (error) {
            throw new AuthError("Error creating User")
        }
        
      }
      if(account?.provider === "credentials")
        return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  secret: process.env.AUTH_SECRET,
});