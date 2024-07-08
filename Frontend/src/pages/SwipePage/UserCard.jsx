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
import { Info, InfoIcon, ArrowDown } from "lucide-react"
const UserCard = ({card, onDrag, onDragEnd, ref}) => {
    const api_url = import.meta.env.VITE_API_URL
    const [view, setView] = useState('card')

    return (
        <>
        {
            view === 'card' ?
            <div id={card.id} data={card} draggable='true' onDrag={(e)=>onDrag(e)} onDragEnd={(e)=>onDragEnd(e)} className=" absolute cursor-grab z-0 shadow-xl bg-black rounded-xl">
                <Carousel className='h-full w-full bg-black rounded-2xl' opts={({loop: false, watchDrag: false})}>
                <CarouselContent className='rounded-2xl '>
                    {
                        card.images.map((image, index) => {
                            return <CarouselItem key={index} className='h-[600px] rounded-xl '>
                                <img className="w-[400px] h-[600px] rounded-xl pointer-events-none overflow-auto" src={api_url+'/user/serv/get-media-file?media_id='+image}/>
                                
                                </CarouselItem>
                        
                        })
                    }

                
                </CarouselContent>
                <CarouselPrevious variant='' className=' w-24 h-full rounded-none mr-auto ml-12 bg-transparent  hover:bg-transparent hover:border-0' />
                <CarouselNext variant='' className=' bg-transparent w-24 h-full rounded-none ml-auto mr-12 hover:bg-transparent hover:border-0' />
                <div className="absolute bg-black bg-opacity-20 h-fit bottom-0 left-0 w-full text-left">
                    <div>
                    <Label className='text-white text-4xl ml-2 font-bold'>{card.name}</Label><Label className='text-white text-4xl ml-2'>{card.age}</Label>
                    </div>
                    <p className="text-white text-lg ml-2 mr-2 line-clamp-2">{card.bio}</p>
                    <Button variant='outline' onClick={()=>setView('preview')} className='absolute top-1 right-1 rounded-full w-8 h-8'><InfoIcon className="absolute text-black"/></Button>
                </div>
                </Carousel>
                <div className="flex rounded-2xl flex-col bottom-0 left-0 w-full rounded-b-lg bg-green h-24 bg-black text-left z-1 ">

                </div>

                </div>
            :

            <div className="absolute w-[400px] h-[700px] flex flex-col rounded-xl bg-white text-left shadow-xl  " >

                <div id='preview'  className="overflow-y-scroll rounded-xl pb-20 [scrollbar-width:none]">

                    <Carousel className='h-[500px] w-full bg-transparent ' opts={({loop: false})}>
                            <CarouselContent className=' '>
                                {
                                    card.images.map((image, index) => {
                                        return <CarouselItem key={index} className='h-[600px] '><img className="w-[600px] h-[500px]  pointer-events-none overflow-auto" src={api_url+'/user/serv/get-media-file?media_id='+image}></img>  </CarouselItem>
                                    
                                    })
                                }
                                
                            </CarouselContent>
                            <CarouselPrevious variant='' className=' w-24 h-full rounded-none mr-auto ml-12 bg-transparent  hover:bg-transparent hover:border-0' />
                            <CarouselNext variant='' className=' bg-transparent w-24 h-full rounded-none ml-auto mr-12 hover:bg-transparent hover:border-0' />
                            <Button variant='outline' onClick={()=>setView('card')} className='absolute bottom-1 right-1 rounded-full gradiant-bg w-8 h-8'><ArrowDown className="absolute  text-black"/></Button>
                
                    </Carousel>

                    <div className="p-2 space-y-6">
                                

                        <div className="border-b pb-2 w-full border-gray-400">
                            <Label className='text-5xl font-semibold font-outline-4'>{card.name}</Label>

                            <Label className='text-5xl font-semibold font-outline-4 ml-4'>{card.age}</Label>
                        </div>


                        <p className='text-lg'> 

                            {card.bio}

                        </p>


                        <div className="border-b pb-6 w-full border-gray-400">
                                <Label className='text-xl font-semibold'>Looking for</Label> 
                            <div className="mt-2">
                            <Label className='text-xl border-2 border-gray-600 rounded-3xl pl-3 pr-3 pt-1 pb-1'>{card.goal}</Label>  
                            </div>
                        </div>


                        <div className="border-b pb-6 w-full border-gray-400">
                                <Label className='text-xl font-semibold'>Basics</Label> 
                            <div className="mt-2">
                            <Label className='text-xl border-2 border-gray-600 rounded-3xl pl-3 pr-3 pt-1 pb-1'>{card.gender}</Label>  
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        }
        



        
        </>

    );
}

export default UserCard;