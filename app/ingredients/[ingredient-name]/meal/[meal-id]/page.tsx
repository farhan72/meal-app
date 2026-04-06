import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMealDetail } from "@/lib/api";
import { decodeId } from "@/lib/hash";
import { MainLayout } from "@/components/templates/MainLayout";
import { GridLayout } from "@/components/templates/GridLayout";
import { MealDetailSection } from "@/components/organisms/MealDetailSection";
import { VideoSection } from "@/components/organisms/VideoSection";
import { Breadcrumb } from "@/components/molecules/Breadcrumb";
import { unslugify } from "@/lib/utils";

interface MealPageProps {
  params: Promise<{ "ingredient-name": string; "meal-id": string }>;
}

export async function generateMetadata({ params }: MealPageProps): Promise<Metadata> {
  const { "meal-id": hashedId } = await params;
  const realId = decodeId(hashedId);

  if (!realId) return { title: "Meal Not Found" };

  const meal = await getMealDetail(realId);
  if (!meal) return { title: "Meal Not Found" };

  return {
    title: meal.strMeal,
    description: `Learn how to make ${meal.strMeal} - ${meal.strCategory} from ${meal.strArea}.`,
  };
}

export default async function MealPage({ params }: MealPageProps) {
  const { "meal-id": hashedId, "ingredient-name": slug } = await params;
  
  // Decode the secure hashed ID
  const realId = decodeId(hashedId);

  if (!realId) {
    notFound();
  }

  const meal = await getMealDetail(realId);

  if (!meal) {
    notFound();
  }

  // Use the slug for navigation breadcrumb
  const mainIngredient = unslugify(slug);

  return (
    <MainLayout>
      <GridLayout
        breadcrumb={
          <Breadcrumb
            items={[
              { label: mainIngredient, href: `/ingredients/${slug}` },
              { label: meal.strMeal },
            ]}
          />
        }
      >
        <MealDetailSection mealId={realId} />
        {meal.strYoutube && <VideoSection youtubeUrl={meal.strYoutube} />}

      </GridLayout>
    </MainLayout>
  );
}
