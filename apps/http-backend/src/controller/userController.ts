import { Request, Response } from "express";
import { SigninSchema, SignupSchema } from "@repo/common";
import bcrypt from "bcryptjs";
import { prisma } from "@repo/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET_KEY;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET_KEY is not defined in evironment variable");
}

// interface SignupInput {
//     name: string;
//     email: string;
//     password: string
// }

// interface SigninInput {
//     email: string;
//     password: string;
// }

//signUP
export const userSignUp = async (req: Request, res: Response) => {
  try {
    const result = SignupSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: result.error.issues,
      });
    }

    const { name, email, password } = result.data;

    //   check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      message: "User Signed successfully.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.log(`Server Error`, error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const userSingnIn = async (req: Request, res: Response) => {
  try {
    const result = SigninSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid Input",
        errors: result.error.issues,
      });
    }

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    //  compare password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // sign jwt
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "User Signed in successfully",
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("Sign in error", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};



// signOut
export const signOut = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Signed out" });
};