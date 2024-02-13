import React, { useState } from 'react';
import { functions } from './config/firebase';
import { httpsCallable } from "firebase/functions";


function App() {
  const [messageText, setMessageText] = useState('');

  const helloWorld = httpsCallable(functions, 'helloWorld');

  const handleClick = () => {
    helloWorld({ text: messageText })
      .then((response) => {
        // Read result of the Cloud Function.
        const data = response.data;
        console.log('returned data:', data.result);
      })
      .catch((error) => {
        console.error('Error adding message:', error);
      });
  };

  const handleChange = (event) => {
    setMessageText(event.target.value);
  };

  return (
    <div>
      <input type="text" value={messageText} onChange={handleChange} />
      <button onClick={handleClick}>Add Message</button>
    </div>
  );
}

export default App;