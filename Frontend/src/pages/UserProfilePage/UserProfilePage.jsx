import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import {Button} from "@/components/ui/button"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
import EditProfile from "./EditProfile"
import ProfilePreview from "./ProfilePreview"
import { useUserData } from "@/context/User"
import { useAuth } from "@/context/Auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { PatchRequestAuthorizedFormData } from "@/services/requests/requests"

const UserProfilePage = () =>{
    const [mode, setMode] = useState('preview')
    const [tabValue, setTabValue] = useState(0)
    const userData = useUserData()
    const user = userData.userData
    const auth = useAuth()
    const api_url = import.meta.env.VITE_API_URL

    const FormSchemaProfile = z.object({
        bio : z.string().max(160,"Your bio must be between 20 and 160 characters.").min(20, {
            message: "Your bio must be between 20 and 160 characters."
        }),
        birthdate: z.string().refine((age) => (new Date().getFullYear() - new Date(age).getFullYear()) >= 18,{
            message: "You must be at least 18 years old !"
        }),
        goal: z.string(),
        gender: z.string()
      })


    const formProfile = useForm({
        resolver: zodResolver(FormSchemaProfile),
        defaultValues: {
        bio: user.bio,
        birthdate: user.birthdate,
        goal: user.goal,
        gender: user.gender,
        }
    })


    const onSubmitProfile = async (data) => {
        console.log(data)
        const formData = new FormData()
        for (const key in data) {
            formData.append(key, data[key])
        }
        formData.append('edit_info', true)
        console.log(formData)
        const res = await PatchRequestAuthorizedFormData({endpoint:'/user/profile/', data:formData, token:auth.token, auth:auth})
        if(res.res === 'ok'){
            await userData.getUserData()
            setMode('preview')
            return true
        }else{
            return false
        }


    }

    useEffect(() => {
        formProfile.reset({
            bio: user.bio,
            birthdate: user.birthdate,
            goal: user.goal,
            gender:user.gender})
    },[user])


    return (
        <div className="flex w-full h-full bg-slate-100 items-center justify-center  ">
            <div className="absolute w-[400px] h-[750px] flex flex-col rounded-xl bg-white text-left shadow-2xl  " >


            <div id='preview' hidden={mode!=='preview'} className="overflow-y-scroll rounded-xl pb-20 [scrollbar-width:none]">
            <Carousel className='h-[600px] w-full bg-transparent ' opts={({loop: false})}>
                    <CarouselContent className=' '>
                        {
                            user.images.map((image, index) => {
                                return <CarouselItem key={index} className='h-[670px] '><img className="w-[600px] h-[600px]  pointer-events-none overflow-auto" src={api_url+'/user/serv/get-media-file?media_id='+image}></img>  </CarouselItem>
                            
                            })
                        }
                        
                    </CarouselContent>
                    <CarouselPrevious variant='' className=' w-24 h-full rounded-none mr-auto ml-12 bg-transparent  hover:bg-transparent hover:border-0' />
                    <CarouselNext variant='' className=' bg-transparent w-24 h-full rounded-none ml-auto mr-12 hover:bg-transparent hover:border-0' />
            </Carousel>
            <div className="p-2 space-y-6">

                <div className="border-b pb-2 w-full border-gray-400">
                    <Label className='text-5xl font-semibold font-outline-4'>{user.name}</Label>

                    <Label className='text-5xl font-semibold font-outline-4 ml-4'>{user.age}</Label>
                </div>



                <p className='text-lg'> 

                    {user.bio}

                </p>

                <div className="border-b pb-6 w-full border-gray-400">
                        <Label className='text-xl font-semibold'>Looking for</Label> 
                    <div className="mt-2">
                    <Label className='text-xl border-2 border-gray-600 rounded-3xl pl-3 pr-3 pt-1 pb-1'>{user.goal}</Label>  
                    </div>
                </div>

                <div className="border-b pb-6 w-full border-gray-400">
                        <Label className='text-xl font-semibold'>Basics</Label> 
                    <div className="mt-2">
                    <Label className='text-xl border-2 border-gray-600 rounded-3xl pl-3 pr-3 pt-1 pb-1'>{user.gender}</Label>  
                    </div>
                </div>


            </div>


            <Button className='absolute bottom-4 left-32 text-xl rounded-2xl p-6 opacity-85'
                    variant='ghost' 
                    onClick={()=>setMode('edit')}>Edit Info</Button>

            </div>

            <div id='edit' hidden={mode!=='edit'} className="rounded-2xl">

            <Tabs defaultValue={tabValue} className="w-full">
                <TabsList className='w-full p-0 m-0'>
                    <TabsTrigger onClick={()=>setTabValue(0)} className='w-1/2 text-xl' value={0}><p className={tabValue === 0? "gradiant-text" : ' '}>Edit</p></TabsTrigger>
                    <TabsTrigger onClick={()=>setTabValue(1)} className='w-1/2 text-xl' value={1}><p className={tabValue === 1? "gradiant-text" : ' '}>Preview</p></TabsTrigger>

                </TabsList>

                <TabsContent value={0}>

                    <EditProfile form={formProfile} onSubmit={onSubmitProfile}/>
   
                </TabsContent>

                <TabsContent value={1}>
                    <ProfilePreview form={formProfile}/>
                </TabsContent>

            </Tabs>

 

            </div>


        </div>
        </div>
    )
}

export default UserProfilePage;