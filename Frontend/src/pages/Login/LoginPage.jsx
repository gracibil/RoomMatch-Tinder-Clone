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
import { useEffect, useLayoutEffect } from "react";


const LoginPage = () => {
    const navigate = useNavigate()
    const authState = useAuth()

    const FormSchema = z.object({
        email: z.string().email({
          message: "Must be a valid e-mail adress"
        }),
        password: z.string().min(8, {
            message: "Password must be at least 8 characters."
          })
      })


    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
        email: "",
        password: "",
        }
    })


    const onSubmit = async (data) =>{
        console.log('email: ', data.email)
        console.log('password:', data.password)
        const login = await authState.loginAction({email: data.email, password: data.password}) 
    }
    
    useLayoutEffect(()=>{
        const checkRefresh = async ()=>{
          await  authState.authenticateToken()
        }
        checkRefresh()
        console.log('auto log in')
        
    },[])

    useEffect(() => {
        if (authState.token){
            console.log('navigating to home')
            navigate('/Loading')
        }
    }, [authState.token])   

    return (
        <div className="flex w-[100vw] h-[100vh] gradiant-bg">

        <div className="flex flex-col w-1/3 h-[420px] mt-[15vh] ml-auto mr-auto rounded-sm  border bg-white">
            <h1 className="mt-2">Login</h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 mt-6 self-center space-y-6">
                    <FormField
                    control={form.control}
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
                    control={form.control}
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
                    <div className="flex flex-col ">
                        <Button variant='outline' className='self-center w-32' type="submit">Login</Button>
                        <Button variant='outline' className='self-center w-32 mt-6' onClick={()=>navigate('/register')}>Register</Button>
                    </div>

                </form>
                </Form>


            
        </div>
        
        </div>
    );
}

export default LoginPage;