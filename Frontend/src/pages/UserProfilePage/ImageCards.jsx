import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Trash, PlusIcon } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { PatchRequestAuthorizedFormData } from "@/services/requests/requests";
import { useAuth } from "@/context/Auth";
import { useUserData } from "@/context/User";

const ImageEditCard= ({imageId}) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const api_url = import.meta.env.VITE_API_URL
    const dialogCloseRef = useRef(null)
    const auth = useAuth()
    const userData = useUserData()

    const deleteImage = async ()=>{
        setLoading(true)
        setError(false)
        const token = auth.token
        const form = new FormData()
        form.append('remove_img', imageId)
        const response = await PatchRequestAuthorizedFormData({endpoint:'/user/profile/', data:form, token:token, auth:auth})
        if(response.res === 'ok'){
            console.log(response)
            await userData.getUserData()
            console.log('awaited user data')
            setLoading(false)
            console.log('closing dialog')
            dialogCloseRef.current.click()
        }else{
            setError(true)
            setLoading(false)
        }

    }

    return (
            <Dialog>
                <DialogTrigger className="relative w-[95%] h-[200px] p-0 ml-1 mb-1">
                    <img className=" object-cover w-full h-full rounded-lg" src={api_url+'/user/serv/get-media-file?media_id='+imageId}/>
                    <Button variant='outline' className=' gradiant-bg rounded-full w-10 h-10 12 absolute bottom-0 right-0'><Trash className="absolute h-4 w-6"/></Button>
                </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Delete Image</DialogTitle>
                <DialogDescription>
                    Are you sure you want to remove this image?
                </DialogDescription>
                    <Button className='gradiant-bg text-black' disabled={loading} onClick={()=>deleteImage()}> <div hidden={!loading} className="loader"></div>Remove Image</Button>
                    {
                        error ? <h2 className="text-destructive">Error deleting image!</h2> : <></>
                    }
                    <DialogClose disabled={loading} ref={dialogCloseRef}>
                       Cancel
                    </DialogClose>
                </DialogHeader>
            </DialogContent>
            </Dialog>
)};

const ImageAddCard= () => {
    const fileRef = useRef(null)
    const dialogCloseRef = useRef(null)
    const [file, setFile] = useState(null)
    const [fileError, setFileError] = useState(false)
    const [image, setImage] = useState(null)
    const [uploading, setUploading] = useState(false)
    const auth = useAuth()
    const userData = useUserData()


    const uploadImage = async ()=>{
        const token = auth.token
        const form = new FormData()
        form.append('add_img', file)
        await PatchRequestAuthorizedFormData({endpoint:'/user/profile/', data:form, token:token, auth:auth})
        await userData.getUserData()
        setFile(null)
        dialogCloseRef.current.click()
    }


    useEffect(()=>{  
        if(!file){
            setImage(null)
            setUploading(false)
            return
        }
        setFileError(false)
        if(file.name.split('.').pop() === 'jpg' || file.name.split('.').pop() === 'jpeg'){
            const objectURL = URL.createObjectURL(file)
            setImage({url: objectURL})
            console.log(file) 
            return () => URL.revokeObjectURL(objectURL)
        }else{
            setFileError(true)
            setFile(null)
        }
    },[file])

    return (
        <Dialog>
        <DialogTrigger className="relative w-[95%] ml-1 border-2  h-[200px] mb-1 border-slate-600 border-dashed">Add image
            <Button variant='outline' className=' gradiant-bg rounded-full h-10 w-10 absolute bottom-0 right-0'><PlusIcon className="absolute h-4 w-6"/></Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Add Image</DialogTitle>
            <DialogDescription>
                Select a JPEG/JPG Image file to add
            </DialogDescription>

                {
                    image ? <>
                                <img className=" self-center object-cover w-[320px] h-[400px] border-2 border-black rounded-lg" src={image.url}/>
                                <Button disabled={uploading} onClick={()=>uploadImage()}>
                                    <div hidden={!uploading} className="loader"></div>Upload Image
                                </Button>
                    </> : <></>
                }

                <Button className='gradiant-bg text-black' disabled={uploading} onClick={()=>fileRef.current.click()}>
                    {image ? 'Change Image' : 'Select Image'}  
                </Button>

                {
                    fileError ? <h2 className="text-destructive">Image file must be a jpeg/jpg!</h2> : <></>
                }

                <DialogClose disabled={uploading} ref={dialogCloseRef}>
                    Cancel
                </DialogClose>
            </DialogHeader>
            <input hidden ref={fileRef} onChange={(e)=>setFile(e.target.files[0])} type='file' accept=".jpeg,.jpg"/>
        </DialogContent>
        </Dialog>
)};

export { ImageEditCard, ImageAddCard };

