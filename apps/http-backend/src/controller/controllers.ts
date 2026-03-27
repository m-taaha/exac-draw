import { Request, Response } from "express"
import { SigninSchema, SignupSchema } from "@repo/common";
import bcrypt from "bcryptjs";
import { prisma } from "@repo/db";


interface SignupInput {
    name: string;
    email: string;
    password: string
}



//signUP
export const userSingUp = async (req: Request, res: Response) => {
    
    try{

        const result = SignupSchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({
          message: "Invalid input",
          errors: result.error.issues,
        });
      }


      const {name, email, password} = result.data;

    //   extinguish user
      const existingUser = await prisma.user.findUnique({
        where: {email}
      });

      if(existingUser) {
        return res.status(400).json({
            message: "User already exists"
        })
      }

        const hashedPassword = await  bcrypt.hash(password, 10);


         const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })

        return res.status(201).json({
            message: "User Signed successfully.",
            user : {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
            }
        })

    } catch (error) {
        console.log(`Server Error`, error)
        return res.status(500).json({
            message:  "Internal Server Error"
        })
    }
    

}

export const userSingIn = () => {
    
}
