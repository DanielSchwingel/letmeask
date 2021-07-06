import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type FirebaseQuestions = Record<string, {
   author : {
      avatar: string;
      name: string;
   };
   content: string;
   isAnswered: boolean;
   isHighlighted: boolean;
   likes: Record<string, {
      authorId: string;
   }>;
}>
 

type Questions = {
   id: string;
   author : {
      avatar: string;
      name: string;
   };
   content: string;
   isAnswered: boolean;
   isHighlighted: boolean;
   likeCount: number;
   likeId: string | undefined;
}

export function useRoom(roomId: string){
   const { user } = useAuth();
   const [ title, setTitle ] = useState('');
   const [ loading, setLoading ] = useState(true);
   const [ isAuthor, setIsAuthor ] = useState(true);
   const [ questions, setQuestions ] = useState<Questions[]>([]);
 
   useEffect(()=> {
      const roomRef = database.ref(`rooms/${roomId}`);
      
      roomRef.on('value', room => {
         const databaseRoom = room.val();
         const firebaseQuestions = databaseRoom.questions as FirebaseQuestions ?? {};
         const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value])=>{
            return {
               id: key,
               content: value.content,
               author: value.author,
               isHighlighted: value.isHighlighted,
               isAnswered: value.isAnswered,
               likeCount : Object.values(value.likes ?? {}).length,
               likeId: Object.entries(value.likes ?? {}).find(([key, value]) => value.authorId === user?.id)?.[0]
            }
         });
         setTitle(databaseRoom.title)
         setQuestions(parsedQuestions)
         setIsAuthor(databaseRoom.authorId === user?.id)
         setLoading(false);
      })

      return ()=> {
         roomRef.off('value');
      }
   },[roomId, user?.id])   

   return { questions, title, loading, isAuthor };
}