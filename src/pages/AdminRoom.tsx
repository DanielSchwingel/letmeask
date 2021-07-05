import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';
import { useModal } from '../hooks/useModal';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import { EmptyQuestion } from '../components/EmptyQuestion';
import { Modal } from '../components/Modal';

import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import logoImg from '../assets/images/logo.svg';
import '../styles/room.scss';

type RoomParams = {
   id: string;
}

export function AdminRoom() {
   const [ questionId, setQuestionId ] = useState('');
   const { user } = useAuth();
   const params = useParams<RoomParams>();  
   
   const roomId = params.id;

   const { title, questions, author } = useRoom(roomId);
   const { showModalDelete, toggleModalDelete, showModalClose, toggleModalClose } = useModal();


   useEffect(()=>{
      if (user?.id !== author) {
         alert('não é o dono da sala')
         return
      }
   },[user, author])


   async function handleEndRoom(){
      toggleModalClose();
   }

   async function handleDeleteQuestion(questionId: string){
      setQuestionId(questionId);
      toggleModalDelete();
   }

   async function handleHighLightQuestion(questionId: string){
      await database.ref(`/rooms/${roomId}/questions/${questionId}`).update({
         isHighlighted: true
      })
   }

   async function handleCheckQuestionAnswered(questionId: string){
      await database.ref(`/rooms/${roomId}/questions/${questionId}`).update({
         isAnswered: true
      })
   }

   return (
      <div id='page-room'>
         <header>
            <div className='content'>
               <img src={logoImg} alt='Letmeask'/>
               <div>
                  <RoomCode code={roomId}/>
                  <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
               </div>
            </div>
         </header>
         <main>
            <div className='room-title'>
               <h1>Sala {title}</h1>
               {questions.length > 0 && <span>{questions.length} perguntas</span>}
            </div>
            <div className='question-list'>
               {questions.length === 0 && (
                  <EmptyQuestion/>
               )}
               {questions.map(question => {
                  return (
                     <Question
                        key={question.id}
                        content={question.content}
                        author={question.author}
                        isHighlighted={question.isHighlighted}
                        isAnswered={question.isAnswered}
                     >
                        {!question.isAnswered && (
                           <>
                              <button
                                 type='button'
                                 onClick={()=> {handleCheckQuestionAnswered(question.id)}}
                              >
                                 <img src={checkImg} alt="Marcar pergunta como respondida"/>
                              </button>
                              <button
                                 type='button'
                                 onClick={()=> {handleHighLightQuestion(question.id)}}
                              >
                                 <img src={answerImg} alt="Dar destaque a pergunta"/>
                              </button>
                           </>
                        )}
                        <button
                           type='button'
                           onClick={()=> {handleDeleteQuestion(question.id)}}
                        >
                           <img src={deleteImg} alt="Remover pergunta"/>
                        </button>

                     </Question>
                  )
               })}
            </div>

         </main>
         {showModalDelete && 
            <Modal
               roomId={roomId}
               questionId={questionId}
               type='DELETE'
            />
         }
         {showModalClose && 
            <Modal
               roomId={roomId}
               questionId={questionId}
               type='CLOSE'
            />
         }

      </div>
   )
}