import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonGrid, IonIcon, IonInput, IonRow } from '@ionic/react';
import './ChatContainer.css';
import { useEffect, useRef, useState } from 'react';
import {useSocket} from '../contexts/socketContext';
import { send } from 'ionicons/icons';
import '../theme/tailwind.css'

interface ChatContainerProps {
  name: string | undefined;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ name }) => {
  var hello :string = name ?? "Hello";
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<null | HTMLIonInputElement>(null);
  const [query, setQuery] = useState<string>("");
  var [ROOM, setROOM] = useState<string>("");
  const { socket, connect, disconnect } = useSocket();
  const [requery, setRequery] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<string>("");
  interface Message{
    sender: string;
    content: string;
  }
  var [messages, setMessages] = useState<Message[]>([]);
  useEffect(() => {
    connect();
    
    socket?.on('text-response', (data) => {
      // Data format: {response: string}
      var response = data.response;
      //Add to messages as Server Entry
      setMessages(prevMessages => [...prevMessages, {sender: "Server", content: response}]);
    });
    socket?.on('joined-room', (data) => {
      //Data format: {room:string}
      var room = data.room;
      setROOM(room);
    });
    socket?.on('re-query', (data) => {
      var response = data.response;
      var history = data.history;
      setChatHistory(history);
      setRequery(true);
      setMessages(prevMessages => [...prevMessages, {sender: "Server", content: response}]);
    });
    socket?.on('workout-response', (data) => {
      // Data format: {response: string}
      var response = data.response;
      console.log(response);
      //Add to messages as Server Entry
      //setMessages(prevMessages => [...prevMessages, {sender: "Server", content: response}]);
    });

    return () => {
      disconnect();
    };
  }, [socket, connect, disconnect]);

  const SendMessage = () =>{
    // Get the query from the input
    //Add to messages as User Entry
    // Hard copy messages
    //If there is a message in the input
    if (query == "") return;
    setMessages(prevMessages=>[...prevMessages, {sender: "User", content: query}]);
    console.log("Sending message");
    socket?.emit('user-request', {room: ROOM, query: query, requery: requery, history: chatHistory});
    setQuery("");
  }
  //On messages changed console.log messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

  var sampleWorkout:Workout = {
    routines: [
      {
        name: "Bench press",
        dificulty: 0,
        bodyareas: ["Legs"],
        sets: [
          {
            time: 0.5,
            reps: null,
            weight: 50,
            rest: 30
          },
          {
            time: 2,
            reps: null,
            weight: 50,
            rest: 30
          },
          {
            time: 1.5,
            reps: null,
            weight: 50,
            rest: 30
          }
        ]
      },
      {
        name: "Push Up",
        dificulty: 1,
        bodyareas: ["Chest"],
        sets: [
          {
            time: null,
            reps: 10,
            weight: 50,
            rest: 30
          },
          {
            time: null,
            reps: 10,
            weight: 50,
            rest: 30
          },
          {
            time: null,
            reps: 10,
            weight: 50,
            rest: 30
          }
        ]
      },
      {
        name: "Pull up",
        dificulty: 2,
        bodyareas: ["Back"],
        sets: [
          {
            time: null,
            reps: 10,
            weight: 50,
            rest: 30
          },
          {
            time: null,
            reps: 10,
            weight: 50,
            rest: 30
          },
          {
            time: null,
            reps: 10,
            weight: 50,
            rest: 30
          }
        ]
      }
    ]
  };
  return (
    <div className="chat-container">
        <div className='chat-history'>
          {messages.map((message, index) => {
            if(message.sender == "Server"){
              return <TrainerEntry key={index} content={message.content} />
            }
            else{
              return <UserEntry key={index} username={message.sender} content={message.content} />
            }
          })}
          <WorkoutPlan workout={sampleWorkout}/>
          <div ref={messagesEndRef} className='p-3'/>
          {/* <TrainerEntry content="Hello there, what type of training do you want" />
          <UserEntry username="User" content="I want to train my legs" /> */}
        </div>
        <div className='chat-input'>
          <IonInput
            placeholder="Enter your message"
            className="ion-text-start"
            value={query}
            onIonInput={(e: any) =>{ 
              setQuery(e.target.value)
            }}
            onKeyDown={(e: any) => {
              if (e.key === 'Enter') {
                SendMessage();
              }
            }}
          ></IonInput>
          <IonButton onClick={e=>SendMessage()} disabled={query==""}>
            <IonIcon aria-hidden="true" icon={send} />
          </IonButton>
        </div>
    </div>
  );
};

//Chat entry component for trainer
interface TrainerEntryProps {
  content: string;
}

const TrainerEntry: React.FC<TrainerEntryProps> = ({ content }) => {
  return (
    <IonCard className='items-end bg-gradient-to-r from-blue-950 to-black'>
      <IonCardHeader className='text-white'>
        <IonCardTitle>Trainer</IonCardTitle>
      </IonCardHeader>

      <IonCardContent className='text-white'>
        {content}
      </IonCardContent>
    </IonCard>
  );
};

interface UserEntryProps {
  username: string;
  content: string;
}
//Create a chat entry component for user
const UserEntry: React.FC<UserEntryProps> = ({ username, content }) => {
  return (
    <IonCard className='flex flex-col items-end bg-gradient-to-l from-black'>
      <IonCardHeader className='ion-text-end text-white'>
        <IonCardTitle>{username}</IonCardTitle>
      </IonCardHeader>

      <IonCardContent className='text-white'>
        {content}
      </IonCardContent>
    </IonCard>
  );
};

