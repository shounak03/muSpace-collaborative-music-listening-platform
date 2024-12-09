
'use client'
import { CreateSpace } from "@/components/create-space-component";
import { JoinSpace } from "@/components/join-space";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";

interface SpaceData{
    space:{
        name:string,
        description:string,
        hostId:string
    }
}
interface SpaceId{
    spaceId:string
}



export default function Dashboard() {
    const [spaceId , setSpaceId] = useState<SpaceId>();

    const [space, setSpace] = useState(false)
    const [spacedata, setSpacedata] = useState<SpaceData>()
    
    const fetchSpace = async()=>{
        const res = await fetch('api/getSpaceId')
        const sp = await res.json()
        console.log(sp);
        
        if(sp.success === true){
            setSpaceId(sp)
            setSpace(true);
            console.log(sp);
            
        }
        
    }
    const fetchSpaceData = async()=>{
        const res = await fetch(`/api/spaces/?spaceId=${spaceId?.spaceId}`)
        const data = await res.json()
        console.log(data)
        if(data.success === true){
            setSpacedata(data)
        }
    }

    useEffect(()=>{
        fetchSpace()
    },[])
    useEffect(()=>{
        fetchSpaceData()
    },[space])
    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
            <div className="flex-1 flex flex-col items-center p-4 md:p-6">
                <main className="w-full max-w-4xl space-y-6">
                    <h1 className="text-3xl font-bold capitalize text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                        Welcome back
                    </h1>
                    <section className="grid gap-4 md:grid-cols-2">
                        <CreateSpace />
                        <JoinSpace />
                    </section>
                </main>
            <div className="mt-8 justify-start items-start">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                    Existing Spaces
                </h1>
                { space && 
                
                    <section className="flex items-start">
                    
                        <Card className="bg-gray-800 border-gray-700 mt-6 justify-start">
                            <CardHeader>
                                <CardTitle className="text-purple-400 text-2xl font-bold">{spacedata?.space?.name}</CardTitle>
                                <CardDescription className="text-gray-400 text-xl">{spacedata?.space?.description}</CardDescription>

                            </CardHeader>
                            <CardContent>
                                <Link href={`/spaces/${spaceId?.spaceId}`}>
                                    <Button className="w-full bg-purple-600 text-white hover:bg-purple-700">
                                        Join space
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                    </section>}
                { space === false && 

                    <section className="flex items-start mt-6">
                        <h1 className="text-3xl font-bold text-white">No Existing spaces</h1>
                    </section>
                }
            </div>
            </div>
                
            
        </div>
    )
}


