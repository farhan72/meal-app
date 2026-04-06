import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMealsByIngredient, searchMealsByName } from "@/lib/api";
import { MainLayout } from "@/components/templates/MainLayout";
import { GridLayout } from "@/components/templates/GridLayout";
import { MealGrid } from "@/components/organisms/MealGrid";
import { Breadcrumb } from "@/components/molecules/Breadcrumb";
import { Typography } from "@/components/atoms/Typography";
import { Badge } from "@/components/atoms/Badge";
import { unslugify } from "@/lib/utils";
import { SearchInput } from "@/components/molecules/SearchInput";

interface IngredientPageProps {
  params: Promise<{ "ingredient-name": string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: IngredientPageProps): Promise<Metadata> {
  const { "ingredient-name": slug } = await params;
  const decodedIngredient = unslugify(slug);

  return {
    title: `Meals with ${decodedIngredient}`,
    description: `Browse all meals containing ${decodedIngredient} as an ingredient.`,
  };
}

export default async function IngredientMealsPage({ params, searchParams }: IngredientPageProps) {
  const { "ingredient-name": slug } = await params;
  const { q } = await searchParams;
  const decodedIngredient = unslugify(slug);
  const query = typeof q === "string" ? q : "";

  const meals = query 
    ? await searchMealsByName(query)
    : await getMealsByIngredient(decodedIngredient);

  if (!meals) {
    notFound();
  }

  return (
    <MainLayout>
      <GridLayout
        breadcrumb={
          <Breadcrumb
            items={[
              { label: decodedIngredient },
            ]}
          />
        }
        title={
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <Typography variant="h1" className="flex flex-wrap items-baseline gap-x-3">
              <span>{query ? "Search Results" : "Meals with"}</span>
              <span className="text-indigo-600">{query ? `"${query}"` : decodedIngredient}</span>
            </Typography>
            <SearchInput placeholder={`Search ${decodedIngredient} meals...`} className="w-full lg:max-w-sm" />
          </div>
        }
        description={
          <div className="flex items-center gap-2">
            <Typography variant="p">{query ? "Found total" : "Found"}</Typography>
            <Badge variant="secondary">{meals.length} meals</Badge>
          </div>
        }
      >
        <MealGrid meals={meals} slug={slug} />
      </GridLayout>
    </MainLayout>
  );
}
