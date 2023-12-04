import React, { useState } from 'react';
import { IonButton, IonText, IonInput, IonItem, IonLabel } from '@ionic/react';

type OnConfirmType = (age: number) => void;

interface AgeSelectorProps{
    OnConfirm : OnConfirmType;
}

const AgeSelector:React.FC<AgeSelectorProps> = ({ OnConfirm }) => {
  const [age, setAge] = useState(0);
  const [errorMessage, setErrorMessage] = useState(''); // Initialize error message state
  const handleConfirm = () => {
    if (age > 0) {
        OnConfirm(age);
        setErrorMessage(''); // Clear the error message if age is valid
    } else {
        // Display an error message to the user
        setErrorMessage('Age must be greater than 0');
    }
  }

  return (
    <div>
      <IonItem>
        <IonLabel position="floating">years</IonLabel>
        <IonInput
          type="number"
          value={age}
          onIonChange={(e) => setAge(Number(e.detail.value))}
        ></IonInput>
      </IonItem>
      <IonButton expand='full' onClick={handleConfirm}>Confirm</IonButton>
      {errorMessage && <IonText color="danger">{errorMessage}</IonText>}
    </div>
  );
};

export default AgeSelector;
