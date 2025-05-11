import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/utils/db";
import User from "@/models/userModel";

export const authOptions = {
    providers: [
        // Google OAuth
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),

        // Credentials (manual email/password signup/login)
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                firstname: { label: "First Name", type: "text" },
                lastname: { label: "Last Name", type: "text" },
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await connectDB();
                console.log("✅ Connected to MongoDB in authorize");

                if (credentials.firstname && credentials.lastname) {
                    // If it's a signup process (has first and last name)
                    const existingUser = await User.findOne({ email: credentials.email });

                    if (existingUser) {
                        throw new Error("User already exists");
                    }

                    // Hash the password
                    const hashedPassword = await bcrypt.hash(credentials.password, 10);

                    // Create a new user in the database
                    const newUser = new User({
                        firstname: credentials.firstname,
                        lastname: credentials.lastname,
                        email: credentials.email,
                        password: hashedPassword,
                    });

                    await newUser.save();

                    return { id: newUser._id, email: newUser.email, name: `${newUser.firstname} ${newUser.lastname}` };
                } else {
                    // Login process (credentials only)
                    const user = await User.findOne({ email: credentials.email });

                    if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
                        throw new Error("Invalid email or password");
                    }

                    return { id: user._id, email: user.email, name: `${user.firstname} ${user.lastname}` };
                }

            },

        }),
    ],
    pages: {
        signIn: "/auth/login",
        newUser: "/auth/signup", // Directs to the signup page for new users
    },
    session: {
        strategy: "jwt", // Use JWT to persist the session
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user, account }) {
            if (account.provider === "google") {
                await connectDB();
                console.log("✅ Connected to MongoDB in Google signIn");

                let existingUser = await User.findOne({ email: user.email });

                if (!existingUser) {
                    // Create a new user in MongoDB from Google profile
                    existingUser = await User.create({
                        firstname: user.name.split(" ")[0] || "Unknown",
                        lastname: user.name.split(" ")[1] || "",
                        email: user.email,
                        image: user.image,
                        googleId: account.providerAccountId,
                        password: null, // Google users don't need a password
                    });
                }
                // Manually return the user's MongoDB _id
                user.id = existingUser._id.toString();
            }
            return true; // Allow the sign-in
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;  // Ensure MongoDB `_id` is stored
                token.name = user.name;
            }
            return token;
        },

        async session({ session, token }) {
            // Fetch updated user details from the database
            await connectDB();
            console.log("✅ Connected to MongoDB in session callback");

            try {
                const dbUser = await User.findById(token.id); // Ensure it's querying `_id`

                if (dbUser) {
                    session.user.id = dbUser._id.toString();
                    session.user.name = `${dbUser.firstname} ${dbUser.lastname}`;
                    session.user.email = dbUser.email;
                    session.user.image = dbUser.image;
                    session.user.googleId = dbUser.googleId;
                } else {
                    session.user.id = token.id;
                    session.user.name = token.name;
                }
            } catch (error) {
                console.log("❌ Error fetching user from DB");
                console.error("Session callback error:", error);
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
