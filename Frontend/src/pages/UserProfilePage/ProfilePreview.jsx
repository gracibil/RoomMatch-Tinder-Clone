import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import { useRef, useState } from "react"
import { Label } from "@/components/ui/label"
import { useUserData } from "@/context/User"

const ProfilePreview = ({form}) => {
    const userData = useUserData()
    const user = userData.userData
    const api_url = import.meta.env.VITE_API_URL

    const calculateAge = ()=>{
        const today = new Date();
        const birthDate = new Date(form.getValues('birthdate'));
        var age_now = today.getFullYear() - birthDate.getFullYear();
        const month_now = today.getMonth() - birthDate.getMonth();
        if (month_now < 0 || (month_now === 0 && today.getDate() < birthDate.getDate())) 
        {
            age_now--;
        }
        return age_now;
    }

    return (
        <>
        
        <div className=" absolute cursor-grab z-0">
                <Carousel className='h-full w-full bg-black rounded-2xl' opts={({loop: false, watchDrag: false})}>
                <CarouselContent className='rounded-2xl '>
                    {
                        user.images.map((image, index) => {
                            return <CarouselItem key={index} className='h-[700px] rounded-2xl '><img className="w-[400px] h-[650px] rounded-2xl pointer-events-none overflow-auto" src={api_url+'/user/serv/get-media-file?media_id='+image}></img>  </CarouselItem>
                        
                        })
                    }
                </CarouselContent>
                <CarouselPrevious variant='' className=' w-24 h-full rounded-none mr-auto ml-12 bg-transparent  hover:bg-transparent hover:border-0' />
                <CarouselNext variant='' className=' bg-transparent w-24 h-full rounded-none ml-auto mr-12 hover:bg-transparent hover:border-0' />
                </Carousel>
                    <div className="absolute flex flex-col bottom-0 left-0 w-full rounded-b-lg bg-green h-48 bg-black bg-opacity-40 text-left z-1 ">
                    <div>
                        <Label className='text-white text-4xl ml-2 font-bold'>{user.name}</Label><Label className='text-white text-4xl ml-2'>{calculateAge()}</Label>
                    </div>
                        <p className="text-white text-lg ml-2 mr-2 line-clamp-2">{form.getValues("bio")}</p>
                    </div>

        </div>
        </>

    );
}

export default ProfilePreview;