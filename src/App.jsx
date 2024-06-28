import React, { useState } from 'react';
import './App.css';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function App() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function run(promptByUser) {
    const prompt = promptByUser;
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
      return text;
    } catch (error) {
      console.error("Error generating content:", error);
      return "Sorry, I couldn't generate a response.";
    }
  }

  const formatAIResponse = (response) => {
    const paragraphs = response.split('\n\n');

    // Format each paragraph with AI prefix
    const formattedResponse = paragraphs.map((paragraph, index) => {
      return `${paragraph}`;
    }).join('\n\n');

    return formattedResponse;
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const sendMessage = async (message) => {
    setLoading(true);
    const userMessage = message;
    setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: userMessage }]);
    setInputText('');

    try {
      const aiResponse = await run(userMessage);
      const formattedResponse = formatAIResponse(aiResponse);
      setMessages((prevMessages) => [...prevMessages, { sender: 'ai', text: formattedResponse }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) => [...prevMessages, { sender: 'ai', text: "Error: Failed to generate response." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (inputText.trim()) {
      sendMessage(inputText);
    }
  };

  return (
    <div className="App">
      <div className='font-bold text-3xl text-center flex mx-80 px-20 my-20 justify-center'>
        <span>Chai with </span>
        <span className='bg-red-500 box-border rounded-lg p-1'>Gemini</span>
      </div>
      <div className='mx-80'>
        <textarea
          className='w-full md:w-full h-40 p-2 border rounded-lg'
          value={inputText}
          onChange={handleInputChange}
          placeholder='Type your message here...'
        ></textarea>
        <button
          className='mt-2 p-2 bg-blue-500 text-white rounded-lg'
          onClick={handleSubmit}
          disabled={loading}
        >
          Submit
        </button>
        <button
          className='mt-2 p-2 mx-8 bg-blue-500 text-white rounded-lg'
          onClick={() => setMessages([])}
          disabled={loading}
        >
          New Message
        </button>

        <div className='mt-4'>
          {messages.map((msg, index) => (
            <div key={index} className={`p-2 my-2 bg-gray-600 rounded-lg text-white ${msg.sender === 'ai' ? 'bg-gray-200' : 'bg-gray-200'}`}>
              <strong>{msg.sender === 'ai' ? 'AI: ' : 'You: '}</strong>{msg.text}
            </div>
          ))}
          {loading && <div className='p-2 my-2 bg-yellow-200 rounded-lg text-black'>Generating response...</div>}
        </div>
      </div>
    </div>
  );
}

export default App;
