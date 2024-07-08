import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import { useRef, useState } from "react"
import { Label } from "@/components/ui/label"
import {Button} from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X } from "lucide-react"
import { useLocation } from "react-router-dom"
import ChatWindow from "@/pages/ChatPage/ChatWindow"
import { DeleteRequestAuthorized } from "@/services/requests/requests"
import { useAuth } from "@/context/Auth"
import { useNavigate } from "react-router-dom"
import { useUserData } from "@/context/User"
const ChatPage = () => {
    const data = useLocation()
    const selectedUser = data.state.user
    const api_url = import.meta.env.VITE_API_URL
    const auth = useAuth()
    const navigate = useNavigate()
    const userData = useUserData()

    const unMatchUser = async () => {
        const data_match = {
            unmatched: selectedUser.id
        }
        const response = await DeleteRequestAuthorized({endpoint:'/user/swipe/', data:data_match, token:auth.token, auth:auth})
        console.log(response)
        userData.getUserData()
        navigate('/Swipe')
        
    }

    console.log(data)
    return (
        <div className="w-full max-w-[100%] max-h-full flex">

        <ChatWindow selectedUser={selectedUser}/>

        <div className="w-1/3 shadow-2xl h-full flex flex-col bg-white text-left overflow-y-scroll [scrollbar-width:none]" >

        <Carousel className='h-[600px] w-full bg-black ' opts={({loop: false})}>
                <CarouselContent className=' '>

                    {
                        selectedUser.images.map((image, index) => (
                            <CarouselItem className='h-[670px] '>
                                <img className="w-[600px] h-[600px]  pointer-events-none overflow-auto" src={api_url+'/user/serv/get-media-file?media_id='+image}></img>
                            </CarouselItem>
                        ))
                    }

                </CarouselContent>
                <CarouselPrevious variant='' className=' w-24 h-full rounded-none mr-auto ml-12 bg-transparent  hover:bg-transparent hover:border-0' />
                <CarouselNext variant='' className=' bg-transparent w-24 h-full rounded-none ml-auto mr-12 hover:bg-transparent hover:border-0' />
        </Carousel>
        <div className="p-2 space-y-6">

        <div className="border-b pb-2 w-full border-gray-400">
            <Label className='text-5xl font-semibold font-outline-4'>{selectedUser.name}</Label>

            <Label className='text-5xl font-semibold font-outline-4 ml-4'>{selectedUser.age}</Label>
        </div>



        <p className='text-lg'> 

            {selectedUser.bio}

        </p>

        <div className="border-b pb-6 w-full border-gray-400">
                <Label className='text-xl font-semibold'>Looking for</Label> 
            <div className="mt-2">
            <Label className='text-xl border-2 border-gray-600 rounded-3xl pl-3 pr-3 pt-1 pb-1'>{selectedUser.goal}</Label>  
            </div>
        </div>

        <div className="border-b pb-6 w-full border-gray-400">
                <Label className='text-xl font-semibold'>Basics</Label> 
            <div className="mt-2">
            <Label className='text-xl border-2 border-gray-600 rounded-3xl pl-3 pr-3 pt-1 pb-1'>{selectedUser.gender}</Label>  
            </div>
        </div>

        <div className=" flex flex-col  items-center">
            <Button variant='outline' className='bg-transparent text-xl text-muted border-none text-black' onClick={()=>unMatchUser()}> Unmatch</Button>
            <p className="">No longer interested? Remove them from your matches</p>
        </div>



        </div>



        

        

        </div>

        </div>
    );
}

export default ChatPage;