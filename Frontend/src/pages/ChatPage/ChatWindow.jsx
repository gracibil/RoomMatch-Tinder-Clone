import {Button} from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X } from "lucide-react"
import { useState, useEffect } from "react"
import { useUserData } from "@/context/User"
import { useAuth } from "@/context/Auth"
import {GetRequestAuthorized, PostRequestAuthorized, PatchRequestAuthorized } from "@/services/requests/requests"
import ChatTyping from "@/components/chat-typing"



const ChatWindow = ({ selectedUser }) => {
    const [messages, setMessages] = useState([])
    const [userMessage, setUserMessage] = useState('')
    const [awaitAiResponse, setAwaitAiResponse] = useState(false)
    const [conversationId, setConversationId] = useState(null)

    const api_url = import.meta.env.VITE_API_URL
    const userData = useUserData()
    const auth = useAuth()

    const sendMessage = async (e) =>{
        e.preventDefault()

        const message = {
            sender: userData.userData.pk,
            content: userMessage
        }

        setMessages([...messages, message])
        
        const test_ai_user = true

        // if (selectedUser.ai_user === true){
        if(test_ai_user){
           setAwaitAiResponse(true) 
           sendAiMessage(message)
        
        } else{
            sendUserMessage(message)


        }


    
    }

    const sendUserMessage = async (message) =>{

        if (messages.length === 0){
            const data = {
                    message: message,
                    user_2: selectedUser.id
                    
            }
            setUserMessage('')
            
            console.log(data)
            const res = await PostRequestAuthorized({endpoint:'user/conversations/', token:auth.token, auth:auth, data:data})
            console.log(res)
            
            setConversationId(res.conversation_id)
            userData.getUserData()

        }else{
            const data = {
                conversation_id: conversationId,
                message: message,
                    
            }
            setUserMessage('')
            console.log('message data', data)
            await PatchRequestAuthorized({endpoint:'user/conversations/', token:auth.token, auth:auth, data:data})
            userData.getUserData()
            }
    }

    const sendAiMessage = async (message) =>{
        console.log('sending ai message')
        if (messages.length === 0){
            const data = {
                    message: message,
                    user_2: selectedUser.id,
                    ai_user : true
                    
            }
            setUserMessage('')
            console.log(data)
            const res = await PostRequestAuthorized({endpoint:'user/conversations/', token:auth.token, auth:auth, data:data})
            const response = res.response
            console.log('res',res)
            console.log('response', response)
            setMessages([...messages, message, response])
            setConversationId(res.conversation_id)

            userData.getUserData()
            setAwaitAiResponse(false)

        }else{
            const data = {
                conversation_id: conversationId,
                message: message,
                user_2: selectedUser.id,
                ai_user : true
                    
            }
            setUserMessage('')
            console.log('message data', data)
            const res = await PatchRequestAuthorized({endpoint:'user/conversations/', token:auth.token, auth:auth, data:data})
            const response = res.response
            console.log('res',res)
            setMessages([...messages, message, response])
            setAwaitAiResponse(false)
            userData.getUserData()
            }
    }

    const getAiResponse = async () =>{
        const data = {
            conversation_id: conversationId,
            message: userMessage,
            ai_user : selectedUser.id
        }
        console.log('getting response')
        //const res = await PostRequestAuthorized({endpoint:'/user/serv/send-message', token:userData.auth.token, auth:userData.auth, data:{receiver:selectedUser.pk, content:userMessage}})
        await new Promise(r => setTimeout(r, 500));
        //if (selectedUser.ai_user === true){
        const message = {
            sender: selectedUser.pk,
            content: 'Hello, I am a bot, I am not able to respond to your messages'
        }
        setMessages([...messages, message])

        //}
    }

    const fetchMessages = async () =>{
        const res = await GetRequestAuthorized({endpoint:'/user/conversations/', params:'?conversation_id='+selectedUser.has_conversation, token:auth.token, auth:auth})
        setMessages(res.messages)
    }

    function updateScroll(){
    var element = document.getElementById("messagebox");
    element.scrollTop = element.scrollHeight;
    }

    useEffect(() => {
        updateScroll()
    }, [messages])


    useEffect(() => {
        setMessages([])
        if(selectedUser.has_conversation){
            // get messages if conversation exists
            setConversationId(selectedUser.has_conversation)
            fetchMessages()
        }
    }, [selectedUser])

    return(
        <div className="w-2/3 h-[100vh] bg-gray-100">

            <div className="flex flex-row h-[80px] shadow p-4 [border-bottom-width:0.5px] border-gray-400">

            <Avatar className=' w-14 h-14'>
                <AvatarImage src={api_url+'/user/serv/get-media-file?media_id='+selectedUser.images[0]} />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            
            <p className="ml-12 text-xl font-semibold mt-3 text-slate-500">
                You matched with {selectedUser.name}
            </p>
            

            <Button variant='outline' className='rounded-full h-14 ml-auto'><X className=""/></Button>
                
            </div>

            <div id="messagebox" className="w-[100%] h-[85%] p-4  flex flex-col [border-bottom-width:0.5px] overflow-y-scroll [scrollbar-width:none]  border-gray-400">

            {
                messages.map((message, idx) => {
                    return(
                        <div key={idx} 
                            className={ userData.userData.pk === message.sender 
                            ? " max-w-[80%] mt-2 mb-2 p-4 text-left pl-6 pr-6  h-fit text-xl rounded-lg ml-auto text-black bg-[#8BC6EC]"
                            : " max-w-[80%] w-fit mt-2 mb-2 p-4  h-fit text-xl rounded-lg mr-auto text-black bg-[#7ee980]"
                            }>

                            {message.content}

                        </div>
                    )
                })
            }

            {
                awaitAiResponse && <div className="mt-4"> <ChatTyping/> </div>
            }

            



 
            </div>

                <form className="w-full h-[5%] p-2 flex flex-row items-center" onSubmit={(e)=>sendMessage(e)}>
                    <input autoFocus={true} value={userMessage} onChange={(e)=>setUserMessage(e.target.value)} type='text' placeholder="Enter your message..." className="w-[90%] h-12 text-xl rounded-xl p-2 bg-transparent border-none focus:outline-none text-black"></input>
                    <Button disabled={userMessage === ''} type='submit' variant='outline' className='text-white w-24 h-12 ml-2 mt-2 rounded-3xl text-xl gradiant-bg hover:scale-105'>Send</Button>
                </form>


        </div>

    )

}

export default ChatWindow;