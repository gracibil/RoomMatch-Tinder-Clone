import {Input} from "@/components/ui/input"
import { useRef, useState, useEffect } from "react";
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
import { PlusIcon } from "lucide-react";
import { PatchRequestAuthorizedFormData } from "@/services/requests/requests";
import { useAuth } from "@/context/Auth";
import { useUserData } from "@/context/User";


const FormImageCard = ({fileRef}) => {
    const [selectedFile, setSelectedFile] = useState(null)
    const [image, setImage] = useState(null)
    const fileUploader = useRef(null)


    const handleImageUpload = () => {
        fileUploader.current.click()
    }

    const onChangeImg = (e)=>{
        console.log(e.target.files[0])
        setSelectedFile(e.target.files[0])
        fileRef.onChange(e)
    }

    useEffect(() => {
        if(!selectedFile){
            setImage(null)
            return
        }
        console.log(selectedFile)
        if (selectedFile.url){
            setImage(selectedFile)
        }
        else if (selectedFile.name.split('.').pop() == 'jpg' || selectedFile.name.split('.').pop() == 'jpeg'){    
        const objectURL = URL.createObjectURL(selectedFile)
        setImage({url: objectURL})

        return () => URL.revokeObjectURL(objectURL)
        }else{
            setSelectedFile(null)
        }
    }, [selectedFile])


    return (
        <>
        <div className="w-full h-[200px] flex items-center">
            <div className=" ml-auto mt-24 mr-auto h-[300px] w-[200px] rounded-lg cursor-pointer">
                 {
                    image ? <img className="w-fit h-full rounded-lg" src={image.url}  onClick={handleImageUpload}></img> 
                    : <div className="relative rounded-2xl h-full w-full ml-1 border-2 mb-1 border-slate-600 border-dashed" onClick={handleImageUpload}>Add img
                    <Button variant='outline' className=' gradiant-bg rounded-full h-10 w-10 absolute bottom-0 right-0'><PlusIcon className="absolute h-4 w-6"/></Button>
                    </div>
                 }
            </div>
        </div>

        <Input className={'hidden'}  type='file' placeholder=""  {...fileRef}
         ref={(e)=>{fileRef.ref(e)
                    fileUploader.current = e}}   
            onChange={(e)=>{onChangeImg(e)}}
         />
        </>
    );

}

export default FormImageCard;