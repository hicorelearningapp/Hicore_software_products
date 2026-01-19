import React from 'react';
import { FaLightbulb, FaInfoCircle } from 'react-icons/fa';

const renderContent = (item, index) => {
  switch (item.type) {
    case 'heading':
      if (item.level === 2)
        return (
          <h2 key={index} className="text-[#343079] font-semibold text-[20px] mb-4 leading-[32px]">
            {item.text}
          </h2>
        );
      if (item.level === 3)
        return (
          <h3 key={index} className="bg-[#D1E5FF] text-[#343079] font-bold text-[16px] leading-[32px] px-2 py-1 my-3 w-fit rounded">
            {item.text}
          </h3>
        );
      if (item.level === 4)
        return (
          <h4 key={index} className="text-[#343079] font-bold text-[16px] leading-[24px] mt-4">
            {item.text}
          </h4>
        );
      if (item.level === 5)
        return (
          <h5 key={index} className="text-[#343079] font-semibold text-[14px] leading-[24px] mt-3">
            {item.text}
          </h5>
        );
      return <h4 key={index} className="text-md font-medium">{item.text}</h4>;

    case 'paragraph':
      return <p key={index} className="text-[#343079] text-[14px] leading-[24px]">{item.text}</p>;

    case 'ans':
      return (
        <div key={index} className="text-[#008000] text-[14px] leading-[24px] font-poppins">
          <span className="font-semibold">{item.heading}</span> {item.content}
        </div>
      );

    case 'list':
      return (
        <ul key={index} className="list-disc text-[#343079] text-[14px] leading-[24px] ml-5 space-y-1">
          {item.items.map((li, i) => (
            <li key={i} className="whitespace-pre-line">{li}</li>
          ))}
        </ul>
      );

    case 'table':
      return (
        <div key={index} className="overflow-x-auto my-4">
          <table className="min-w-full table-auto border border-gray-300 text-left text-[#343079] text-sm">
            <thead className="bg-gray-100">
              <tr>
                {item.headers.map((header, i) => (
                  <th key={i} className="px-4 py-2 border border-[#EBEAF2] text-[#343079] font-bold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {item.rows.map((row, i) => (
                <tr key={i} className="bg-white">
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-2 border border-[#EBEAF2]">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'tiprow':
      return (
        <div key={index} className="flex flex-col md:flex-row gap-4 w-full mt-4">
          <div className="flex flex-col p-3 bg-[#FFFBEA] border-l-4 border-yellow-400 rounded-r-lg w-full md:w-1/2">
            <div className="flex items-center gap-2 mb-1">
              <FaLightbulb className="text-yellow-500 w-4 h-4" />
              <h5 className="text-[#F59E0B] text-[14px] font-semibold leading-[24px]">Quick Tip</h5>
            </div>
            <ul className="pl-4 text-[14px] text-[#343079] space-y-1 leading-[22px]">
              {item.quickTip.map((tip, i) => <li key={i}>{tip}</li>)}
            </ul>
          </div>
          <div className="flex flex-col p-3 bg-[#E5F4FD] border-l-4 border-blue-400 rounded-r-lg w-full md:w-1/2">
            <div className="flex items-center gap-2 mb-1">
              <FaInfoCircle className="text-blue-500 w-4 h-4" />
              <h5 className="text-[#2563EB] text-[14px] font-semibold leading-[24px]">Did You Know?</h5>
            </div>
            <ul className="pl-4 text-[14px] text-[#343079] space-y-1 leading-[22px]">
              {item.didYouKnow.map((fact, i) => <li key={i}>{fact}</li>)}
            </ul>
          </div>
        </div>
      );

    default:
      return null;
  }
};

const DynamicTopicRenderer = ({ lessonContent }) => {
  if (!lessonContent || lessonContent.length === 0) {
    return <p>Select a topic to begin.</p>;
  }

  return (
    <div className="space-y-3 text-[#343079] font-poppins">
      {lessonContent.map((item, index) => renderContent(item, index))}
    </div>
  );
};

export default DynamicTopicRenderer;