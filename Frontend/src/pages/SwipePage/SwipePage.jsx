
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, X } from "lucide-react"
import UserCard from "./UserCard"
import { GetRequestAuthorized, PostRequestAuthorized } from "@/services/requests/requests"
import { useAuth } from "@/context/Auth"
import { useUserData } from "@/context/User"
function debounce(func, timeout = 5) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }

const SwipePage = () => {
    const dragRef = useRef()
    const [mouseX, setMouseX] = useState(0)
    const [draggedX, setDraggedX] = useState(0)
    const [userCards, setUserCards] = useState([])
    const [dragging, setDragging] = useState(false)
    const [matched, setMatched] = useState(false)
    const [outOfMatches, setOutOfMatches] = useState(false)
    const auth = useAuth()
    const userData = useUserData()
    document.ondragover = debounce((e)=> {
        setMouseX(e.pageX)
    })

    const getPotentialMatches = async ()=>{
        const response = await GetRequestAuthorized({endpoint:'/user/swipe/', token:auth.token, auth:auth})
        setUserCards(response.cards)
        if(response.cards.length === 0){
            setOutOfMatches(true)
        }
    }
    

    const handleDragLeft = ()=>{
        console.log('handling drag left')
        setDragging(true)

        dragRef.current.style.transform = 'translateX(-700px) translateY(-50px) rotate(-30deg) scale(0.0)'
        dragRef.current.style.transition = 'transform 0.5s ease-in-out'
        setTimeout(async()=>{

            userCards.pop()
            console.log('user cards remaining : ', userCards.length)
            if(userCards.length > 0){

            const nextCard = userCards.slice(-1)[0]
            console.log(nextCard)
            dragRef.current = document.getElementById(nextCard.id)
            setDraggedX(0)
            setMouseX(1135)
            setDragging(false)

            }else{
                await new Promise(r => setTimeout(r, 500));
                setUserCards([])
                dragRef.current = undefined
            }


        }, 500)

       
        
    }

    const handlePostMatch = ()=>{

        userData.getUserData()

        setTimeout(()=>{

            userCards.pop()
            const nextCard = userCards.slice(-1)[0]
            dragRef.current = document.getElementById(nextCard.id)
            setDraggedX(0)
            setMouseX(1135)
            setDragging(false)

        }, 5)

        
        setMatched(false)

    }

    const handleDragRight = async ()=>{
        setDragging(true)
        dragRef.current.style.transform = 'translateX(700px) translateY(-50px) rotate(30deg) scale(0.0)'
        dragRef.current.style.transition = 'transform 0.5s ease-in-out'
        const likedCard = userCards.find(card=>card.id === parseInt(dragRef.current.id))
        

        const id = likedCard.id
        const data = {
                        liked:id, 
                        match:likedCard.is_match
                    }
        PostRequestAuthorized({endpoint:'/user/swipe/', data:data, token:auth.token, auth:auth})
        if(likedCard.is_match){
            await new Promise(r => setTimeout(r, 500));
            console.log('match')
            setMatched(true)

        } else{

            setTimeout(async ()=>{

                userCards.pop()
                console.log('user cards remaining : ', userCards.length)
                if(userCards.length > 0){
    
                const nextCard = userCards.slice(-1)[0]
                console.log(nextCard)
                dragRef.current = document.getElementById(nextCard.id)
                setDraggedX(0)
                setMouseX(1135)
                setDragging(false)
    
                }else{
                    await new Promise(r => setTimeout(r, 500));
                    setUserCards([])
                    dragRef.current = undefined
                }
            }, 500)
        }

      
    }

    const onDrag = (e)=>{
        const cardHolder = document.getElementById('cardHolder')
        let centerX = cardHolder.offsetLeft + cardHolder.offsetWidth / 2;
        console.log(centerX)
        if (mouseX === 0){
            setMouseX(centerX)
        }
        const diffX = mouseX - centerX
        console.log(diffX)
        const rotate = parseInt(diffX/30)
        let scale = 1

        if(Math.abs(diffX) < 150){
            scale = 0.98
        }
        else if(Math.abs(diffX) < 300){
            scale = 0.9
        }
        else if(Math.abs(diffX) < 500){
            scale = 0.8
        }
        else if(Math.abs(diffX) < 10000){
            scale = 0.65
        }
        
        setDraggedX(mouseX - centerX)

        
        e.currentTarget.style.transform = `translateX(${diffX}px) translateY(${diffX/100}px) rotate(${rotate}deg) scale(${scale})`
        e.currentTarget.style.transition = 'transform 0.1s ease-in-out'


        }
    

    const onDragEnd = (e)=>{
        console.log('drag end')
        if (0 > draggedX && draggedX < -500){
            handleDragLeft()
        }
        else if(0 < draggedX && draggedX > 500){
            handleDragRight()
        }else{
            e.currentTarget.style.transform = `translateX(${0}px) translateY(${0}px) rotate(${0}deg) scale(1)`
        }


    }

    useEffect(()=>{
        if(userCards.length === 0){
            if(outOfMatches === false){
            getPotentialMatches()
            setDragging(false)
            }
        }
        if(dragRef.current === undefined && userCards.length > 0){
            const cards_list2 = Array.from(userCards)
            const lastCard = cards_list2.pop()
            dragRef.current = document.getElementById(lastCard.id)

        }
        
    },[userCards])

    useEffect(()=>{
        if(matched === true){
            
        }
    },[matched])



    return(
        <div className="flex justify-center w-full h-full bg-gray-100">


        {matched === false ?  
        
            <div id='cardHolder' className="w-[400px] h-[690px] self-center mr-0 bg-black rounded-xl shadow-2xl  relative">
                
                {userCards.length > 1 ? <></>
                : outOfMatches ? 
                <div className=" absolute z-0 flex flex-col w-full h-full items-center justify-center gradiant-bg">
                    
                <h1 className="text-white text-2xl mb-2">There is no profiles available right now :( </h1>
           
            </div>
                : 
                <div className=" absolute z-0 flex flex-col w-full h-full items-center justify-center gradiant-bg">
                    
                    <h1 className="text-white text-2xl mb-2">Searching for more profiles </h1>
                    <div className="loader-large mt-12"/>
               
                </div>}
                
                {
                    userCards.map((card)=>{
                        return <UserCard card={card} onDrag={onDrag} onDragEnd={onDragEnd}/>    
                    })
                }




                
                <div className="absolute flex bottom-6 left-0 rounded-b-lg bg-transparent h-8 w-full bg-opacity-90 place-content-evenly text-left z-100">

                   
                    <Button variant='ghost' disabled={dragging} className='opacity-90 bg-red-400 w-16 h-16 rounded-full self-center' onClick={()=>handleDragLeft()}>
                        <X/>
                    </Button>
                    

                    <Button variant='ghost' disabled={dragging} className='opacity-90 bg-green-400 w-16 h-16 rounded-full self-center' onClick={()=>handleDragRight()}>
                        <Heart/>
                    </Button>
                    
                </div>

            </div>


            : 
            
            <div id="match-screen"  className="absolute gradiant-bg w-[100vw] h-[100vh] left-0 top-0 matchScreenAnimate">
                <h1 className="brushScript text-white">Its a match!</h1>
                <div id='cardHolder' className="w-[400px] h-[690px] ml-auto mr-auto mt-12 self-center bg-red-200 rounded-xl shadow-2xl  relative">
                

                
                {
                    userCards.map((card)=>{
                        return <UserCard card={card}/>    
                    })
                }

                


            </div>
                <Button variant='outline' onClick={()=>handlePostMatch()} className='self-center mt-12 text-4xl p-7 rounded-3xl'>Continue</Button>
            </div>}


        </div>
    )
}

export default SwipePage;