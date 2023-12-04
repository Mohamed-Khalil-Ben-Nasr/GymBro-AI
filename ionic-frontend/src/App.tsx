import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { chatbubbleEllipses, ellipse, home, person, square, text, triangle } from 'ionicons/icons';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Settings from './pages/Settings';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

///* Optional CSS utils that can be commented out */
//import '@ionic/react/css/padding.css';
//import '@ionic/react/css/float-elements.css';
//import '@ionic/react/css/text-alignment.css';
//import '@ionic/react/css/text-transformation.css';
//import '@ionic/react/css/flex-utils.css';
//import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/tailwind.css';
import { SocketProvider } from './contexts/socketContext';
import TerraAuth from './pages/TerraAuth';

setupIonicReact();

const App: React.FC = () => (
  <SocketProvider>
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/chat">
            <Chat />
          </Route>
          <Route path="/settings">
            <Settings />
          </Route>
          <Route path="/auth/terra">
            <TerraAuth />
            </Route>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="home" href="/home">
            <IonIcon aria-hidden="true" icon={home} />
          </IonTabButton>
          <IonTabButton tab="chat" href="/chat">
            <IonIcon aria-hidden="true" icon={chatbubbleEllipses} />
          </IonTabButton>
          <IonTabButton tab="settings" href="/settings">
            <IonIcon aria-hidden="true" icon={person} />
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
</SocketProvider>
);

export default App;
