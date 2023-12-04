import './ExploreContainer.css';
import { IonPage, IonContent, IonGrid, IonRow, IonCol } from '@ionic/react';
import { IonIcon } from '@ionic/react';
import TrainingContainer from './TrainingContainer';
import YouContainer from './YouContainer';

interface SettingsContainerProps {
  name: string;
}

const SettingsContainer: React.FC<SettingsContainerProps> = ({ name }) => {
  return (
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol size="12">
              <TrainingContainer
                name="Training Container"
                routineLabel="3 day classic"
                durationLabel="30 minutes"
                objectiveLabel="Build strength"
                equipmentLabel="Dumbbells"
                weeklyGoalLabel="Gain muscle"
                experienceLabel="Intermediate"
              ></TrainingContainer>
            </IonCol>
            <IonCol size="12">
              <YouContainer name="YouContainer"></YouContainer>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
  );
};

export default SettingsContainer;
