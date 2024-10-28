import { GoogleGenerativeAI } from "@google/generative-ai";
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';
import Footer from './component/Footer';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function ChatResponse({ responseText }) {
  return (
    <div className="text-white max-w-none mt-4">
      <ReactMarkdown
        components={{
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold text-slate-200 my-4">
              {children}
            </h2>
          ),
          p: ({ children }) => (
            <p className="text-gray-200 leading-relaxed mb-2">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside pl-5 my-2">
              {children}
            </ul>
          ),
          li: ({ children }) => (
            <li className="text-black mb-1">{children}</li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-slate-200">
              {children}
            </strong>
          ),
        }}
      >
        {responseText}
      </ReactMarkdown>
    </div>
  );
}
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
      return "Sorry, I couldn't generate a response. Please adjust your API key or add your own model.";
    }
  }

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
      setMessages((prevMessages) => [...prevMessages, { sender: 'ai', text: aiResponse }]);
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
    <>
      <div className='container mx-auto p-4 min-h-screen'>
        <div className='font-bold text-3xl text-center flex justify-center my-10'>
          <span>Chai with </span>
          <span className='bg-red-500 rounded-lg p-1 mx-2'>Gemini</span>
        </div>
        <div className='max-w-4xl mx-auto'>
          <textarea
            className='w-full h-40 p-2 border rounded-lg'
            value={inputText}
            onChange={handleInputChange}
            placeholder='Type your message here...'
          ></textarea>
          <div className='flex flex-wrap justify-center mt-2'>
            <button
              className='p-2 bg-blue-500 text-white rounded-lg m-2'
              onClick={handleSubmit}
              disabled={loading}
            >
              Submit
            </button>
            <button
              className='p-2 bg-blue-500 text-white rounded-lg m-2'
              onClick={() => setMessages([])}
              disabled={loading}
            >
              New Message
            </button>
          </div>
          <div className='mt-4'>
            {messages.map((msg, index) => (
              <div key={index} className={`p-2 my-2 rounded-lg ${msg.sender === 'ai' ? 'bg-gray-600' : 'bg-gray-600 text-white'}`}>
                <strong>{msg.sender === 'ai' ? 'AI: ' : 'You: '}</strong>
                {msg.sender === 'ai' ? (
                  <ChatResponse responseText={msg.text}/>
                ) : (
                  msg.text
                )}
              </div>
            ))}
            {loading && <div className='p-2 my-2 bg-slate-500 rounded-lg text-black'>Generating response...✨</div>}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;
