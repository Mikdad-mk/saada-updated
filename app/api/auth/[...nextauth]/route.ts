import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { compare } from "bcryptjs";
import type { SessionStrategy } from "next-auth";

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
        if (!credentials) return null;
        const client = await clientPromise;
        const users = client.db().collection("users");
        const user = await users.findOne({ email: credentials.email });
        if (user && (await compare(credentials.password, user.password))) {
          return { id: user._id.toString(), email: user.email, name: user.name };
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" as SessionStrategy },
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/login", // Error code passed in query string as ?error=
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 