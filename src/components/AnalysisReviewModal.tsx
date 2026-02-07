
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SenderProfile } from "@/components/SenderProfileForm";
import { AnalyzedProfile } from "@/services/ollamaService";
import { Loader2, Sparkles, User, Briefcase, Building2, GraduationCap, Lightbulb } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface AnalysisReviewModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    analyzedData: AnalyzedProfile | null;
    initialSenderProfile: SenderProfile | null;
    onConfirm: (finalData: { targetDetails: AnalyzedProfile; senderProfile: SenderProfile }) => void;
    isGenerating: boolean;
}

export function AnalysisReviewModal({
    open,
    onOpenChange,
    analyzedData,
    initialSenderProfile,
    onConfirm,
    isGenerating
}: AnalysisReviewModalProps) {
    const [targetData, setTargetData] = useState<AnalyzedProfile>({
        currentCompany: "",
        previousCompany: "",
        role: "",
        skills: "",
        education: "",
        location: "",
        languages: "",
        certifications: "",
        recommendations: "",
        profilePhotoUrl: "",
        summary: "",
    });

    const [senderData, setSenderData] = useState<SenderProfile>({
        name: "",
        status: "professional",
        role: "",
        company: "",
        skills: "",
    });

    useEffect(() => {
        if (analyzedData) setTargetData(analyzedData);
    }, [analyzedData]);

    useEffect(() => {
        if (initialSenderProfile) setSenderData(initialSenderProfile);
    }, [initialSenderProfile]);

    const handleTargetChange = (field: keyof AnalyzedProfile, value: string) => {
        setTargetData(prev => ({ ...prev, [field]: value }));
    };

    const handleSenderChange = (field: keyof SenderProfile, value: string) => {
        setSenderData(prev => ({ ...prev, [field]: value }));
    };

    const handleConfirm = () => {
        onConfirm({ targetDetails: targetData, senderProfile: senderData });
    };

    const isStudent = senderData.status === "student";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] h-[90vh] flex flex-col p-0 gap-0">
                <DialogHeader className="px-6 py-4 border-b shrink-0">
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Review & Generate
                    </DialogTitle>
                    <DialogDescription>
                        Review the analyzed target details and confirm your sender identity before generating the outreach.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 px-6 py-4">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Target Column */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                                <User className="h-4 w-4" />
                                Target Details (Analyzed)
                            </div>

                            <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs">Profile Photo URL</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={targetData.profilePhotoUrl || ""}
                                            onChange={(e) => handleTargetChange("profilePhotoUrl", e.target.value)}
                                            className="h-8 bg-background flex-1"
                                            placeholder="https://..."
                                        />
                                        {targetData.profilePhotoUrl && (
                                            <div className="h-8 w-8 rounded-full overflow-hidden border border-border">
                                                <img src={targetData.profilePhotoUrl} alt="Preview" className="h-full w-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-2">
                                        <Label className="text-xs">Current Company</Label>
                                        <Input
                                            value={targetData.currentCompany}
                                            onChange={(e) => handleTargetChange("currentCompany", e.target.value)}
                                            className="h-8 bg-background"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs">Previous Company</Label>
                                        <Input
                                            value={targetData.previousCompany}
                                            onChange={(e) => handleTargetChange("previousCompany", e.target.value)}
                                            className="h-8 bg-background"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-2">
                                        <Label className="text-xs">Role / Position</Label>
                                        <Input
                                            value={targetData.role}
                                            onChange={(e) => handleTargetChange("role", e.target.value)}
                                            className="h-8 bg-background"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs">Location</Label>
                                        <Input
                                            value={targetData.location || ""}
                                            onChange={(e) => handleTargetChange("location", e.target.value)}
                                            className="h-8 bg-background"
                                            placeholder="City, Country"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Education</Label>
                                    <div className="relative">
                                        <GraduationCap className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                                        <Input
                                            value={targetData.education}
                                            onChange={(e) => handleTargetChange("education", e.target.value)}
                                            className="h-8 bg-background pl-8"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Skills (Comma separated)</Label>
                                    <Textarea
                                        value={targetData.skills}
                                        onChange={(e) => handleTargetChange("skills", e.target.value)}
                                        className="min-h-[60px] bg-background text-sm resize-none"
                                    />
                                </div>

                                <Tabs defaultValue="languages" className="w-full">
                                    <TabsList className="w-full grid grid-cols-3 h-7">
                                        <TabsTrigger value="languages" className="text-[10px]">Languages</TabsTrigger>
                                        <TabsTrigger value="certifications" className="text-[10px]">Certs</TabsTrigger>
                                        <TabsTrigger value="recommendations" className="text-[10px]">Recs</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="languages">
                                        <Input
                                            value={targetData.languages || ""}
                                            onChange={(e) => handleTargetChange("languages", e.target.value)}
                                            className="h-8 bg-background"
                                            placeholder="English, Spanish..."
                                        />
                                    </TabsContent>
                                    <TabsContent value="certifications">
                                        <Input
                                            value={targetData.certifications || ""}
                                            onChange={(e) => handleTargetChange("certifications", e.target.value)}
                                            className="h-8 bg-background"
                                            placeholder="AWS, PMP..."
                                        />
                                    </TabsContent>
                                    <TabsContent value="recommendations">
                                        <Textarea
                                            value={targetData.recommendations || ""}
                                            onChange={(e) => handleTargetChange("recommendations", e.target.value)}
                                            className="min-h-[40px] bg-background text-xs resize-none"
                                            placeholder="Highly recommended for..."
                                        />
                                    </TabsContent>
                                </Tabs>

                                <div className="space-y-2">
                                    <Label className="text-xs">Summary</Label>
                                    <p className="text-xs text-muted-foreground italic line-clamp-2">
                                        {targetData.summary || "No summary available"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Sender Column */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                                <Briefcase className="h-4 w-4" />
                                Your Identity (Confirm)
                            </div>

                            <div className="bg-primary/5 p-4 rounded-lg space-y-4 border border-primary/10">
                                <div className="space-y-2">
                                    <Label className="text-xs">I am a...</Label>
                                    <RadioGroup
                                        value={senderData.status || "professional"}
                                        onValueChange={(val) => handleSenderChange("status", val)}
                                        className="flex gap-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="professional" id="r-prof" />
                                            <Label htmlFor="r-prof" className="text-xs">Professional</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="student" id="r-student" />
                                            <Label htmlFor="r-student" className="text-xs">Student</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <Separator className="bg-primary/10" />

                                <div className="space-y-2">
                                    <Label className="text-xs">Your Name</Label>
                                    <Input
                                        value={senderData.name}
                                        onChange={(e) => handleSenderChange("name", e.target.value)}
                                        className="h-8 bg-background"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs">{isStudent ? "University" : "Company"}</Label>
                                    <div className="relative">
                                        <Building2 className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                                        <Input
                                            value={senderData.company}
                                            onChange={(e) => handleSenderChange("company", e.target.value)}
                                            className="h-8 bg-background pl-8"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs">{isStudent ? "Major / Degree" : "Role / Title"}</Label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                                        <Input
                                            value={senderData.role}
                                            onChange={(e) => handleSenderChange("role", e.target.value)}
                                            className="h-8 bg-background pl-8"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter className="px-6 py-4 border-t shrink-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isGenerating || !senderData.name}
                        className="bg-gradient-primary min-w-[140px]"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate Messages
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
