import { MainLayout } from "@/components/templates/MainLayout";
import { GridLayout } from "@/components/templates/GridLayout";
import { Skeleton } from "@/components/atoms/Skeleton";

export default function Loading() {
  return (
    <MainLayout>
      <GridLayout breadcrumb={<Skeleton className="h-4 w-64" />}>
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12 mt-6">
          <div className="w-full lg:w-1/3 shrink-0">
            <Skeleton className="aspect-square w-full rounded-2xl" />
          </div>
          <div className="w-full lg:w-2/3 flex flex-col gap-10">
            <div className="flex flex-col gap-5">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <Skeleton className="h-12 w-full max-w-lg" />
            </div>
            <div className="grid gap-8 md:grid-cols-12 items-start">
              <Skeleton className="md:col-span-5 h-[400px] rounded-2xl" />
              <Skeleton className="md:col-span-7 h-[600px] rounded-2xl" />
            </div>
          </div>
        </div>
      </GridLayout>
    </MainLayout>
  );
}
