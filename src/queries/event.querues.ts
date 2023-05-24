import { getAxiosBackend } from "@/api/api";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Event } from "@/types/event";
import { Dog } from "@/types/dog";

export function useCreateEvent(accessToken: string){
    const backendAPI = getAxiosBackend(accessToken);
    return useMutation({mutationFn:(event:Event)=>{
        return backendAPI.post<Event>("/event", event).then((res)=>res.data)
    }})
}

export function getAllEvent(accessToken: string){
    const backendAPI = getAxiosBackend(accessToken);
    const {status, data} = useQuery({
        queryKey: ["getallevents"],
        queryFn: ()=>{
            return backendAPI.get<Event[]>("/event").then((res)=>res.data)
        },
        // make the query wait for accesstoken, !! is a short hand. !!accessToken turn it into a boolean
        enabled:!!accessToken

    })
    return {status, data}
}

export function userAcceptEventInvite(accessToken: string){
    const backendAPI = getAxiosBackend(accessToken)
    const queryClient = useQueryClient()
    return useMutation({mutationFn:(eventId: number)=>{
        return backendAPI.put<Event>(`/event/invitedEvent/${eventId}`).then((res)=>res.data)
    },

    onSuccess:(data)=>{
        queryClient.invalidateQueries()
    }
})
    
}

export function hostInviteToEvent(accessToken: string){
    const backendAPI = getAxiosBackend(accessToken);
    const queryClient = useQueryClient()
    return useMutation({mutationFn:(value:{eventId: number, userId:number})=>{
        return backendAPI.put<Event>(`/event/invite/${value.eventId}/${value.userId}`).then((res)=>res.data)
    },

    onSuccess:(data)=>{
        queryClient.invalidateQueries()
    }
})
}

export function userApplyToUninvitedEvent(accessToken: string){
    const backendAPI = getAxiosBackend(accessToken)
    const queryClient = useQueryClient()
    return useMutation({mutationFn:(eventId: number)=>{
        return backendAPI.put<Event>(`/event/applyToEvent/${eventId}`).then((res)=>res.data)
    },
    onSuccess:(data)=>{
        queryClient.invalidateQueries()
    }
})
    
}

export function hostAcceptUserApplication(accessToken: string){
    const backendAPI = getAxiosBackend(accessToken);
    const queryClient = useQueryClient()
    return useMutation({mutationFn:(value:{eventId: number, userId:number})=>{
        return backendAPI.put<Event>(`/event/processApplication/${value.eventId}/${value.userId}`).then((res)=>res.data)
    },

    onSuccess:(data)=>{
        queryClient.invalidateQueries()
    }
})
}

export function getAllEventHostedByCurrentUser(accessToken: string){
    const backendAPI = getAxiosBackend(accessToken);
    const {status, data} = useQuery({
        queryKey: ["getAllEventHostedByCurrentUser"],
        queryFn: ()=>{
            return backendAPI.get<Event[]>("/event/currentUser").then((res)=>res.data)
        },
        // make the query wait for accesstoken, !! is a short hand. !!accessToken turn it into a boolean
        enabled:!!accessToken

    })
    let eventData = data
    let eventStatus = status
    return {eventStatus, eventData}
}

export function updateEventByHost(accessToken:string){
    
    const backendAPI = getAxiosBackend(accessToken);
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:(values:{event_Id:number, formValues:Event})=>{
            return backendAPI.post<Event>(`/event/update/${values.event_Id}`, values.formValues).then((res)=>res.data)
        },

        onSuccess:(data)=>{
            queryClient.invalidateQueries()
        }

    })
}    

export function deleteEventByEventId(accessToken:string){
    const backendAPI = getAxiosBackend(accessToken);
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:(eventId:number)=>{
            return backendAPI.delete<Event>(`/event/delete/${eventId}`).then((res)=>res.data)
        },

        onSuccess:(data)=>{
            queryClient.invalidateQueries()
        }
    })
    
}


export function useGetAllDogsInEvent(accessToken:string, eventId:number){
    const backendAPI = getAxiosBackend(accessToken);
    const {status, data} = useQuery({
        queryKey: ["useGetAllDogsInEvent"],
        queryFn: ()=>{
            return backendAPI.get<Dog[]>(`/event/getAllDogsInEvent/${eventId}`).then((res)=>res.data)
        },
        // make the query wait for accesstoken, !! is a short hand. !!accessToken turn it into a boolean
        enabled:!!accessToken

    })
    return {status, data}
}
    