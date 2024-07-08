import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { useUserData } from "@/context/User";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Input } from "@/components/ui/input";
import { ImageEditCard, ImageAddCard } from "./ImageCards";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    } from "@/components/ui/form"

const EditProfile = ({form, onSubmit}) => {
    const [imagesLength, setImagesLength] = useState(0)
    const userData = useUserData()
    const user = userData.userData
    const [loading, setLoading] = useState(false)
    
    const submitData = (data) => {
        const res = onSubmit(data)
        if(res === true){
            setLoading(false)
        }
    }

    useEffect(() => {
        setImagesLength(user.images.length)
    },[user.images])

    return (
        <div id='edit-tab' hidden={false} className=" bg-gray-100 overflow-y-scroll rounded-xl h-[700px] p-1 pt-4 [scrollbar-width:none] space-y-5 pb-20">

            <div id='img-grid' className="grid grid-cols-3 grid-rows-3">

            {
                user.images.map((image, index) => {
                    return <ImageEditCard key={index} imageId={image}/>
                })

            }

            {
                Array(9 - imagesLength).fill().map((_, index) => {
                    return <ImageAddCard key={index}/>
                })
            }
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(submitData)} className="w-full mt-6 self-center space-y-6">

                    <div>
                    <Label className='text-xl font-semibold'>{("About " + user.name).toUpperCase()}</Label>  
                    </div>

                    <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <AutosizeTextarea className="w-full text-black mt-6 mb-6 p-4 rounded-lg" placeholder="Tell us about yourself" {...field}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <div>
                        <Label className='text-xl font-semibold'>DATE OF BIRTH</Label>
                    </div>

                    <FormField
                    control={form.control}
                    name="birthdate"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Input type='date' {...field}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <div>
                        <Label className='text-xl font-semibold'>HOUSING GOALS</Label>
                    </div>

                    <FormField
                    control={form.control}
                    name="goal"
                    render={({ field }) => (
                        <FormItem>
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

                    <div>
                        <Label className='text-xl font-semibold'>GENDER</Label>
                    </div>

                    <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                        <FormItem>
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

                <div className='absolute flex bottom-0 w-full left-0 text-xl rounded-2xl'>
                    <Button className=' text-xl rounded-2xl p-6 gradiant-bg ml-auto mr-auto mb-4' variant='ghost' type='submit'>
                        {
                            loading ? <div className="loader"/> : <></>
                        }
                        Save
                    </Button>
                </div>

                </form>
                </Form>
        </div>
    );
}


export default EditProfile;