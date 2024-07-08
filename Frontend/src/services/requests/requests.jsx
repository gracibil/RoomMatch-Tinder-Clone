import cookie from "react-cookies";

const api_url = import.meta.env.VITE_API_URL


async function GetRequest({endpoint, params}){

    const response = await fetch(api_url+endpoint+params, {
        method: 'GET',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
        'X-CSRFToken':cookie.load('csrftoken'),
        },
    })

    return response.json()

}

async function GetRequestAuthorized({endpoint, params='', token, auth}){
    try{
        const response = await fetch(api_url+endpoint+params, {
            method: 'GET',
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
            'Authorization' :"Bearer "+ token,
            'X-CSRFToken':cookie.load('csrftoken'),
            },
        })
    
        if (response.ok){
            return response.json()
        }

        if(response.status === 401){
            // expired token, throw token error 
            throw new Error('token_error')  
         }

        } catch (error) {
            if(error.message == 'token_error'){
                // refresh token and re-try api call
                const new_token = await auth.refreshTokenInFetch()
                return GetRequestAuthorized({endpoint:endpoint, params:params, token:new_token}) 
            }
          
        }  

}


async function GetRequestMedia({endpoint, params='', token, auth}){
    try{
        const response = await fetch(api_url+endpoint+params, {
            method: 'GET',
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
            'Authorization' :"Bearer "+ token,
            'X-CSRFToken':cookie.load('csrftoken'),
            },
        })
    
        if (response.ok){
            return response
        }

        if(response.status === 401){
            // expired token, throw token error 
            throw new Error('token_error')  
         }

        } catch (error) {
            if(error.message == 'token_error'){
                // refresh token and re-try api call
                const new_token = await auth.refreshTokenInFetch()
                return GetRequestMedia({endpoint:endpoint, params:params, token:new_token}) 
            }
          
        }  

}


async function PostRequest({endpoint, data}){


    const response = await fetch (api_url+endpoint,{
        
        method:'post',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
        'X-CSRFToken':cookie.load('csrftoken'),
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })

    return response.json()
}

async function PostRequestAuthorized({endpoint, data, token, auth}){
    try{
        const response = await fetch (api_url+endpoint,{
            
            method:'post',
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
            'Authorization' :"Bearer "+ token,
            'X-CSRFToken':cookie.load('csrftoken'),
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        if (response.ok){
            return response.json()
        }

        if(response.status === 401){
           // expired token, throw token error 
           throw new Error('token_error')  
        }
        

    } catch (error) {
        if(error.message == 'token_error'){
            // refresh token and re-try api call
            const new_token = await auth.refreshTokenInFetch()
            return PostRequestAuthorized({endpoint:endpoint, data:data, token:new_token}) 
        }
      
    }   
}


async function PostRequestAuthorizedFormData({endpoint, data, token, auth}){
    try{
        console.log(data)
        const response = await fetch (api_url+endpoint,{
            
            method:'post',
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
            'Authorization' :"Bearer "+ token,
            'X-CSRFToken':cookie.load('csrftoken'),

            },
            body: data
        })
        if (response.ok){
            return response.json()
        }

        if(response.status === 401){
           // expired token, throw token error 
           throw new Error('token_error')  
        }
        

    } catch (error) {
        if(error.message == 'token_error'){
            // refresh token and re-try api call
            const new_token = await auth.refreshTokenInFetch()
            return PostRequestAuthorizedFormData({endpoint:endpoint, data:data, token:new_token}) 
        }
      
    }   
}


async function PatchRequest({endpoint, data}){

    const response = await fetch (api_url+endpoint,{
        method:'PATCH',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
        'X-CSRFToken':cookie.load('csrftoken'),
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })

    return response.json()
}

async function PatchRequestAuthorized({endpoint, data, token, auth}){
    try{
        const response = await fetch (api_url+endpoint,{
            
            method:'PATCH',
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
            'Authorization' :"Bearer "+ token,
            'X-CSRFToken':cookie.load('csrftoken'),
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        if (response.ok){
            return response.json()
        }

        if(response.status === 401){
           // expired token, throw token error 
           throw new Error('token_error')  
        }
        

    } catch (error) {
        if(error.message == 'token_error'){
            // refresh token and re-try api call
            const new_token = await auth.refreshTokenInFetch()
            return PostRequestAuthorized({endpoint:endpoint, data:data, token:new_token}) 
        }
      
    }   
}

async function PatchRequestAuthorizedFormData({endpoint, data, token, auth}){
    try{
        const response = await fetch (api_url+endpoint,{
            
            method:'PATCH',
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
            'Authorization' :"Bearer "+ token,
            'X-CSRFToken':cookie.load('csrftoken'),

            },
            body: data
        })
        if (response.ok){
            return response.json()
        }

        if(response.status === 401){
           // expired token, throw token error 
           console.log('error token for some reason')
           throw new Error('token_error')  
        }
        

    } catch (error) {
        if(error.message == 'token_error'){
            // refresh token and re-try api call
            const new_token = await auth.refreshTokenInFetch()
            return PostRequestAuthorizedFormData({endpoint:endpoint, data:data, token:new_token}) 
        }
      
    }   
}



async function DeleteRequest({endpoint, data}){

    const response = await fetch (api_url+endpoint,{
        method:'DELETE',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
        'X-CSRFToken':cookie.load('csrftoken'),
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })

    return response.json()
}

async function DeleteRequestAuthorized({endpoint, data, token, auth}){
    try{
        const response = await fetch (api_url+endpoint,{
            
            method:'DELETE',
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
            'Authorization' :"Bearer "+ token,
            'X-CSRFToken':cookie.load('csrftoken'),
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        if (response.ok){
            return response.json()
        }

        if(response.status === 401){
           // expired token, throw token error 
           throw new Error('token_error')  
        }
        

    } catch (error) {
        if(error.message == 'token_error'){
            // refresh token and re-try api call
            const new_token = await auth.refreshTokenInFetch()
            return PostRequestAuthorized({endpoint:endpoint, data:data, token:new_token}) 
        }
      
    }   
}

async function DeleteRequestAuthorizedFormData({endpoint, data, token, auth}){
    try{
        console.log(data)
        const response = await fetch (api_url+endpoint,{
            
            method:'delete',
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
            'Authorization' :"Bearer "+ token,
            'X-CSRFToken':cookie.load('csrftoken'),

            },
            body: data
        })
        if (response.ok){
            return response.json()
        }

        if(response.status === 401){
           // expired token, throw token error 
           throw new Error('token_error')  
        }
        

    } catch (error) {
        if(error.message == 'token_error'){
            // refresh token and re-try api call
            const new_token = await auth.refreshTokenInFetch()
            return PostRequestAuthorizedFormData({endpoint:endpoint, data:data, token:new_token}) 
        }
      
    }   
}



export {
    GetRequest, GetRequestAuthorized, GetRequestMedia,
    PatchRequest, PatchRequestAuthorized, PatchRequestAuthorizedFormData,
    PostRequest, PostRequestAuthorized, PostRequestAuthorizedFormData, 
    DeleteRequest, DeleteRequestAuthorized, DeleteRequestAuthorizedFormData
};