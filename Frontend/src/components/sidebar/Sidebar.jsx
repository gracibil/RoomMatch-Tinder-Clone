import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {Label} from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/Auth";
import { useUserData } from "@/context/User";
import { LogOut, GalleryHorizontalEnd } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
const Sidebar = () => {
    const data = useLocation()
    const [selectedUser, setSelectedUser] = useState({id:0})
    const navigate = useNavigate()
    const auth = useAuth()
    const userData = useUserData()
    const user = userData.userData
    const api_url = import.meta.env.VITE_API_URL

    const logOut = () => {
        userData.removeUserData()
        auth.logoutAction()
        
    }

    useEffect(() => {
        if (data.state === null){
            setSelectedUser({id:0})
        }else{
            setSelectedUser(data.state.user)
        }
    },[data.state])
    
    useEffect(() => {
       console.log('matches', user.matches) 
    },[user.matches])   
    return(
        <div className="w-[375px] bg-white border-r border-gray-400">
            <div className='w-full min-w-[375px] h-[80px] flex flex-row gradiant-bg rounded-none'>
            <Button variant='outline' className=' self-center bg-transparent border-0 bg-opacity-50 h-12 w-fit p-2 pl-3 pr-6 rounded-3xl hover:bg-black hover:bg-opacity-60 hover:text-white'onClick={()=>navigate('/User')}>

                <Avatar className='mr-auto'>
                    <AvatarImage src={api_url+'/user/serv/get-media-file?media_id='+user.images[0]} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <p className="ml-3 text-base">{user.name}</p>


            </Button>

            <Button variant='' className=' self-center ml-auto mr-2  bg-black bg-opacity-50 h-10 w-10 rounded-full'onClick={()=>navigate('/Swipe')}>

                <GalleryHorizontalEnd className='text-white absolute'/>
            </Button>

            <Button variant='' className=' self-center mr-2  bg-black bg-opacity-50 h-10 w-10 rounded-full'onClick={()=>logOut()}>

            <LogOut className='text-white absolute w-6 h-6 '/>
            </Button>


                
            
            </div>



            <Tabs defaultValue={0} className="w-full">
                <TabsList className='w-full'>
                    <TabsTrigger className='w-1/2' value={0}>Matches</TabsTrigger>
                    <TabsTrigger className='w-1/2' value={1}>Messages</TabsTrigger>

                </TabsList>

                <TabsContent value={0}>
                {
                    user.matches.length === 0


                    ?   <button className="p-0 rounded-2xl w-[80%] h-[60%]" onClick={()=>navigate('/Swipe')}>
                        <div className="flex flex-col items-center w-full h-full border rounded-2xl p-4 gradiant-bg">
                            <Label className=' text-white text-xl'>Your Matches will appear here </Label>
                            
                            <div className=' bg-transparent self-center mt-12 mb-16  h-16 w-16'>
                                <GalleryHorizontalEnd className='text-white absolute w-20 h-20'/>
                            </div>

                            <Label className=' text-white text-xl'>Start Swiping now !</Label>
                        </div>
                        </button>
                         
                    : <></>
                }

                <div className="grid grid-cols-2 col-span-1">

                    {
                        user.matches.map((match, index) => {
                            return(
                                <Button className='text-left h-48 m-2 rounded-xl p-0' onClick={()=>navigate('/Chat', { state: {user : match}})}>
                    
                                <div className="w-full h-full rounded-xl hover:scale-105 transition-transform">
                                <img className="w-fit h-full rounded-xl" src={api_url+'/user/serv/get-media-file?media_id='+match.images[0]}></img>  
                                <Label className='relative bottom-10 text-3xl text-white text-left font-outline-4 font-bold'>{match.name}</Label>
                                </div>
                            
                                </Button>
                            )
                        })
                    }

                    
                </div>


                    

                </TabsContent>

                <TabsContent className={'overflow-y-scroll max-h-[85vh] [scrollbar-width:none]'} value={1}>

                {
                    user.matches.length === 0


                    ?   <button className="p-0 rounded-2xl w-[80%] h-[60%]" onClick={()=>navigate('/Swipe')}>
                        <div className="flex flex-col items-center w-full h-full border rounded-2xl p-4 gradiant-bg">
                            <Label className=' text-white text-xl'>Your Messages will appear here </Label>
                            
                            <div className=' bg-transparent self-center mt-12 mb-16  h-16 w-16'>
                                <GalleryHorizontalEnd className='text-white absolute w-20 h-20'/>
                            </div>

                            <Label className=' text-white text-xl'>Start Swiping now !</Label>
                        </div>
                        </button>
                         
                    : <></>
                }

                    {
                        user.conversations.map((conv, index) => {
                            const match = user.matches.find(match => match.id === conv.user_id)
                            console.log('match', match)
                            console.log('conv', conv)
                            return(
                                <Button variant='outline' className={selectedUser.id === match.id ? 'userMessageButton-selected flex flex-row pr-0 pt-0 pb-0 ':'userMessageButton flex flex-row pr-0 pt-0 pb-0 ' } onClick={()=>navigate('/Chat', { state: {user : match}})}>
                                
                                <Avatar className=''>
                                     <AvatarImage src={api_url+'/user/serv/get-media-file?media_id='+match.images[0]} />
                                    <AvatarFallback>CN</AvatarFallback>
                                 </Avatar>
                                 <div className="flex flex-col w-4/5 text-left ml-2">
                                 <Label className='text-black text-lg ml-4 cursor-pointer'>{match.name}</Label>
                            
                                 <Label className="truncate text-slate-600 cursor-pointer">{conv.last_message.content}</Label>
                                 </div>
                                 <div className={selectedUser.id === match.id ? "tab-selected h-full ml-auto" :  "tab h-full ml-auto"  }></div>
                                
                                </Button>
                            )
                        })
                    }

                </TabsContent>

            </Tabs>

        </div>
    )
}

export default Sidebar;