// DurationSelector.js
import React, { useState } from 'react';
import { IonButton, IonInput, IonItem, IonLabel } from '@ionic/react';

type OnConfirmType = (duration: { hours: number; minutes: number; seconds: number }) => void;

interface DurationSelectorOps{
    onConfirm : OnConfirmType;
}

const DurationSelector:React.FC<DurationSelectorOps> = ({ onConfirm }) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const handleConfirm = () => {
    const duration = {
      hours,
      minutes,
      seconds,
    };
    onConfirm(duration);
  };

  return (
    <div>
      <IonItem>
        <IonLabel position="floating">Hours</IonLabel>
        <IonInput
          type="number"
          value={hours}
          onIonChange={(e) => setHours(Number(e.detail.value))}
        ></IonInput>
      </IonItem>

      <IonItem>
        <IonLabel position="floating">Minutes</IonLabel>
        <IonInput
          type="number"
          value={minutes}
          onIonChange={(e) => setMinutes(Number(e.detail.value))}
        ></IonInput>
      </IonItem>

      <IonItem>
        <IonLabel position="floating">Seconds</IonLabel>
        <IonInput
          type="number"
          value={seconds}
          onIonChange={(e) => setSeconds(Number(e.detail.value))}
        ></IonInput>
      </IonItem>

      <IonButton expand='full' onClick={handleConfirm}>Confirm</IonButton>
    </div>
  );
};

export default DurationSelector;
