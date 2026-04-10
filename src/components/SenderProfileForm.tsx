import { useState } from "react";
import { User, Briefcase, Building2, Lightbulb, PenTool, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { analyzeWritingStyle } from "@/services/ollamaService";
import { toast } from "sonner";

export interface SenderProfile {
    name: string;
    status: "student" | "professional";
    role: string; // or Degree/Major
    company: string; // or University
    skills: string;
    writingStyle?: string; // Analyzed style
}

interface SenderProfileFormProps {
    initialData?: SenderProfile | null;
    onSave: (data: SenderProfile) => void;
}

export function SenderProfileForm({ initialData, onSave }: SenderProfileFormProps) {
    const [formData, setFormData] = useState<SenderProfile>(
        initialData || {
            name: "",
            status: "professional",
            role: "",
            company: "",
            skills: "",
            writingStyle: ""
        }
    );
    const [writingSample, setWritingSample] = useState("");
    const [isAnalyzingStyle, setIsAnalyzingStyle] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleChange = (field: keyof SenderProfile, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleAnalyzeStyle = async () => {
        if (!writingSample.trim()) return;
        setIsAnalyzingStyle(true);
        try {
            const style = await analyzeWritingStyle(writingSample);
            setFormData(prev => ({ ...prev, writingStyle: style }));
            toast.success("Writing style analyzed!");
        } catch (error) {
            toast.error("Failed to analyze style.");
        } finally {
            setIsAnalyzingStyle(false);
        }
    };

    const isStudent = formData.status === "student";

    const isValid = formData.name && formData.role && formData.company;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label>I am a...</Label>
                <RadioGroup
                    defaultValue={formData.status}
                    onValueChange={(val) => handleChange("status", val as "student" | "professional")}
                    className="flex gap-4"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="professional" id="professional" />
                        <Label htmlFor="professional">Professional</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="student" id="student" />
                        <Label htmlFor="student">Student</Label>
                    </div>
                </RadioGroup>
            </div>

            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="name"
                        placeholder="John Doe"
                        className="pl-9"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="role">{isStudent ? "Degree / Major" : "Job Title / Role"}</Label>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="role"
                            placeholder={isStudent ? "Computer Science" : "SDR / Account Executive"}
                            className="pl-9"
                            value={formData.role}
                            onChange={(e) => handleChange("role", e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="company">{isStudent ? "University" : "Company Name"}</Label>
                    <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="company"
                            placeholder={isStudent ? "MIT" : "Acme Corp"}
                            className="pl-9"
                            value={formData.company}
                            onChange={(e) => handleChange("company", e.target.value)}
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="skills">Professional Skills / Expertise</Label>
                <div className="relative">
                    <Lightbulb className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                        id="skills"
                        placeholder="e.g. B2B Sales, Lead Generation, SaaS, Marketing Strategy"
                        className="pl-9 min-h-[80px]"
                        value={formData.skills}
                        onChange={(e) => handleChange("skills", e.target.value)}
                    />
                </div>
            </div>

            {/* Voice Cloning Section */}
            <div className="space-y-3 pt-2 border-t border-border/50">
                <div className="flex items-center gap-2">
                    <PenTool className="h-4 w-4 text-primary" />
                    <Label className="font-semibold text-primary">Voice Cloning (Writing Style)</Label>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-xs">Paste a sample of your writing (email/post)</Label>
                        <Textarea
                            value={writingSample}
                            onChange={(e) => setWritingSample(e.target.value)}
                            placeholder="Paste a recent email or post here..."
                            className="min-h-[80px] text-xs"
                        />
                        <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={handleAnalyzeStyle}
                            disabled={!writingSample || isAnalyzingStyle}
                            className="w-full h-8 text-xs"
                        >
                            {isAnalyzingStyle ? (
                                <>
                                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-3 w-3" />
                                    Analyze Style
                                </>
                            )}
                        </Button>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs">Analyzed Style Instructions</Label>
                        <Textarea
                            value={formData.writingStyle || ""}
                            onChange={(e) => handleChange("writingStyle", e.target.value)}
                            placeholder="Style instructions will appear here..."
                            className="min-h-[116px] text-xs bg-muted/30"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-2">
                <Button
                    type="submit"
                    disabled={!isValid}
                    className="w-full bg-gradient-primary"
                >
                    Save Profile
                </Button>
            </div>
        </form>
    );
}
