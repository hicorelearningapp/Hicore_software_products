import React from "react";
// import Editor from "@monaco-editor/react";

const DynamicTopicRender = ({ content }) => {
  return (
    <div className="space-y-4">
      {content.map((item, idx) => {
        switch (item.type) {
         case "heading":
  const HeadingTag = `h${item.level || 2}`;
  const id = item.text.toLowerCase().replace(/\s+/g, "-");
  return (
    <HeadingTag key={idx} id={id} className="font-bold text-xl scroll-mt-24">
      {item.text}
    </HeadingTag>
  );

          case "paragraph":
            return (
              <p key={idx} className="text-gray-700">
                {item.text}
              </p>
            );

          case "quote":
            return (
              <blockquote
                key={idx}
                className="border-l-4 border-blue-500 pl-4 italic text-gray-600"
              >
                {item.text}
              </blockquote>
            );

          // case "code":
          //   return (
          //     <div key={idx} className="border rounded bg-gray-900 overflow-hidden">
          //       <Editor
          //         height="200px"
          //         language={item.language || "plaintext"}
          //         value={item.content}
          //         theme="vs-dark"
          //         options={{ readOnly: true }}
          //       />
          //     </div>
          //   );

          case "list":
            return (
              <ul key={idx} className="list-disc pl-6">
                {item.items.map((listItem, listIdx) => (
                  <li key={listIdx}>{listItem}</li>
                ))}
              </ul>
            );

          case "ordered-list":
            return (
              <ol key={idx} className="list-decimal pl-6">
                {item.items.map((listItem, listIdx) => (
                  <li key={listIdx}>{listItem}</li>
                ))}
              </ol>
            );

          case "banner":
            return (
              <div
                key={idx}
                className="bg-yellow-100 border-l-4 border-yellow-500 p-4 text-yellow-700"
              >
                <h3 className="font-bold">{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            );

          case "table":
            return (
              <div key={idx} className="overflow-x-auto">
                <table className="table-auto border-collapse border border-gray-400">
                  <thead>
                    <tr>
                      {item.headers.map((header, headerIdx) => (
                        <th
                          key={headerIdx}
                          className="border border-gray-300 px-2 py-1 bg-gray-200"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {item.rows.map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        {row.map((cell, cellIdx) => (
                          <td
                            key={cellIdx}
                            className="border border-gray-300 px-2 py-1"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "image":
            return (
              <img
                key={idx}
                src={item.src}
                alt={item.alt || "image"}
                className="w-64 max-w-full h-auto rounded shadow"
                onError={(e) => {
                  if (e.target.src !== "/placeholder.png") {
                    e.target.src = "/placeholder.png";
                  }
                }}
              />
            );

          case "link":
            return (
              <a
                key={idx}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {item.text}
              </a>
            );

          case "video":
            return (
              <div key={idx} className="relative pt-[56.25%]">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={item.src}
                  title={item.title || "Video"}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            );

          case "spacer":
            return <div key={idx} style={{ height: item.size || "20px" }} />;

          case "divider":
            return <hr key={idx} className="my-4 border-gray-300" />;

          case "callout":
            return (
              <div
                key={idx}
                className={`p-4 border-l-4 ${
                  item.color || "border-blue-500"
                } bg-gray-100 rounded`}
              >
                <strong className="block mb-1">{item.title}</strong>
                <span>{item.content}</span>
              </div>
            );

          case "collapsible":
            return (
              <details key={idx} className="border rounded p-2">
                <summary className="cursor-pointer font-semibold">{item.title}</summary>
                <div className="mt-2">
                  {Array.isArray(item.content) ? (
                    <DynamicTopicRender content={item.content} />
                  ) : (
                    item.content
                  )}
                </div>
              </details>
            );

          case "badge":
            return (
              <span
                key={idx}
                className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full"
              >
                {item.text}
              </span>
            );

          case "html":
            return (
              <div
                key={idx}
                dangerouslySetInnerHTML={{ __html: item.html }}
              />
            );

          case "note":
            return (
              <div
                key={idx}
                className="p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-700"
              >
                <strong>Note:</strong> {item.text}
              </div>
            );

          default:
            console.warn("Unknown content type:", item.type);
            return null;
        }
      })}
    </div>
  );
};

export default DynamicTopicRender;
