import React, { useState } from 'react';
import './App.css';

export function ChatBot () {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Add the user's input to the messages array
    setMessages([...messages, { user: true, text: input }]);

    // Clear the input field
    setInput('');

    // Generate a response using the ChatGPT API and add it to the messages array
    generateResponse()
      .then((response) => {
        setMessages([...messages, { user: false, text: response }]);
      });
  }

  const generateResponse = async () => {
    // Your ChatGPT API key
    const apiKey = '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'
      
    // The context for the conversation (previous messages)
    const context = messages
      .filter((message) => !message.user)
      .map((message) => message.text)
      .join('\n');

    // The user's message
    const prompt = input;

    // The URL for the ChatGPT API
    const url = "https://api.openai.com/v1/completions";

    const data = {
          prompt,
          model: 'text-davinci-003',
          temperature: 0.5,
          max_tokens: 128,
      };
    
      // Generate a response using the ChatGPT API
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(data)
      });
    
      const json = await response.json();
    
      // Check if the json object is defined
      if (json) {
        // Return the response from the ChatGPT API
        return json.choices[0].text;
      } else {
        // Return a default message if the json object is not defined
        return 'Sorry, I am unable to generate a response at this time.';
      }  
  }

  return (
    <div className="chat-bot">
      <h1>Chat Bot</h1>

      {/* Display the messages in a list */}
      <ul>
        {messages.map((message, index) => (
          <li key={index} className={message.user ? 'user' : ''}>
            {message.user ? 'You' : 'Bot'}: {message.text}
          </li>
        ))}
      </ul>

      {/* Input form for sending messages */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your message"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};


