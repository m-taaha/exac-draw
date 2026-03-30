import { CreateRoomSchema } from "@repo/common";
import { prisma } from "@repo/db";
import { Request, Response } from "express";


export const createRoom = async (req: Request, res: Response) => {
    try {
            const result = CreateRoomSchema.safeParse(req.body);

    if(!result.success) {
        return res.status(400).json({
            message: "Invalid Input"
        })
    }

    const {slug} = result.data;

    const existingRoom = await prisma.room.findUnique({
        where: {
            slug: slug
        }
    });

    if(existingRoom) {
        return res.status(400).json({
            message: "Room already exists"
        })
    }



    const newRoom = await prisma.room.create({
        data: {
            slug,
            adminId: req.userId
        }
    })

     return res.status(201).json({
       message: "Room created successfully",
       room: {
         roomId: newRoom.id,
         roomAdmin: newRoom.adminId,
         slug: newRoom.slug,
       },
     })

    } catch (error) {
        console.log("Server Error", error);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}


export const getShapes = async (req: Request, res: Response) => {
   try{
     const roomId = Number(req.params.roomId);

    const chats = await prisma.chat.findMany({
        where: {
            roomId
        }
    })

    const shapes = chats.map(
        chat => JSON.parse(chat.message)
    )

    res.json({shapes})
   } catch(error) {
    console.log("Server Error", error)
    res.status(500).json({
        message: "Internal Server Error"
    })
   }

}