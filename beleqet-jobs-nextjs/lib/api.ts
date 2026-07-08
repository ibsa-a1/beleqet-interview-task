const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001/api/v1";

type ApiJob = {
  id: string;
  title: string;
  description: string;
  location: string;
  type: "FULL_TIME" | "PART_TIME" | "REMOTE" | "HYBRID" | "CONTRACT";
  tags: string[];
  featured: boolean;
  createdAt: string;
  category: { id: string; slug: string; label: string };
  company: { id: string; name: string; logoUrl?: string };
};

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Full Time" | "Part Time" | "Remote" | "Hybrid" | "Contract";
  category: string;
  postedAgo: string;
  featured?: boolean;
  description?: string;
  tags?: string[];
};

const typeMap: Record<ApiJob["type"], Job["type"]> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  REMOTE: "Remote",
  HYBRID: "Hybrid",
  CONTRACT: "Contract",
};

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diffMs / 3600000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function adaptJob(j: ApiJob): Job {
  return {
    id: j.id,
    title: j.title,
    company: j.company?.name ?? "Unknown Company",
    location: j.location,
    type: typeMap[j.type] ?? "Full Time",
    category: j.category?.slug ?? "other",
    postedAgo: timeAgo(j.createdAt),
    featured: j.featured,
    description: j.description,
    tags: j.tags,
  };
}

export async function getJobs(): Promise<Job[]> {
  try {
    const res = await fetch(`${API_URL}/jobs?limit=100`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.items as ApiJob[]).map(adaptJob);
  } catch {
    return [];
  }
}

export async function getJob(id: string): Promise<Job | null> {
  try {
    const res = await fetch(`${API_URL}/jobs/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return adaptJob(await res.json());
  } catch {
    return null;
  }
}

export async function getCategories(): Promise<
  { id: string; label: string }[]
> {
  try {
    const res = await fetch(`${API_URL}/jobs/categories`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const cats = await res.json();
    return cats.map((c: { slug: string; label: string }) => ({
      id: c.slug,
      label: c.label,
    }));
  } catch {
    return [];
  }
}
