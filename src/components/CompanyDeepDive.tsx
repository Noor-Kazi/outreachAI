import { CompanyDetails } from "@/types/outreach";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Target, Trophy, Newspaper, Users } from "lucide-react";

interface CompanyDeepDiveProps {
    company: string;
    details: CompanyDetails;
}

export const CompanyDeepDive = ({ company, details }: CompanyDeepDiveProps) => {
    if (!details) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Building2 className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold">{company} Deep Dive</h2>
                    <p className="text-muted-foreground">{details.description}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {/* Culture */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Users className="h-4 w-4 text-purple-500" />
                            Company Culture
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{details.culture}</p>
                    </CardContent>
                </Card>

                {/* Recent News */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Newspaper className="h-4 w-4 text-blue-500" />
                            Recent News & Signals
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {details.recentNews.map((news, i) => (
                                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                                    <span className="text-primary">•</span> {news}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Products */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Target className="h-4 w-4 text-green-500" />
                            Key Products
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {details.products.map((product, i) => (
                                <Badge key={i} variant="secondary">{product}</Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Competitors */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-orange-500" />
                            Main Competitors
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {details.competitors.map((comp, i) => (
                                <Badge key={i} variant="outline">{comp}</Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
