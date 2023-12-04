// DurationSelector.js
import React, { useState } from 'react';
import { IonButton, IonInput, IonItem, IonLabel } from '@ionic/react';

type OnConfirmType = (weight: number) => void;

interface WeightSelectorProps{
    OnConfirm : OnConfirmType;
}

const WeightSelector:React.FC<WeightSelectorProps> = ({ OnConfirm }) => {
  const [weight, setWeight] = useState(0);
  const handleConfirm = () => {
    OnConfirm(weight);
  }

  return (
    <div>
      <IonItem>
        <IonLabel position="floating">lbs</IonLabel>
        <IonInput
          type="number"
          value={weight}
          onIonChange={(e) => setWeight(Number(e.detail.value))}
        ></IonInput>
      </IonItem>
      <IonButton expand='full' onClick={handleConfirm}>Confirm</IonButton>
    </div>
  );
};

export default WeightSelector;
