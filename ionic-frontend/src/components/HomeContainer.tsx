import { IonButton } from '@ionic/react';
import {useHistory} from 'react-router-dom';

import './ExploreContainer.css';
import { useEffect, useState } from 'react';
import { useSocket } from '../contexts/socketContext';


interface HomeContainerProps {
  name: string;
}

const HomeContainer: React.FC<HomeContainerProps> = ({ name }) => {
  const history = useHistory();
  var [ROOM, setROOM] = useState<string>("");
  const { socket, connect, disconnect } = useSocket();
  const [widgetUrl, setWidgetUrl] = useState<string | null>(null);
  const goToChat = () => {
    //Go to chat page
    history.push('/chat')
  }
  useEffect(() => {
    connect();
    socket?.on('joined-room', (data) => {
      //Data format: {room:string}
      var room = data.room;
      setROOM(room);
    });
    socket?.on('terra-auth-url', (data) => {
      var url = data.url;
      setWidgetUrl(url);
      console.log(url);
      //Change window location to the url
      window.location.href = url;
    });
    return () => {
      disconnect();
    };
  }, [socket, connect, disconnect]);

    const connectTerraAPI = () => {
      socket?.emit('terra-auth', {room:ROOM});
        //const fetchData = async () => {
        //    const url = "https://api.tryterra.co/v2/auth/generateWidgetSession";
        //    const payload = {
        //        reference_id: "your_users_id",
        //        providers: "GARMIN,WITHINGS,FITBIT,GOOGLE,OURA,WAHOO,PELOTON,ZWIFT,TRAININGPEAKS,FREESTYLELIBRE,DEXCOM,COROS,HUAWEI,OMRON,RENPHO,POLAR,SUUNTO,EIGHT,APPLE,CONCEPT2,WHOOP,IFIT,TEMPO,CRONOMETER,FATSECRET,NUTRACHECK,UNDERARMOUR",
        //        auth_success_redirect_url: "https://gymbroai.netlify.app/auth/redirect",
        //        language: "en"
        //    };
        //    const headers = {
        //        "accept": "application/json",
        //        "dev-id": "testingTerra",
        //        "content-type": "application/json",
        //        "x-api-key": "ussv5SAQ53a1nNTxsMr9G41zj2KUhYMk5eDU1hjG"
        //    };

        //    try {
        //        const response = await fetch(url, {
        //            method: 'POST',
        //            headers: headers,
        //            body: JSON.stringify(payload)
        //        });

        //        if (!response.ok) {
        //            throw new Error('Network response was not ok');
        //        }

        //        const data = await response.json();
        //        setWidgetUrl(data.url);
        //        console.log(data.url);
        //        window.location.href = data.url;
        //    } catch (error) {
        //        console.error('There was an error fetching the widget URL:', error);
        //    }
        //};

        //fetchData();
    };

  return (
    <div className="container text-start">
      <h1>Welcome!</h1>
      <div className='mb-2'>Ready for your next workout</div>
      <button className='w-full bg-gradient-to-r from-cyan-700 to-blue-700 p-10 mb-2' onClick={(e)=>goToChat()}>Chat With Trainer</button>
      <button className='w-full bg-gradient-to-r from-green-500 to-cyan-900 p-10 mb-2' onClick={(e)=>connectTerraAPI()}>Connect to TERRA Api</button>
    </div>
  );
};

export default HomeContainer;
