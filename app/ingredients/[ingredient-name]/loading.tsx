import { MainLayout } from "@/components/templates/MainLayout";
import { GridLayout } from "@/components/templates/GridLayout";
import { Skeleton } from "@/components/atoms/Skeleton";
import { Card } from "@/components/molecules/Card";

export default function Loading() {
  return (
    <MainLayout>
      <GridLayout
        breadcrumb={<Skeleton className="h-4 w-48" />}
        title={<Skeleton className="h-12 w-72 md:w-96 mt-6" />}
        description={<Skeleton className="h-6 w-32 mt-2" />}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-6 mt-10">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="block h-full">
              <Card className="h-full border-border-soft overflow-hidden">
                <div className="relative aspect-square sm:aspect-[4/3] w-full bg-surface">
                  <Skeleton className="absolute inset-0 w-full h-full rounded-none opacity-50" />
                  <div className="absolute inset-0 bg-[var(--color-overlay)] z-10 pointer-events-none" />
                  <div className="absolute inset-0 z-20 flex flex-col justify-end p-5 gap-3">
                    <Skeleton className="h-6 lg:h-7 w-3/4 rounded-md bg-white/30 shadow-none" />
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </GridLayout>
    </MainLayout>
  );
}
