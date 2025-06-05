import { useUser } from "@clerk/clerk-react"
import { db } from "./prisma";

const { user } = useUser();
export const checkUser = async () => {
    if (!user) {
        return null;
    }


    try {

        const loggedInUser = await db.user.findUnique({
            where: {
                clerkUserId: user.id,
            },

        });


        if (loggedInUser) {
            return loggedInUser;
        }


        const newUser = await db.user.create({
            data: {
                clerkUserId: user.id,
                name: `${user.firstName} ${user.lastName}`,
                imageUrl: user.imageUrl,
                email: user.emailAddresses[0].emailAddress
            }
        })

        return newUser;
    } catch (error) {
        console.log(error.message);
    }
}