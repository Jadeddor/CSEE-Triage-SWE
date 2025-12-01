import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "./features/button";
import { Input } from "./features/input";
import { Card, CardContent, CardHeader, CardTitle } from "./features/ui_features/card";
import { ScrollArea } from "./features/ui_features/scroll-area";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm the UMBC CSEE assistant. Ask me about courses, prerequisites, lab access, or advising.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const role = "guest"; // hardcoded for testing

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setInputMessage("");

    try {
    const response = await fetch("http://127.0.0.1:8000/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: inputMessage }),
    });


      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.answer || "Sorry, I couldn’t find an answer for that.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          content: "Error contacting backend.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-primary" />
          <span>CSEE Assistant</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender === "bot" && (
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}

                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {message.sender === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your question here..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-primary hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}





// import { useState, useRef, useEffect } from "react";
// import { Send, Bot, User } from "lucide-react";
// import { Button } from "./features/button";
// import { Input } from "./features/input";
// import { Card, CardContent, CardHeader, CardTitle } from "./features/ui_features/card";
// import { ScrollArea } from "./features/ui_features/scroll-area";

// interface Message {
//   id: string;
//   content: string;
//   sender: "user" | "bot";
//   timestamp: Date;
// }

// export default function ChatBot() {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: "1",
//       content:
//         "Hello! I'm the UMBC CSEE assistant. Ask me about courses, prerequisites, lab access, or advising.",
//       sender: "bot",
//       timestamp: new Date(),
//     },
//   ]);

//   const [inputMessage, setInputMessage] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const role = "guest"; // hardcoded for now

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSendMessage = async () => {
//     if (!inputMessage.trim()) return;

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       content: inputMessage,
//       sender: "user",
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setIsTyping(true);
//     setInputMessage("");

//     try {
//       const response = await fetch("http://127.0.0.1:5000/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: userMessage.content }),
//       });

//       const data = await response.json();

//       const botMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         content: data.answer || "Sorry, I couldn’t find an answer for that.",
//         sender: "bot",
//         timestamp: new Date(),
//       };

//       setMessages((prev) => [...prev, botMessage]);
//     } catch (error) {
//       console.error(error);
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: (Date.now() + 2).toString(),
//           content: "Error contacting backend.",
//           sender: "bot",
//           timestamp: new Date(),
//         },
//       ]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <Card className="h-[600px] flex flex-col">
//       <CardHeader>
//         <CardTitle className="flex items-center space-x-2">
//           <Bot className="h-5 w-5 text-primary" />
//           <span>CSEE Assistant</span>
//         </CardTitle>
//       </CardHeader>

//       <CardContent className="flex-1 flex flex-col p-0">
//         <ScrollArea className="flex-1 p-4">
//           <div className="space-y-4">
//             {messages.map((message) => (
//               <div
//                 key={message.id}
//                 className={`flex items-start space-x-3 ${
//                   message.sender === "user" ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 {message.sender === "bot" && (
//                   <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
//                     <Bot className="h-4 w-4 text-primary-foreground" />
//                   </div>
//                 )}

//                 <div
//                   className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
//                     message.sender === "user"
//                       ? "bg-primary text-primary-foreground ml-auto"
//                       : "bg-gray-100 text-gray-800"
//                   }`}
//                 >
//                   <p className="text-sm">{message.content}</p>
//                   <p className="text-xs opacity-70 mt-1">
//                     {message.timestamp.toLocaleTimeString([], {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })}
//                   </p>
//                 </div>

//                 {message.sender === "user" && (
//                   <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
//                     <User className="h-4 w-4 text-gray-600" />
//                   </div>
//                 )}
//               </div>
//             ))}

//             {isTyping && (
//               <div className="flex items-start space-x-3">
//                 <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
//                   <Bot className="h-4 w-4 text-primary-foreground" />
//                 </div>
//                 <div className="bg-gray-100 px-4 py-2 rounded-lg">
//                   <div className="flex space-x-1">
//                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                     <div
//                       className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                       style={{ animationDelay: "0.1s" }}
//                     ></div>
//                     <div
//                       className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                       style={{ animationDelay: "0.2s" }}
//                     ></div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div ref={messagesEndRef} />
//           </div>
//         </ScrollArea>

//         <div className="border-t p-4 flex space-x-2">
//           <Input
//             value={inputMessage}
//             onChange={(e) => setInputMessage(e.target.value)}
//             onKeyPress={handleKeyPress}
//             placeholder="Type your question here..."
//             className="flex-1"
//             disabled={isTyping}
//           />
//           <Button
//             onClick={handleSendMessage}
//             disabled={!inputMessage.trim() || isTyping}
//             className="bg-primary hover:bg-primary/90"
//           >
//             <Send className="h-4 w-4" />
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
