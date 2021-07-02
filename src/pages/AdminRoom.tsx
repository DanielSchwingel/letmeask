import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';
import { EmptyQuestion } from '../components/EmptyQuestion';

import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import logoImg from '../assets/images/logo.svg';
import '../styles/room.scss';

type RoomParams = {
   id: string;
}

export function AdminRoom() {
   const params = useParams<RoomParams>();  
   const history = useHistory();
   const roomId = params.id;
   const { title, questions } = useRoom(roomId);

   async function handleEndRoom(){
      await database.ref(`/rooms/${roomId}`).update({
         closedAt: new Date()
      })
      history.push('/');
   }

   async function handleDeleteQuestion(questionId: string){
      if (window.confirm('Tem certeza que você deseja encerrar esta sala?')) {
         await database.ref(`/rooms/${roomId}/questions/${questionId}`).remove()
      }
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

      </div>
   )
}