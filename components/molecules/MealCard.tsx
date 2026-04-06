import Link from "next/link";
import { Card, CardContent } from "./Card";
import { Image } from "@/components/atoms/Image";
import { Typography } from "@/components/atoms/Typography";
import { Badge } from "@/components/atoms/Badge";
import { encodeId } from "@/lib/hash";

interface MealCardProps {
  id: string;
  title: string;
  image: string;
  category?: string;
}

export function MealCard({ id, title, image, category }: MealCardProps) {
  const hashedId = encodeId(id);

  return (
    <Link href={`/meal/${hashedId}`} className="block h-full">
      <Card className="h-full hover:-translate-y-1">
        <Image
          src={image}
          alt={title}
          width={400}
          height={300}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          className="object-cover w-full h-full group-hover:scale-105 group-hover:opacity-90 transition-all duration-500"
          wrapperClassName="aspect-square sm:aspect-[4/3] w-full bg-gray-100"
        />
        <CardContent className="flex flex-col gap-2">
          {category && (
            <Badge variant="secondary" className="w-fit shadow-none">
              {category}
            </Badge>
          )}
          <Typography variant="h4" className="line-clamp-2 text-lg lg:text-xl group-hover:text-indigo-600 transition-colors">
            {title}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}