interface WorkoutPlanProps {
  workout: Workout;
}

interface Workout{
  routines: Exercise[]
}


interface Exercise{
  name: string,
  dificulty: number, //enum
  bodyareas: string[],
  sets: Set[],
}
interface Set{
  time: number | null,
  reps: number | null,
  weight: number,
  rest: number
}


const WorkoutPlan: React.FC<WorkoutPlanProps> = ({workout}) => {

  return (
    <IonCard className='ion-text-end bg-gradient-to-r from-blue-950 to-black'>
      <IonCardHeader>
        <IonCardTitle>Trainer</IonCardTitle>
      </IonCardHeader>

      <IonCardContent className='text-white'>
        <p>Here is your workout plan</p>
        {/* Proceed to display workout plan in checklist format */}
        <div>
          {workout.routines.map((routine, index) => {
            return <Routine key={index} routine={routine} />
          })}
        </div>
      </IonCardContent>
    </IonCard>
  );
};

interface RoutineProps {
  routine: Exercise;
}

const Routine: React.FC<RoutineProps> = ({routine}) => {
  const DifficultyDict = ["Easy", "Medium", "Hard"];
  var dificulty = DifficultyDict[routine.dificulty];
  var dif_color = routine.dificulty == 0 ? "bg-green-500" : routine.dificulty == 1 ? "bg-yellow-500" : "bg-red-500";
  var [timerColor, setTimerColor]= useState<string>("bg-gray-900 text-white");
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timeInSeconds, setTimeInSeconds] = useState<number>(300); // 5 minutes in seconds
  const timeRoutine = routine.sets[0].time ?? false;
  const totalSets = routine.sets.length;
  const [timers, setTimers] = useState<number[]>([]);
  const [currentSet, setCurrentSet] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        // Define the async function inside the useEffect
        const fetchImage = async () => {
            try {
                //Convert the name to lowercase and replace spaces with dashes
                const name = routine.name.toLowerCase().replace(" ", "_");
                // Replace with your Flask server URL and filename parameter
                const response = await fetch(`http://localhost:5500/get-routine-image/${name}`);
                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);
                setImageUrl(imageUrl);
            } catch (error) {
                console.error("Error fetching the image:", error);
            }
        };

        // Call the async function
        fetchImage();
    }, []); // Empty dependency array to run once on component mount
  
  useEffect(() => {
    //Get total 
    if (timeRoutine){
      //Get the time for each set
      var newTimers = routine.sets.map((set, index) => {
        var minutes  = (set.time ?? 0) * 60;
        return minutes;
      });
      setTimers(newTimers);
    }
    let timerInterval: NodeJS.Timeout | null = null;
    
    if (timerRunning && timeInSeconds > 0) {
      timerInterval = setInterval(() => {
        setTimeInSeconds(prevTime => prevTime - 1);
      }, 1000);
    }
    else if (timeInSeconds == 0){
      //If time is up, go to next set
      if (currentSet < totalSets-1){
        setCurrentSet(prevSet => prevSet+1);
        setTimeInSeconds(timers[currentSet+1]);
      }
      else{
        //If all sets are done, stop timer
        setTimerRunning(false);
      }
    }
    
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    }; // Cleanup interval on component unmount
  }, [timerRunning, timeInSeconds]);

  //If timer is running, change color to orange
  useEffect(() => {
    if (timerRunning){
      setTimerColor("bg-orange-500 text-black");
    }
    else{
      setTimerColor("bg-gray-900 text-white");
    }
  }, [timerRunning]);
  useEffect(()=>{
    if (timeRoutine && !timerRunning){
      setTimeInSeconds(timers[currentSet]);
    }
  }, [timers]);

  const toggleTimer = () => {
    setTimerRunning(!timerRunning);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className='flex flex-row p-2 items-center justify-between'>
      <input type="checkbox" className='mx-3' />
      {/* <img className='rounded-lg' src="https://media.istockphoto.com/id/1281672735/vector/woman-doing-exercise-with-knee-push-up-in-2-steps.jpg?s=612x612&w=0&k=20&c=MKJkBMAmP2dCXc1aygkbo4WHHU8rXTe9zfhi1PuZ77I=" alt="Exercise Image" height="100px" width="100px" /> */}
      {imageUrl && <img className='rounded-lg' src={imageUrl} alt="Exercise Image" height="100px" width="100px" />}
      <div className='p-1 mx-2'>{routine.name}</div>
      <div className={`p-2 mx-2 ${dif_color} text-black rounded-md`}>{DifficultyDict[routine.dificulty]}</div>
      {timeRoutine && 
      <div className={`${timerColor} p-3 hover:bg-gray-500 text-center`} onClick={toggleTimer}>
        {currentSet+1}/{totalSets} Sets
        <div className='font-bold text-xl'>{formatTime(timeInSeconds)}</div>
      </div>
      }
      {!timeRoutine&&
      <div className='p-3 bg-gray-900 text-white text-center'>
        {totalSets} sets
      <div className='flex flex-row'>
        {routine.sets.map((set, index) => {
          return <div className="rounded-full bg-blue-600 ml-1 p-1">
              {set.reps}
            </div>
        })}
        </div>
        </div>}
    </div>
  );
}


export default ChatContainer;
