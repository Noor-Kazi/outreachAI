
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
import { AnalyzedProfile, CustomizationOptions } from "@/services/ollamaService";
import { Loader2, Sparkles, User, Briefcase, Building2, GraduationCap, Lightbulb, Users, Check, Settings2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { OutreachHistory } from "@/types/outreach";
import { Checkbox } from "@/components/ui/checkbox";

interface AnalysisReviewModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    analyzedData: AnalyzedProfile | null;
    initialSenderProfile: SenderProfile | null;
    history: OutreachHistory[]; // Added history prop
    onConfirm: (finalData: { targetDetails: AnalyzedProfile; senderProfile: SenderProfile; referenceContext?: string; customization: CustomizationOptions }) => void; // Updated signature
    isGenerating: boolean;
}

export function AnalysisReviewModal({
    open,
    onOpenChange,
    analyzedData,
    initialSenderProfile,
    history,
    onConfirm,
    isGenerating
}: AnalysisReviewModalProps) {
    const [targetData, setTargetData] = useState<AnalyzedProfile>({
        name: "", // Added name
        currentCompany: "",
        previousCompany: "",
        role: "",
        industry: "",
        skills: "",
        education: "",
        location: "",
        email: "",
        languages: "",
        certifications: "",
        recommendations: "",
        profilePhotoUrl: "",
        summary: "",
        companyDetails: {
            description: "",
            products: [],
            culture: "",
            competitors: [],
            recentNews: []
        },
        contentThemes: [],
        similarProfiles: [],
        psychologicalProfile: "",
        personalHooks: [],
        recommendedStrategy: ""
    });

    const [senderData, setSenderData] = useState<SenderProfile>({
        name: "",
        status: "professional",
        role: "",
        company: "",
        skills: "",
    });

    const [selectedReferences, setSelectedReferences] = useState<string[]>([]);
    const [customization, setCustomization] = useState({
        tone: "Formal",
        length: "Medium",
        focus: "Value Proposition"
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
        // Compile reference context
        const referenceContext = selectedReferences.length > 0
            ? `I recently reached out to the following people from your network: ${selectedReferences.join(", ")}.`
            : undefined;

        onConfirm({
            targetDetails: targetData,
            senderProfile: senderData,
            referenceContext,
            customization
        });
    };

    const isStudent = senderData.status === "student";

    // Find similar profiles in history
    const similarContacts = history.filter(item => {
        if (!analyzedData) return false;

        // Exclude current target and sender from references
        if (item.profile.name?.toLowerCase() === senderData.name?.toLowerCase()) return false;

        // Exclude the current target (matching by name if available)
        if (targetData.name && item.profile.name?.toLowerCase() === targetData.name.toLowerCase()) return false;

        // If the history item has the same company as current target:
        const sameCompany = analyzedData.currentCompany &&
            analyzedData.currentCompany !== "Not found" &&
            item.profile.company.toLowerCase() === analyzedData.currentCompany.toLowerCase();

        // If the history item has the same industry as current target:
        const sameIndustry = analyzedData.industry &&
            analyzedData.industry !== "Technology" && // Too broad
            analyzedData.industry !== "Not found" &&
            // @ts-ignore
            item.profile.industry?.toLowerCase() === analyzedData.industry?.toLowerCase();

        return sameCompany || sameIndustry;
    }).slice(0, 3); // Limit to 3

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

                                <Tabs defaultValue="personal" className="w-full">
                                    <TabsList className="w-full grid grid-cols-2 mb-4">
                                        <TabsTrigger value="personal">Personal Info</TabsTrigger>
                                        <TabsTrigger value="company">Company Intelligence</TabsTrigger>
                                        <TabsTrigger value="strategy">Strategy & Hooks</TabsTrigger>
                                        <TabsTrigger value="customization"><Settings2 className="w-3 h-3 mr-1" />Customize</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="personal" className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs">Full Name</Label>
                                            <Input
                                                value={targetData.name}
                                                onChange={(e) => handleTargetChange("name", e.target.value)}
                                                className="h-8 bg-background"
                                                placeholder="John Doe"
                                            />
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

                                        <div className="space-y-2">
                                            <Label className="text-xs">Email Address</Label>
                                            <Input
                                                value={targetData.email || ""}
                                                onChange={(e) => handleTargetChange("email", e.target.value)}
                                                className="h-8 bg-background"
                                                placeholder="email@example.com"
                                            />
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
                                    </TabsContent>

                                    <TabsContent value="company" className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs">Company Description</Label>
                                            <Textarea
                                                value={targetData.companyDetails?.description || ""}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setTargetData(prev => ({
                                                        ...prev,
                                                        companyDetails: { ...prev.companyDetails!, description: val }
                                                    }));
                                                }}
                                                className="min-h-[60px] bg-background text-sm resize-none"
                                                placeholder="Brief description..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs">Culture</Label>
                                            <Input
                                                value={targetData.companyDetails?.culture || ""}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setTargetData(prev => ({
                                                        ...prev,
                                                        companyDetails: { ...prev.companyDetails!, culture: val }
                                                    }));
                                                }}
                                                className="h-8 bg-background"
                                                placeholder="Innovative, Corporate..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs">Key Products (Comma separated)</Label>
                                            <Input
                                                value={targetData.companyDetails?.products?.join(", ") || ""}
                                                onChange={(e) => {
                                                    const val = e.target.value.split(",").map(s => s.trim());
                                                    setTargetData(prev => ({
                                                        ...prev,
                                                        companyDetails: { ...prev.companyDetails!, products: val }
                                                    }));
                                                }}
                                                className="h-8 bg-background"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs">Competitors (Comma separated)</Label>
                                            <Input
                                                value={targetData.companyDetails?.competitors?.join(", ") || ""}
                                                onChange={(e) => {
                                                    const val = e.target.value.split(",").map(s => s.trim());
                                                    setTargetData(prev => ({
                                                        ...prev,
                                                        companyDetails: { ...prev.companyDetails!, competitors: val }
                                                    }));
                                                }}
                                                className="h-8 bg-background"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs">Recent News (One per line)</Label>
                                            <Textarea
                                                value={targetData.companyDetails?.recentNews?.join("\n") || ""}
                                                onChange={(e) => {
                                                    const val = e.target.value.split("\n").filter(s => s.trim());
                                                    setTargetData(prev => ({
                                                        ...prev,
                                                        companyDetails: { ...prev.companyDetails!, recentNews: val }
                                                    }));
                                                }}
                                                className="min-h-[60px] bg-background text-sm resize-none"
                                                placeholder="Headline 1..."
                                            />
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="strategy" className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs">Psychological Profile / Archetype</Label>
                                            <Input
                                                value={targetData.psychologicalProfile || ""}
                                                onChange={(e) => handleTargetChange("psychologicalProfile", e.target.value)}
                                                className="h-8 bg-background"
                                                placeholder="e.g. Data-driven, visionary, skeptic..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs">Recommended Outreach Strategy</Label>
                                            <Textarea
                                                value={targetData.recommendedStrategy || ""}
                                                onChange={(e) => handleTargetChange("recommendedStrategy", e.target.value)}
                                                className="min-h-[60px] bg-background text-sm resize-none"
                                                placeholder="e.g. Lead with efficiency gains..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs">Personal Hooks (Comma separated)</Label>
                                            <Textarea
                                                value={targetData.personalHooks?.join(", ") || ""}
                                                onChange={(e) => {
                                                    const val = e.target.value.split(",").map(s => s.trim());
                                                    setTargetData(prev => ({
                                                        ...prev,
                                                        personalHooks: val
                                                    }));
                                                }}
                                                className="min-h-[60px] bg-background text-sm resize-none"
                                                placeholder="Marathon runner, posted about AI..."
                                            />
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="customization" className="space-y-4">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label className="text-xs">Tone</Label>
                                                <RadioGroup
                                                    value={customization.tone}
                                                    onValueChange={(val) => setCustomization(prev => ({ ...prev, tone: val }))}
                                                    className="grid grid-cols-3 gap-2"
                                                >
                                                    {["Formal", "Casual", "Witty", "Urgent", "Friendly"].map((tone) => (
                                                        <div key={tone} className="flex items-center space-x-2 border rounded-md p-2">
                                                            <RadioGroupItem value={tone} id={`t-${tone}`} />
                                                            <Label htmlFor={`t-${tone}`} className="text-xs cursor-pointer">{tone}</Label>
                                                        </div>
                                                    ))}
                                                </RadioGroup>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-xs">Length</Label>
                                                <RadioGroup
                                                    value={customization.length}
                                                    onValueChange={(val) => setCustomization(prev => ({ ...prev, length: val }))}
                                                    className="grid grid-cols-3 gap-2"
                                                >
                                                    {["Short", "Medium", "Long"].map((len) => (
                                                        <div key={len} className="flex items-center space-x-2 border rounded-md p-2">
                                                            <RadioGroupItem value={len} id={`l-${len}`} />
                                                            <Label htmlFor={`l-${len}`} className="text-xs cursor-pointer">{len}</Label>
                                                        </div>
                                                    ))}
                                                </RadioGroup>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-xs">Focus</Label>
                                                <RadioGroup
                                                    value={customization.focus}
                                                    onValueChange={(val) => setCustomization(prev => ({ ...prev, focus: val }))}
                                                    className="grid grid-cols-2 gap-2"
                                                >
                                                    {["Value Proposition", "Personal Connection", "Direct Ask", "Flattery"].map((focus) => (
                                                        <div key={focus} className="flex items-center space-x-2 border rounded-md p-2">
                                                            <RadioGroupItem value={focus} id={`f-${focus}`} />
                                                            <Label htmlFor={`f-${focus}`} className="text-xs cursor-pointer">{focus}</Label>
                                                        </div>
                                                    ))}
                                                </RadioGroup>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs">Similar Profiles (Famous/Influential)</Label>
                                <Input
                                    value={targetData.similarProfiles?.join(", ") || ""}
                                    onChange={(e) => {
                                        const val = e.target.value.split(",").map(s => s.trim());
                                        setTargetData(prev => ({
                                            ...prev,
                                            similarProfiles: val
                                        }));
                                    }}
                                    className="h-8 bg-background"
                                    placeholder="Bill Gates, Elon Musk..."
                                />
                                <p className="text-[10px] text-muted-foreground">
                                    People in similar roles or industries.
                                </p>
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

                            {/* Suggested References */}
                            {similarContacts.length > 0 && (
                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-accent">
                                        <Users className="h-4 w-4" />
                                        Suggested References
                                    </div>
                                    <div className="bg-accent/5 p-4 rounded-lg border border-accent/20 space-y-3">
                                        <div className="text-xs text-muted-foreground">
                                            We found people in your history from the same company or industry. Select to mention them.
                                        </div>
                                        {similarContacts.map((contact) => {
                                            const refString = `${contact.profile.name} (${contact.profile.role} at ${contact.profile.company})`;
                                            const isSelected = selectedReferences.includes(refString);
                                            return (
                                                <div key={contact.id} className="flex items-start gap-2">
                                                    <Checkbox
                                                        id={`ref-${contact.id}`}
                                                        checked={isSelected}
                                                        onCheckedChange={(checked) => {
                                                            if (checked) {
                                                                setSelectedReferences(prev => [...prev, refString]);
                                                            } else {
                                                                setSelectedReferences(prev => prev.filter(r => r !== refString));
                                                            }
                                                        }}
                                                    />
                                                    <Label htmlFor={`ref-${contact.id}`} className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-normal">
                                                        Mention <b>{contact.profile.name}</b> ({contact.profile.role} at {contact.profile.company})
                                                    </Label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

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
        </Dialog >
    );
}
