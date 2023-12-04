import './TrainingContainer.css';
import { IonPage, IonContent, IonItem, IonLabel, IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';
import { IonIcon, IonButton, IonModal } from '@ionic/react';
import { alarmOutline, barChartOutline, barbellOutline, calendarOutline, planetOutline, rocketOutline, starOutline, timerOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import DurationSelector from './DurationSelectorContainer';
import ChoiceSelectorContainer from "./ChoiceSelectorContainer";
import { IonButtonCustomEvent } from '@ionic/core';
import { useSocket } from '../contexts/socketContext';
import RoutineContainer from './RoutineContainer';

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous"></link>

interface TrainingContainerProps {
  name: string;
  routineLabel: string;
  durationLabel: string;
  objectiveLabel: string;
  equipmentLabel: string;
  weeklyGoalLabel: string;
  experienceLabel: string;
}

const TrainingContainer: React.FC<TrainingContainerProps> = ({
  routineLabel,
  equipmentLabel,
  weeklyGoalLabel,
  experienceLabel,
}) => {
  //setting up sockets
  var [ROOM, setROOM] = useState<string>("");
  const { socket, connect, disconnect } = useSocket();

  useEffect(() => {
    connect();

    socket?.on('joined-room', (data) => {
      //Data format: {room: string}
      var room = data.room;
      setROOM(room);
    })

    return () => {
      disconnect();
    };
}, [socket, connect, disconnect]);


  const [showDurationModal, setShowDurationModal] = useState(false);
  const [durationLabel, setDurationLabel] = useState('0 h 0 m 0 s'); // Initialize as needed

  const [showObjectiveModal, setShowObjectiveModal] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState('Overall Fitness');

  const ObjectiveOptions = [
    { label: 'Muscle Growth', value: 'Muscle Growth' },
    { label: 'Overall Fitness', value: 'Overall Fitness' },
    { label: 'Weight Loss', value: 'Weight Loss' },
  ];

  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState('Overall Beginner');

  const ExperienceOptions = [
    { label: 'Beginner', value: 'Beginner' },
    { label: 'Intermediate', value: 'Intermediate' },
    { label: 'Expert', value: 'Expert' },
  ];

  const [showRoutineModal, setShowRoutineModal] = useState(false);
  const routineChoices = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
 
  const handleDurationConfirmed = (duration: { hours: number, minutes: number, seconds: number }) => {
    const newDuration = duration.hours + " h " + duration.minutes + " m " + duration.seconds + " s";
    setDurationLabel(newDuration);
    setShowDurationModal(false);
    socket.emit('duration-update', { option: 'duration', value: newDuration });

  };
  
  const handleObjectiveConfirmed = (e:any) => {
    setSelectedObjective(e.detail.value);
    setShowObjectiveModal(false);
    socket.emit('objective-update', { option: 'objective', value: e.detail.value });
  };

  const handleExperienceConfirmed = (e:any) => {
    setSelectedExperience(e.detail.value);
    setShowExperienceModal(false);
    socket?.emit('experience-update', { Option: 'experience', value: e.detail.value})
  };

  const onAnswerChange = (choice:string) => {
    const updatedAnswers = selectedAnswers.includes(choice)
    ? selectedAnswers.filter((item:string) => item !== choice)
    : [...selectedAnswers, choice];
    setSelectedAnswers(updatedAnswers);
  }

  const handleRoutineChange = (e:any) => {
    setShowRoutineModal(false);
    socket?.emit('routine-update', {Option: 'routine', value: selectedAnswers} )
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Training Preferences</IonCardTitle>
      </IonCardHeader>
      
      <IonCardContent>
      <div className='TrainingContainer'>
          <IonItem>
            <IonIcon icon={calendarOutline}></IonIcon>
            <IonLabel>Routine</IonLabel>
            <IonButton onClick={() => setShowRoutineModal(true)} className="duration-button">
              {routineLabel}
            </IonButton>
            <IonModal isOpen={showRoutineModal} onDidDismiss={() => setShowRoutineModal(false)}>
              <RoutineContainer choices= {routineChoices} selectedAnswers = {selectedAnswers} onAnswerChange = {onAnswerChange} handleRoutineChange = {handleRoutineChange}/>
              <IonButton onClick={() => setShowRoutineModal(false)}>Cancel</IonButton>
            </IonModal>
          </IonItem>
          <IonItem>
            <IonIcon icon={timerOutline}></IonIcon>
            <IonLabel>Duration</IonLabel>
            <IonButton onClick={() => setShowDurationModal(true)} className="duration-button">
              {durationLabel}
            </IonButton>
            <IonModal isOpen={showDurationModal} onDidDismiss={() => setShowDurationModal(false)}>
              <DurationSelector onConfirm={handleDurationConfirmed} />
              <IonButton onClick={() => setShowDurationModal(false)}>Cancel</IonButton>
            </IonModal>
          </IonItem>

          <IonItem>
            <IonIcon icon={starOutline}> </IonIcon>
            <IonLabel>Objective</IonLabel>
            <IonButton onClick={() => setShowObjectiveModal(true)} className="duration-button">
              {selectedObjective}
            </IonButton>
            <IonModal isOpen={showObjectiveModal} onDidDismiss={() => setShowObjectiveModal(false)}>
              <ChoiceSelectorContainer
              options={ObjectiveOptions}
              selectedOption={selectedObjective}
              onChange={handleObjectiveConfirmed} />
              <IonButton onClick={() => setShowObjectiveModal(false)}>Cancel</IonButton>
            </IonModal>
          </IonItem>
          <IonItem>
            <IonIcon icon={barbellOutline}> </IonIcon>
            <IonLabel>Equipment</IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon icon={rocketOutline}> </IonIcon>
            <IonLabel>{weeklyGoalLabel}</IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon icon={planetOutline}> </IonIcon>
            <IonLabel>Experience</IonLabel>
            <IonButton onClick={() => setShowExperienceModal(true)} className="duration-button">
              {selectedExperience}
            </IonButton>
            <IonModal isOpen={showExperienceModal} onDidDismiss={() => setShowExperienceModal(false)}>
              <ChoiceSelectorContainer
              options={ExperienceOptions}
              selectedOption={selectedExperience}
              onChange={handleExperienceConfirmed}/>
              <IonButton onClick={() => setShowObjectiveModal(false)}>Cancel</IonButton>
            </IonModal>
          </IonItem>
        </div>
      </IonCardContent>

    </IonCard>
    
        
  );
};

export default TrainingContainer;
