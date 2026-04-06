import Link from "next/link";
import { Card, CardContent } from "./Card";
import { Image } from "@/components/atoms/Image";
import { Typography } from "@/components/atoms/Typography";
import { slugify } from "@/lib/utils";

interface IngredientCardProps {
  name: string;
}

export function IngredientCard({ name }: IngredientCardProps) {
  // TheMealDB provides images based on ingredient name.
  const imageUrl = `https://www.themealdb.com/images/ingredients/${encodeURIComponent(name)}.png`;

  return (
    <Link href={`/ingredients/${slugify(name)}`} className="block h-full">
      <Card className="h-full hover:border-indigo-100 hover:ring-2 hover:ring-indigo-50 hover:ring-offset-2">
        <div className="bg-gradient-to-b from-gray-50 to-white p-6 flex justify-center items-center">
          <Image
            src={imageUrl}
            alt={name}
            width={120}
            height={120}
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
            className="object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
            wrapperClassName="h-28 w-full flex justify-center items-center"
          />
        </div>
        <CardContent className="h-full flex items-center justify-center border-t border-gray-50 bg-white">
          <Typography variant="h4" className="text-center text-lg lg:text-xl group-hover:text-indigo-600 transition-colors line-clamp-2">
            {name}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}
