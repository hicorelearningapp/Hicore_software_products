import React from 'react';
import EmojiIcon from '../../../assets/Emoji.png';
import AttachIcon from '../../../assets/Attachement.png';
import SendIcon from '../../../assets/Send.png';
import BotIcon from '../../../assets/bot.png';
import CancelIcon from '../../../assets/Cancel.png';
import chatbotContent from '../../../../data/chatbotContent';

const ChatbotPopup = ({ onClose }) => {
  return (
    <div className="fixed bottom-24 right-6 w-[361px] bg-white rounded-[16px] shadow-xl z-50 animate-slideIn border border-[#EBEAF2]">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#343079] text-white rounded-t-[16px] px-4 py-3">
        <div className="flex items-center gap-2">
          <img src={BotIcon} alt="Bot" className="w-6 h-6" />
          <div>
            <p className="text-sm font-semibold">{chatbotContent.header.botName}</p>
            <p className="text-xs opacity-80">{chatbotContent.header.subtitle}</p>
          </div>
        </div>
        <button onClick={onClose} className="text-white">
          <img src={CancelIcon} alt="Close" className="w-4 h-4" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col justify-between p-4 h-[317px] rounded-[8px]">
        {/* Messages */}
        <div className="flex flex-col gap-3 text-sm text-[#343079] font-poppins overflow-y-auto max-h-[240px] pr-2">
          {chatbotContent.messages.map((msg, index) => (
            <React.Fragment key={index}>
              {msg.time && (
                <p className="text-center text-xs text-gray-400">{msg.time}</p>
              )}

              <div className="flex items-end gap-2">
                {/* Bottom-aligned circular icon */}
                <div className="w-8 h-8 bg-[#343079] rounded-full flex items-center justify-center self-end">
                  <img src={BotIcon} alt="Bot" className="w-4 h-4" />
                </div>

                {/* Bot Message */}
                <div className="bg-[#F1EFFD] rounded-[12px] px-4 py-2 text-sm leading-5 max-w-[260px]">
                  {msg.title && <p className="font-semibold">{msg.title}</p>}
                  <p>{msg.text}</p>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Input Box */}
        <div className="mt-4 w-full flex items-center justify-between border border-[#EBEAF2] rounded-full px-4 py-[4px] h-[40px]">
          <input
            type="text"
            placeholder={chatbotContent.placeholders.input}
            className="flex-1 outline-none border-none text-sm text-[#343079] font-poppins placeholder-[#B0AEC0] bg-transparent"
          />
          <div className="flex items-center gap-2 ml-2">
            <img src={EmojiIcon} alt="Emoji" className="w-5 h-5 cursor-pointer" />
            <img src={AttachIcon} alt="Attach" className="w-5 h-5 cursor-pointer" />
            <img src={SendIcon} alt="Send" className="w-5 h-5 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Slide Animation */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideIn {
          animation: slideIn 300ms ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ChatbotPopup;
