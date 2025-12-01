import { Badge } from "./features/ui_features/badge";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

export default function CategoryFilter({ categories, selectedCategory, setSelectedCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <Badge
        variant={selectedCategory === null ? "default" : "secondary"}
        className={`cursor-pointer transition-colors ${
          selectedCategory === null 
            ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
            : 'hover:bg-gray-200'
        }`}
        onClick={() => setSelectedCategory(null)}
      >
        All Categories
      </Badge>
      {categories.map((category) => (
        <Badge
          key={category}
          variant={selectedCategory === category ? "default" : "secondary"}
          className={`cursor-pointer transition-colors ${
            selectedCategory === category 
              ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
              : 'hover:bg-gray-200'
          }`}
          onClick={() => setSelectedCategory(category)}
        >
          {category}
        </Badge>
      ))}
    </div>
  );
}