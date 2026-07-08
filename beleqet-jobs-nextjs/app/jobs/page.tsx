import { Suspense } from "react";
import JobsListing from "@/components/JobsListing";
import { getJobs, getCategories } from "@/lib/api";

export const metadata = {
  title: "Find Jobs | Beleqet Jobs",
};

export default async function JobsPage() {
  const [jobs, categories] = await Promise.all([getJobs(), getCategories()]);

  return (
    <Suspense
      fallback={
        <div className="container-page py-20 text-center text-muted">
          Loading jobs…
        </div>
      }
    >
      <JobsListing jobs={jobs} categories={categories} />
    </Suspense>
  );
}
