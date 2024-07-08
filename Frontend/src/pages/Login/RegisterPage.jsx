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
import { useState } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
import FormImageCard from "@/components/image-card";
import { PostRequest, PostRequestAuthorizedFormData } from "@/services/requests/requests";
import Cookies from 'js-cookie';
const RegisterPage = () => {
    const navigate = useNavigate()
    const authState = useAuth()
    const [registerProgress, setRegisterProgress] = useState(0)
    

    const FormSchemaAccount = z.object({
        email: z.string().email({
          message: "Must be a valid e-mail adress"
        }),
        password: z.string().min(8, {
            message: "Password must be at least 8 characters."
          }),
        password_2: z.string().refine((password_2) => (password_2 !== formAccount.password), "Passwords must match")

      })


    const formAccount = useForm({
        resolver: zodResolver(FormSchemaAccount),
        defaultValues: {
        email: "",
        password: "",
        password_2: "",
        }
    })


    const onSubmitAccount = async (data) =>{
        asyncCreateAccount(data)
    }


    const asyncCreateAccount = async (form)=>{
        const formData = {
            email: form.email,
            password1: form.password,
            password2: form.password_2
        }

        console.log('here the form')
        console.log(formData)
        const res = await PostRequest({endpoint:'/dj-rest-auth/registration/', data:formData})
        console.log(res)
        if(res.access){
            const login = await authState.loginAction({email:form.email, password:form.password})
            console.log(login)
            if(login){
                navigate('/CreateProfile')
        }
        }


        

        return res

    }



    return (
        <div className="flex w-[100vw] h-[100vh] gradiant-bg">


        <div className="flex flex-col w-1/3 h-[460px] mt-[15vh] ml-auto mr-auto rounded-sm bg-white  border">
            <h1 className="mt-2">Register</h1>

            <Form {...formAccount}>
                <form onSubmit={formAccount.handleSubmit(onSubmitAccount)} className="w-2/3 mt-6 self-center space-y-6">
                    <FormField
                    control={formAccount.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className=''>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={formAccount.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input type='password' placeholder="Password" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={formAccount.control}
                    name="password_2"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                            <Input type='password' placeholder="Password" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button variant='outline' className='self-center w-32' type='submit'>Next</Button>
                </form>
                </Form>
            
        </div>
        </div>

    );
}

export default RegisterPage;