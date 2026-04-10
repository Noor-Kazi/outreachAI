import { useState, useEffect } from "react";
import { InterviewQuestion, generateInterviewQuestions, getInterviewFeedback } from "@/services/ollamaService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, Bot, User, Play, MessageSquare } from "lucide-react";

interface InterviewPrepChatProps {
    role: string;
    company: string;
    skills: string;
}

interface Message {
    id: string;
    role: 'assistant' | 'user';
    content: string;
    isFeedback?: boolean;
}

export const InterviewPrepChat = ({ role, company, skills }: InterviewPrepChatProps) => {
    const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(false);

    useEffect(() => {
        // Reset state when props change
        setQuestions([]);
        setMessages([]);
        setCurrentQuestionIndex(-1);
    }, [role, company, skills]);

    const startSession = async () => {
        setIsInitializing(true);
        try {
            const qs = await generateInterviewQuestions(role, company, skills);
            setQuestions(qs);
            if (qs.length > 0) {
                setCurrentQuestionIndex(0);
                addMessage({
                    role: 'assistant',
                    content: `Hello! I'm here to help you prepare for your ${role} interview at ${company}. Let's start with a ${qs[0].difficulty} ${qs[0].type} question:\n\n**${qs[0].question}**`
                });
            }
        } catch (error) {
            console.error("Failed to start session", error);
        } finally {
            setIsInitializing(false);
        }
    };

    const addMessage = (msg: Omit<Message, 'id'>) => {
        setMessages(prev => [...prev, { ...msg, id: Date.now().toString() }]);
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userAns = inputValue;
        setInputValue("");
        addMessage({ role: 'user', content: userAns });
        setIsLoading(true);

        try {
            const currentQ = questions[currentQuestionIndex];

            // Get feedback
            const feedback = await getInterviewFeedback(currentQ.question, userAns);
            addMessage({ role: 'assistant', content: feedback, isFeedback: true });

            // Move to next question
            if (currentQuestionIndex < questions.length - 1) {
                const nextIndex = currentQuestionIndex + 1;
                setCurrentQuestionIndex(nextIndex);
                const nextQ = questions[nextIndex];
                setTimeout(() => {
                    addMessage({
                        role: 'assistant',
                        content: `Ready for the next one? This is a ${nextQ.difficulty} ${nextQ.type} question:\n\n**${nextQ.question}**`
                    });
                }, 1500);
            } else {
                setTimeout(() => {
                    addMessage({ role: 'assistant', content: "That's all the questions I have for now! Great job practicing. Would you like to restart?" });
                    setCurrentQuestionIndex(-1); // End state
                }, 1500);
            }
        } catch (error) {
            console.error("Chat error", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="h-[600px] flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Interview Simulator
                </CardTitle>
                <CardDescription>
                    Practice for {role} role at {company}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-0">
                {questions.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
                        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                            <Bot className="h-12 w-12 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Ready to practice?</h3>
                            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                                I'll generate 5 relevant interview questions and give you feedback on your answers.
                            </p>
                        </div>
                        <Button onClick={startSession} disabled={isInitializing}>
                            {isInitializing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating Questions...
                                </>
                            ) : (
                                <>
                                    <Play className="mr-2 h-4 w-4" />
                                    Start Session
                                </>
                            )}
                        </Button>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="flex-1 pr-4 mb-4">
                            <div className="space-y-4">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'
                                            }`}
                                    >
                                        {msg.role === 'assistant' && (
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                <Bot className="h-4 w-4 text-primary" />
                                            </div>
                                        )}
                                        <div
                                            className={`rounded-lg p-3 max-w-[80%] text-sm ${msg.role === 'user'
                                                    ? 'bg-primary text-primary-foreground'
                                                    : msg.isFeedback
                                                        ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                                                        : 'bg-muted'
                                                }`}
                                        >
                                            {msg.content.split('\n').map((line, i) => (
                                                <p key={i} className={i > 0 ? 'mt-2' : ''}>
                                                    {line.replace(/\*\*(.*?)\*\*/g, '$1')}
                                                    {/* Simple bold handling */}
                                                </p>
                                            ))}
                                        </div>
                                        {msg.role === 'user' && (
                                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                                <User className="h-4 w-4" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex gap-3 justify-start">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <Bot className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="bg-muted rounded-lg p-3">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Type your answer..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                disabled={isLoading || currentQuestionIndex === -1}
                            />
                            <Button onClick={handleSendMessage} disabled={isLoading || !inputValue.trim() || currentQuestionIndex === -1}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                        {currentQuestionIndex === -1 && messages.length > 0 && (
                            <Button variant="outline" className="mt-2 w-full" onClick={startSession}>
                                Restart Session
                            </Button>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
};
