import { ChevronDown, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "./features/ui_features/card";
import { Badge } from "./features/ui_features/badge";
import { useState } from "react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface FAQListProps {
  faqs: FAQ[];
}

export default function FAQList({ faqs }: FAQListProps) {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  if (faqs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No FAQs found matching your criteria.</p>
        <p className="text-sm text-gray-400 mt-2">Try adjusting your search or category filter.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {faqs.map((faq) => (
        <Card key={faq.id} className="transition-shadow hover:shadow-md">
          <CardHeader 
            className="cursor-pointer"
            onClick={() => toggleFAQ(faq.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {faq.category}
                  </Badge>
                </div>
                <h3 className="font-medium text-left pr-4">
                  {faq.question}
                </h3>
              </div>
              <div className="flex-shrink-0">
                {expandedFAQ === faq.id ? (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
          </CardHeader>
          
          {expandedFAQ === faq.id && (
            <CardContent className="pt-0">
              <div className="border-t pt-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {faq.answer}
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}