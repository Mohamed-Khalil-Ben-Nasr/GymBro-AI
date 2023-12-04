// MultipleChoiceInput.js
import React, { useState } from 'react';
import { IonRadioGroup, IonRadio, IonLabel, IonItem, IonList, IonButton } from '@ionic/react';

interface ChoiceSelectorContainerProps {
  options: { label: string, value: string }[];
  selectedOption: string;
  onChange: (e: any) => void;
}

const ChoiceSelectorContainer:React.FC<ChoiceSelectorContainerProps> = ({ options, selectedOption, onChange}) => {
  return (
    <div>
        <IonList>
        <IonRadioGroup value={selectedOption} onIonChange={onChange}>
            {options.map((option, index) => (
            <IonItem key={index}>
                <IonLabel>{option.label}</IonLabel>
                <IonRadio slot="start" value={option.value} />
            </IonItem>
            ))}
        </IonRadioGroup>
        </IonList>
        <IonButton expand='full' >Confirm</IonButton>
    </div>
    
  );
};

export default ChoiceSelectorContainer;
