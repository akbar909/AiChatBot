import axios from "axios";
import { useState } from "react";
import { RiSendPlaneFill } from "react-icons/ri";
import ReactMarkdown from "react-markdown";

function Gemini() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [messages, setMessages] = useState([]);

  async function generateAnswer(e) {
    e.preventDefault();
    setGeneratingAnswer(true);
    setMessages([...messages, { sender: "user", content: question }]);

    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCmc7dqywkwJ0zI0w02LRizlzg9qqN2Q10`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });

      const generatedAnswer = response.data.candidates[0].content.parts[0].text;
      setAnswer(generatedAnswer);
      setMessages([...messages, { sender: "user", content: question }, { sender: "bot", content: generatedAnswer }]);
    } catch (error) {
      console.log(error);
      setAnswer("Sorry - Something went wrong. Please try again!");
      setMessages([...messages, { sender: "user", content: question }, { sender: "bot", content: "Sorry - Something went wrong. Please try again!" }]);
    }

    setGeneratingAnswer(false);
    setQuestion("");
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 h-screen flex flex-col justify-between items-center">
      <header className="w-full md:w-2/3 lg:w-1/2 xl:w-1/2 text-center p-1 bg-white shadow-lg rounded-lg">
        <a href="https://github.com/akbar909/" target="_blank" rel="noopener noreferrer">
          <h1 className="text-4xl font-bold text-blue-500 ">AI Chat</h1>
        </a>
      </header>
      
      <div className="chat-container w-full md:w-2/3 lg:w-1/2 xl:w-1/2 p-4 flex flex-col gap-2 overflow-y-auto mb-[68px]">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message p-2 rounded-xl max-w-[80%] break-words ${
              message.sender === "user"
                ? "self-end bg-blue-200 text-gray-700"
                : "self-start bg-gray-200 text-gray-700"
            }`}
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        ))}

        {/* Show typing loader if generatingAnswer is true */}
        {generatingAnswer && (
          <div className="message p-2 rounded-xl max-w-[70%] break-words self-start bg-gray-200 text-gray-700">
            <ReactMarkdown>AI is typing...</ReactMarkdown>
          </div>
        )}
      </div>
      
      <form
        onSubmit={generateAnswer}
        className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full md:w-2/3 lg:w-1/2 xl:w-1/2 bg-white text-center rounded-lg shadow-lg px-2 py-2 transition-all duration-500 flex items-center"
      >
        <textarea
          required
          className="border border-gray-300 rounded w-full  p-2 transition-all duration-300 focus:border-blue-400 focus:shadow-lg"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask anything"
        ></textarea>
        <button
          type="submit"
          className={`flex items-center justify-center ml-2 p-3 rounded-md text-white bg-blue-500 hover:bg-blue-600 transition-all duration-300 ${
            generatingAnswer ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={generatingAnswer}
        >
          <RiSendPlaneFill size={24} />
        </button>
      </form>
    </div>
  );
}

export default Gemini;
