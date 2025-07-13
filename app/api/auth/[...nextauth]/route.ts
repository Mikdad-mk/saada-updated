import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { compare } from "bcryptjs";
import type { SessionStrategy } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

// Define user roles
export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  MODERATOR = "moderator"
}

// Extend the default session type
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
      image?: string;
    };
  }
  
  interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    image?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
  }
}

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const client = await clientPromise;
          const users = client.db().collection("users");
          
          const user = await users.findOne({ email: credentials.email.toLowerCase() });
          
          if (!user) {
            throw new Error("Invalid email or password");
          }

          const isValidPassword = await compare(credentials.password, user.password);
          
          if (!isValidPassword) {
            throw new Error("Invalid email or password");
          }

          // Check if user is active
          if (user.status === "inactive") {
            throw new Error("Account is deactivated. Please contact support.");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role || UserRole.USER,
            image: user.image,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Handle redirects based on user role
      if (url.startsWith(baseUrl)) {
        return url;
      } else if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      return baseUrl;
    },
  },
  session: { 
    strategy: "jwt" as SessionStrategy,
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // 1 hour
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/login",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/new-user",
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-here-change-in-production",
  debug: process.env.NODE_ENV === "development",
  events: {
    async signIn(message: any) {
      // Log successful sign-ins
      console.log(`User ${message.user.email} signed in successfully`);
    },
    async signOut(message: any) {
      // Log sign-outs
      console.log(`User signed out`);
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 