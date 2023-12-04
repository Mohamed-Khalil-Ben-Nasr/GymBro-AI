// DurationSelector.js
import React, { useState } from 'react';
import { IonButton, IonInput, IonItem, IonLabel } from '@ionic/react';

type OnConfirmType = (height: { feet: number; inches: number}) => void;

interface HeightSelectorProps{
    OnConfirm : OnConfirmType;
}


const HeightSelector:React.FC<HeightSelectorProps> = ({ OnConfirm }) => {
  const [feet, setFeet] = useState(0);
  const [inches, setInches] = useState(0);

  const handleConfirm = () => {
    const height = {
      feet,
      inches,
    };
    OnConfirm(height);
  };

  return (
    <div>
      <IonItem>
        <IonLabel position="floating">ft</IonLabel>
        <IonInput
          type="number"
          value={feet}
          onIonChange={(e) => setFeet(Number(e.detail.value))}
        ></IonInput>
      </IonItem>
      <IonItem>
        <IonLabel position="floating">inch</IonLabel>
        <IonInput
          type="number"
          value={inches}
          onIonChange={(e) => setInches(Number(e.detail.value))}
        ></IonInput>
      </IonItem>
      <IonButton expand='full' onClick={handleConfirm}>Confirm</IonButton>
    </div>
  );
};

export default HeightSelector;
