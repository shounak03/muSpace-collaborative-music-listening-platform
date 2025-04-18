// 'use server'
import { LogOut, Share2 } from 'lucide-react';
import React, { useState } from 'react'
import { Button } from './ui/button';
import { toast } from 'sonner';
import { redirect, useRouter } from 'next/navigation';


interface SpaceData {
    spaceName?: string;
    spaceDesc?: string;
    isCreator: boolean
    spaceId: string
}


export const SpaceHeader = ({ data }: { data?: SpaceData }) => {

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const router = useRouter();
    // console.log("data",data?.isCreator)
    
    function shareVideo() {
        const shareableLink = `${window.location.hostname}/spaces/${data?.spaceId}`;
        navigator.clipboard.writeText(shareableLink)
            .then(() => toast.success('Link copied to clipboard!'))
            .catch((err) => {
                console.error('Could not copy text: ', err);
                toast.error('Failed to copy link. Please try again.');
            });
    }

    async function endStream() {
        try {
            const spaceId = data?.spaceId;
            const res = await fetch(`/api/streams`, {
                method: "DELETE",
                body: JSON.stringify({ spaceId }),
            });

            if (res.ok) {
                toast.success("Stream ended successfully");
                router.refresh()
                router.push('/ThanksForWatching')

            } else {
                throw new Error('Failed to end stream');
            }
        } catch (error) {
            console.error("Error ending stream:", error);
            toast.error("Failed to end stream");
        }
    }

    function handleEndSpaceClick() {
        setShowConfirmModal(true);
    }

    function handleConfirmEndSpace() {
        setShowConfirmModal(false);
        endStream();
    }

    function handleCancelEndSpace() {
        setShowConfirmModal(false);
    }

    return (
        <div className="flex justify-between items-center">
            <div className="space-y-2">
                <h1 className="text-6xl capitalize font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                    {data?.spaceName}
                </h1>
                <p className="text-gray-400 text-3xl">{data?.spaceDesc}</p>
            </div>
            <div className="flex items-center space-x-4 flex-col-2">
                <Button
                    variant="outline"
                    className="text-purple-400 border-purple-400 hover:bg-purple-400 hover:text-gray-900"
                    onClick={shareVideo}
                >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                </Button>
                {data?.isCreator && (
                    <Button
                        onClick={handleEndSpaceClick}
                        variant="outline"
                        className="text-red-400 border-red-400 hover:bg-red-400 hover:text-gray-900"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        End Space
                    </Button>
                )}
                {!data?.isCreator && (
                    <Button
                        variant="outline"
                        className="text-red-400 border-red-400 hover:bg-red-400 hover:text-gray-900"
                        onClick={()=>{
                            router.push('/dashboard')
                        }}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Leave Space
                    </Button>
                )}
            </div>

            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-md shadow-md text-center">
                        <h2 className="text-xl font-bold text-black">Are you sure you want to end the space?</h2>
                        <div className="mt-4 flex justify-center space-x-4">
                            <Button
                                onClick={handleConfirmEndSpace}
                                className="bg-red-600 text-white hover:bg-red-700"
                            >
                                Yes, End Space
                            </Button>
                            <Button
                                onClick={handleCancelEndSpace}
                                className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

