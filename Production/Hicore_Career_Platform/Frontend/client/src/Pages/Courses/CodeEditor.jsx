import React, { useState } from 'react';
import CodeIcon from '../../assets/Code.png';
import OutputIcon from '../../assets/Web.png';
import BotIcon from '../../assets/bot.png';
import ChatbotPopup from './ChatBotPopup';

const CodeEditor = () => {
  const [showChat, setShowChat] = useState(false);
  const codePlaceholder = 'Write your code here...';

  return (
    <div
      className="relative flex flex-col gap-4 rounded-[8px] border border-white p-2 bg-[#F3F3FB]"

    >
      {/* Live Code Editor Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-[#343079] text-[16px] font-normal leading-[32px] font-poppins">
          <img src={CodeIcon} alt="Code Icon" className="w-4 h-4" />
          Live code editor
        </div>

        <div
          className="rounded-[4px] border border-white bg-white p-2"
          style={{ width: '100%', height: '260px' }}
        >
          <textarea
            className="w-full h-full resize-none outline-none text-sm font-poppins text-[#343079]"
            placeholder={codePlaceholder}
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3">
          <button className="flex-1 min-w-[120px] h-[36px] bg-[#343079] text-white rounded-[4px] border border-[#343079] text-sm font-medium font-poppins px-4">
            Run Code
          </button>
          <button className="flex-1 min-w-[120px] h-[36px] bg-[#343079] text-white rounded-[4px] border border-[#343079] text-sm font-medium font-poppins px-4">
            Reset
          </button>
          <button className="flex-1 min-w-[120px] h-[36px] bg-[#EBEAF2] text-[#343079] rounded-[4px] border border-[#343079] text-sm font-medium font-poppins px-4">
            Download
          </button>
        </div>
      </div>

      {/* Output Section */}
      <div
        className="relative flex flex-col gap-4 p-4 rounded-[4px] border border-white bg-[#F3F3FB] w-full"
        style={{ height: '400px' }}
      >
        <div className="flex items-center gap-2 text-[#343079] text-[16px] font-normal leading-[32px] font-poppins">
          <img src={OutputIcon} alt="Output Icon" className="w-4 h-4" />
          Live Output
        </div>

        <div
          className="rounded-[4px] border border-white bg-white p-2 text-[12px] font-normal text-[#343079] font-poppins"
          style={{ height: '320px' }}
        >
          <iframe
            title="Live Preview"
            sandbox="allow-scripts"
            frameBorder="0"
            className="w-full h-full"
          />
        </div>

        {/* Floating Bot Icon */}
        <button
          onClick={() => setShowChat(true)}
          className="absolute bottom-[340px] right-[20px] w-[72px] h-[72px] bg-[#343079] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition duration-300 ease-out z-10"
        >
          <img src={BotIcon} alt="Chatbot Icon" className="w-10 h-10" />
        </button>

        {/* Show in new tab button */}
        <button className="w-full h-[36px] bg-[#343079] text-white font-medium text-sm font-poppins rounded-[4px] flex justify-center items-center gap-2 px-4 border border-[#343079] mt-4">
          Show me in new tab
        </button>
      </div>

      {/* Chatbot popup if open */}
      {showChat && <ChatbotPopup onClose={() => setShowChat(false)} />}
    </div>
  );
};

export default CodeEditor;









