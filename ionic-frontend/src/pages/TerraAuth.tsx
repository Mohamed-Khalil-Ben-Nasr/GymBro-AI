import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const TerraAuth: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const userId = params.get('user_id'); // Assuming 'user_id' is the query parameter
        const history = useHistory();
        if (userId) {
            console.log("Received User ID:", userId);
            // You can now use the user ID for further processing
            // Store it, make additional API calls, etc.
            //Go to home:
            //Save on local storage:
            localStorage.setItem('terra-user-id', userId);
            history.push('/home');
        } else {
            console.error("Did not receive a user ID from the widget.");
        }
    }, [location]);

    return <div>Processing...</div>;
}

export default TerraAuth;
