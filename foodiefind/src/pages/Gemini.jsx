import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

//code components borrowed from https://github.com/becodewala-youtube/react-ai-chatbot/blob/main/OneDrive/Desktop/New%20folder/from%20solo/react%20projects/ai-chatbot/src/App.js

function Gemini() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (input.trim()) {
      const newMessages = [...messages, { text: input, user: true }];
      setMessages(newMessages);
      setInput('');

      try {
        setLoading(true);
        const response = await axios.post(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyArPM7lrMXJlMJsHHVJEq08IpYPiX_hCmA',
          {
            "contents": [
              {
                "parts": [
                  {
                    "text": input
                  }
                ]
              }
            ]
          }
        );
        console.log(response);
        const botResponse = response.data.candidates[0].content.parts[0].text;
        setLoading(false);
        setMessages([...newMessages, { text: botResponse, user: false }]);
      } catch (error) {
        console.error('Error sending message:', error);
        setLoading(false);
        setMessages([...newMessages, { text: 'Error: Could not get response from AI', user: false }]);
      }
    }
  };

  return (
    <div className="mx-auto w-1/2 shadow-2xl ">
      <div className="bg-white w-full shadow-lg border border-gray-300 rounded-lg overflow-hidden">
        {/* Logo Header */}
        <div className="bg-purple-800  text-white p-4 text-center">
          <div className="text-2xl font-bold">FoodieFind</div>
        </div>

        <div className="p-4 h-96 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.user ? 'justify-end' : 'justify-start'} mb-2`}>
              <div className={`rounded-lg p-2 shadow-xl overflow-x-hidden flex flex-wrap ${msg.user ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                <ReactMarkdown>
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
          ))}
            {loading && (
                <div className="flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}
        </div>
        <div className="p-4 border-t border-gray-200 flex">
          <input
            type="text"
            className="flex-1 p-2 border border-gray-300 rounded-lg outline-none"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            className="ml-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Gemini;