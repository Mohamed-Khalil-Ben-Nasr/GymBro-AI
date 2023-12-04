// account/name/weight/height/units/age
import './RountineContainer.css';
import { IonPage, IonContent, IonItem, IonLabel } from '@ionic/react';
import { IonIcon } from '@ionic/react';
import { alarmOutline, barChartOutline, barbellOutline, bodyOutline, calendarOutline, diamondOutline, personOutline, planetOutline, rocketOutline, scaleOutline, starOutline, timerOutline } from 'ionicons/icons';
import { useState } from 'react';
import { IonButton, IonModal } from '@ionic/react';
import WeightSelector from './WeightSelectorContainer';
import HeightSelector from './HeightSelectorContainer';
import AgeSelector from './AgeSelectorContainer';
import ChoiceSelectorContainer from './ChoiceSelectorContainer';
import { useSocket} from '../contexts/socketContext';
import { useEffect } from 'react';
import React from 'react';
import { IonCheckbox, IonList } from '@ionic/react';

interface RoutineContainerProps {
    name: string;
}

const RoutineContainer: React.FC<RoutineContainerProps> = ({ choices, selectedAnswers, onAnswerChange, handleRoutineChange }) => {
    
    const handleAnswerChange = (choice:string) => {
        const updatedAnswers = selectedAnswers.includes(choice)
          ? selectedAnswers.filter((item:string) => item !== choice)
          : [...selectedAnswers, choice];
    
        onAnswerChange(updatedAnswers);
      };
    
      return (
        <div>
          <IonList>
          {choices.map((choice:any) => (
            <IonItem key={choice}>
              <IonLabel>{choice}</IonLabel>
              <IonCheckbox
                slot="end"
                checked={selectedAnswers.includes(choice)}
                onIonChange={() => handleAnswerChange(choice)}
              />
            </IonItem>
          ))}
          </IonList>
          <IonButton expand= 'full' onClick={handleRoutineChange}>Confirm</IonButton>
        </div>
        
      );
    };
    
    export default RoutineContainer;
    
    
    
    
    
    