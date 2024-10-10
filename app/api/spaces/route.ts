
import { auth } from '@/auth';
import { spaceSchema } from '@/schema';
import { PrismaClient } from '@prisma/client';

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function POST(request: Request) {

    const session = await auth();
    
    if (!session?.user?.id) {
        return NextResponse.json({ success: false, error: 'User not authenticated' }, { status: 401 });
    }
    try {
        
        const body = await request.json();
        const { name, description, privateKey } = spaceSchema.parse(body)


        

        const space = await prisma.space.create({

            data: {
                name:name,
                description:description,
                privateKey: privateKey,
                hostId:session.user.id,
            },
        });
        const url = `/spaces/${space.id}`; 
        
        const updatedSpace = await prisma.space.update({
            where: {
                id: space.id,
            },
            data: {
                url: url,  
            },
        });

               

        return NextResponse.json({ success: true,message:"space created successfully", updatedSpace }, { status: 201 });
    } catch (error) {
        console.error('Error creating space:', error);
        NextResponse.json({ success: false, error: 'Error creating space' }, { status: 500 });
    }
}


export async function GET(req:NextRequest) {
    // const session = await auth();
    // if (!session?.user?.id) {
    //     return NextResponse.json(
    //       { success: false, message: "You must be logged in to retrieve space information" },
    //       { status: 401 }
    //     );
    //   }
    try {
        const { searchParams } = new URL(req.url);
        const spaceId = searchParams.get('spaceId');

        if(!spaceId){
            return NextResponse.json({ success: false, error: 'spaceId is required' }, { status: 400 });
        }
        
        const space = await prisma.space.findUnique({
            where: {
                id:spaceId
            },
            select: {
                name: true,
                description: true,
            },
        })
        if(!space)
            return NextResponse.json({success:false,message:"space not found",space},{status:404});
        
        
        return NextResponse.json({success:true,message:"space found",space},{status:200});
    } catch (error) {
        console.error('Error creating space:', error);
        NextResponse.json({ success: false, message: 'Error fetching space' }, { status: 500 });
    }
}