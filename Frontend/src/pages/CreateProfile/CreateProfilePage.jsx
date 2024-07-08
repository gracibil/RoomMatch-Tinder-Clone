import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/Auth";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import FormImageCard from "@/components/image-card";
import { PostRequestAuthorizedFormData } from "@/services/requests/requests";
import { useEffect } from "react";
import { useUserData } from "@/context/User";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

const CreateProfilePage = () => {
    const navigate = useNavigate()
    const authState = useAuth()
    const userData = useUserData()
    
      const FormSchemaProfile = z.object({
        name: z.string().max(12, 'Name must be shorter than 12 characters').min(2, {
            message: "Name must be at least 2 characters."
        }),
        bio : z.string().max(160,"Your bio must be between 20 and 160 characters.").min(20, {
            message: "Your bio must be between 20 and 160 characters."
        }),
        file: z
        .instanceof(FileList)
        .refine((file) => file?.length == 1, 'Picture is required'),
        birthdate: z.string().refine((birthdate) => (new Date().getFullYear() - new Date(birthdate).getFullYear()) >= 18,{
            message: "You must be at least 18 years old to create a profile."
        }),
        goal: z.string(),
        gender: z.string()
      })



    const formProfile = useForm({
        resolver: zodResolver(FormSchemaProfile),
        defaultValues: {
        name: "",
        bio: "",
        file: "",
        birthdate: "",
        goal: "",
        gender: "",
        }
    })

    const fileRef = formProfile.register("file")

    const onSubmitProfile = async (data) =>{
        const form = new FormData()
        form.append('name', data.name)
        form.append('bio', data.bio)
        form.append('file', data.file[0])
        form.append('birthdate', data.birthdate)
        form.append('goal', data.goal)
        form.append('gender',data.gender)
        asyncCreateProfile(form)
        
    }


    const asyncCreateProfile = async (data)=>{
        const res = await PostRequestAuthorizedFormData({endpoint:'/user/profile/', data:data, token:authState.token, auth:authState})
        await userData.getUserData()
        console.log(res)
        navigate('/Loading')
    }

    const ageWatcher = formProfile.watch('age')    

    useEffect(() => {
        console.log(ageWatcher)
    }, [ageWatcher])

    return (
        <div className="flex w-[100vw] h-[100vh] gradiant-bg">

        <div className="flex flex-col w-1/3 h-4/5  mt-[10vh] ml-auto mr-auto overflow-y-scroll rounded-2xl [scrollbar-width:thin]  border bg-white">
            <h1 className="mt-2">Create profile</h1>

            <Form {...formProfile}>
                <form onSubmit={formProfile.handleSubmit(onSubmitProfile)} className="w-2/3 mt-6 self-center space-y-6 pb-12">
                    <FormField
                    control={formProfile.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className=''>Display name</FormLabel>
                        <FormControl>             
                            <Input type='Name' placeholder="Name" {...field} />                             
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />


                    <FormField
                    control={formProfile.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Tell us about yourself...</FormLabel>
                        <FormControl>
                            <AutosizeTextarea type='Bio' placeholder="Bio" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />


                    <FormField
                    control={formProfile.control}
                    name="birthdate"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Your birthdate</FormLabel>
                        <FormControl>
                            <Input type='date' {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />


                    <FormField
                    control={formProfile.control}
                    name="gender"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Your Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Gender" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Man">Man</SelectItem>
                                <SelectItem value="Woman">Woman</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />


                    <FormField
                    control={formProfile.control}
                    name="goal"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>What are you looking for?</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Looking for"  />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Roommates">Roommates</SelectItem>
                                <SelectItem value="Housing">Housing</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />


                    <FormField
                    control={formProfile.control}
                    name="file"
                    render={({ field }) => (
                        <FormItem className='h-[400px]'>
                        <FormLabel>Profile Picture</FormLabel>
                        <FormControl>
                            <>
                            <FormImageCard fileRef={fileRef}/>
                            </>
                            
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <Button variant='outline' className='self-center w-32 gradiant-bg hover:scale-105 hover:text-white' type='submit' >Create Account</Button>
                </form>
                </Form>
            
        </div>
        </div>

    );
}

export default CreateProfilePage;