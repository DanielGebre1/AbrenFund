import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Input } from "../../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Send } from "lucide-react";

const CreatorMessages = () => {
  const contacts = [
    {
      id: 1,
      name: "John Smith",
      avatar: "https://i.pravatar.cc/150?img=1",
      lastMessage: "Hey, I'm interested in your project!",
      time: "9:40 AM",
      unread: true,
    },
    {
      id: 2,
      name: "Sarah Johnson",
      avatar: "https://i.pravatar.cc/150?img=2",
      lastMessage: "Thanks for your proposal, let's schedule a call",
      time: "Yesterday",
      unread: false,
    },
    {
      id: 3,
      name: "David Wilson",
      avatar: "https://i.pravatar.cc/150?img=3",
      lastMessage: "I have some feedback on your last update",
      time: "Yesterday",
      unread: false,
    },
    {
      id: 4,
      name: "Jessica Brown",
      avatar: "https://i.pravatar.cc/150?img=4",
      lastMessage: "When will the next milestone be completed?",
      time: "Mon",
      unread: false,
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "John Smith",
      content: "Hey, I'm interested in your project!",
      time: "9:40 AM",
      isMe: false,
    },
    {
      id: 2,
      sender: "Me",
      content: "Hi John, thanks for reaching out! What aspects are you most interested in?",
      time: "9:42 AM",
      isMe: true,
    },
    {
      id: 3,
      sender: "John Smith",
      content: "I really like the innovation part and would like to know more about the implementation details.",
      time: "9:45 AM",
      isMe: false,
    },
    {
      id: 4,
      sender: "Me",
      content: "Great! I'd be happy to share more details. Our implementation uses cutting-edge technology to solve the problem efficiently.",
      time: "9:47 AM",
      isMe: true,
    },
    {
      id: 5,
      sender: "John Smith",
      content: "That sounds promising! Do you have any documentation I could look at?",
      time: "9:50 AM",
      isMe: false,
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Messages</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-220px)]">
        <Card className="lg:col-span-1 overflow-hidden flex flex-col h-full">
          <CardContent className="p-0 flex flex-col h-full">
            <div className="p-4 border-b">
              <Input placeholder="Search messages..." />
            </div>
            <div className="overflow-y-auto flex-grow">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`flex items-center p-4 gap-3 border-b hover:bg-muted/50 cursor-pointer ${
                    contact.id === 1 ? "bg-muted" : ""
                  }`}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={contact.avatar} alt={contact.name} />
                    <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{contact.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {contact.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground truncate">
                        {contact.lastMessage}
                      </p>
                      {contact.unread && (
                        <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 flex flex-col h-full">
          <CardContent className="p-4 flex flex-col h-full">
            <div className="border-b pb-4 mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src="https://i.pravatar.cc/150?img=1"
                    alt="John Smith"
                  />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">John Smith</p>
                  <p className="text-xs text-muted-foreground">Online</p>
                </div>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.isMe
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p>{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.isMe
                          ? "text-primary-foreground/80"
                          : "text-muted-foreground"
                      }`}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <Input placeholder="Type your message..." className="flex-grow" />
              <Button size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatorMessages;
