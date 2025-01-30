'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({});

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center px-4 py-6">
      <div className="w-full max-w-md flex flex-col bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="flex-grow p-4 space-y-2 overflow-auto">
          {messages.map(message => (
            <div
              key={message.id}
              className={`max-w-md p-3 rounded-lg ${
                message.role === 'user'
                  ? 'ml-auto bg-blue-600 text-white text-right'
                  : 'mr-auto bg-gray-200 text-black'
              }`}
            >
              <div className={`font-bold ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                {message.role === 'user' ? 'You' : 'Bot'}
              </div>
              <div className="mt-1">
                {message.content}
              </div>
            </div>
          ))}
        </div>

        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"/>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 flex space-x-2 bg-gray-50">
          <input
            name="prompt"
            value={input}
            onChange={handleInputChange}
            className="flex-grow border rounded p-2 border-gray-300"
            placeholder="Type your message..."
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}