import type { MealDetail } from "@/interfaces";
import { extractIngredients } from "@/lib/api";
import { Image } from "@/components/atoms/Image";
import { Typography } from "@/components/atoms/Typography";
import { Badge } from "@/components/atoms/Badge";

interface MealDetailSectionProps {
  mealId: string;
}

// --- Helpers ---

function parseTags(tagsString: string | null): string[] {
  if (!tagsString) return [];
  return tagsString.split(',').map(tag => tag.trim()).filter(Boolean);
}

function parseInstructions(rawInstructions: string): string[] {
  return rawInstructions
    .split(/(?:\r?\n)+/)
    .map(paragraph => paragraph.trim())
    .filter(Boolean)
    .map(paragraph => {
      // If line is EXACTLY a step number (e.g. "1", "1.", "Step 1"), remove the whole line
      if (/^(?:step\s*)?\d+[\.)]?$/i.test(paragraph)) {
        return "";
      }
      // Otherwise, safely strip prefixes like "1. " or "Step 1 " but carefully avoid matching valid text like "15 mins"
      return paragraph
        .replace(/^(?:step\s*)?\d+[\.)]\s+/i, '')
        .replace(/^step\s+\d+\s+/i, '')
        .trim();
    })
    .filter(Boolean); // Drop empty strings caused by stripping standalone numbers
}

async function fetchMeal(mealId: string): Promise<MealDetail | null> {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.meals?.[0] || null;
}


function MealImageBanner({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="w-full lg:w-1/3 shrink-0">
      <div className="sticky top-24">
        <Image
          src={src}
          alt={alt}
          width={600}
          height={600}
          priority
          className="rounded-2xl object-cover shadow-xl border border-border-soft"
          wrapperClassName="aspect-square w-full rounded-2xl bg-background"
        />
      </div>
    </div>
  );
}

function MealHeader({ meal }: { meal: MealDetail }) {
  const tags = parseTags(meal.strTags);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        <Badge variant="default">{meal.strCategory}</Badge>
        <Badge variant="secondary">{meal.strArea}</Badge>
        {tags.map(tag => (
          <Badge key={tag} variant="outline" className="bg-surface">{tag}</Badge>
        ))}
      </div>
      <Typography variant="h1">{meal.strMeal}</Typography>
    </div>
  );
}

function MealIngredientsList({ meal }: { meal: MealDetail }) {
  const ingredientsAndMeasures = extractIngredients(meal);

  return (
    <div className="flex flex-col gap-5 md:col-span-5 bg-surface p-6 rounded-2xl border border-border-soft shadow-[var(--shadow-soft)]">
      <Typography variant="h3">Ingredients</Typography>
      <ul className="divide-y divide-border-soft flex flex-col">
        {ingredientsAndMeasures.map((item, idx) => (
          <li key={idx} className="flex justify-between py-3">
            <span className="font-medium text-primary">{item.ingredient}</span>
            <span className="text-muted text-right ms-4">{item.measure}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MealInstructionsList({ rawInstructions }: { rawInstructions: string }) {
  const steps = parseInstructions(rawInstructions);

  return (
    <div className="flex flex-col gap-5 md:col-span-7">
      <Typography variant="h3">Instructions</Typography>
      <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-border-soft shadow-[var(--shadow-soft)]">
        <ul className="space-y-6">
          {steps.map((step, idx) => (
            <li key={idx} className="flex gap-4 relative">
              <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm mt-0.5 shadow-sm">
                {idx + 1}
              </span>
              <p className="text-secondary leading-relaxed text-[15px] flex-1">
                {step}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// --- Main component ---

export async function MealDetailSection({ mealId }: MealDetailSectionProps) {
  const meal = await fetchMeal(mealId);

  if (!meal) return null;

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
      <MealImageBanner src={meal.strMealThumb} alt={meal.strMeal} />
      
      <div className="w-full lg:w-2/3 flex flex-col gap-10">
        <MealHeader meal={meal} />

        <div className="grid gap-8 md:grid-cols-12 items-start">
          <MealIngredientsList meal={meal} />
          <MealInstructionsList rawInstructions={meal.strInstructions} />
        </div>
      </div>
    </div>
  );
}
