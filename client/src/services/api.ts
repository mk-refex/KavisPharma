const API_BASE_URL =
  (import.meta.env?.VITE_API_URL as string | undefined) ?? "";

export function resolveImageUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  return `${API_BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function getAuthTokenHeader(): HeadersInit {
  const token = localStorage.getItem("auth_token");
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      (data as { message?: string }).message || "Request failed",
    );
  }
  return data as T;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: number;
    email: string;
    name?: string;
    role: string;
    status?: string;
  };
}

export type CmsUserRole = "admin" | "editor";
export type CmsUserStatus = "active" | "inactive";

export interface CmsUser {
  id: number;
  name: string;
  email: string;
  role: CmsUserRole;
  status: CmsUserStatus;
  createdAt?: string | null;
  lastActive?: string | null;
}

export interface HeroSlide {
  tagline: string;
  description: string;
  image: string;
}

export interface HomeStat {
  value: number;
  suffix: string;
  label: string;
}

export interface HomeContent {
  heroSlides: HeroSlide[];
  stats: HomeStat[];
  sectionImages: {
    extrovisBanner: string;
    aboutSection: string;
    qualityServices: string;
    ctaHistory: string;
    workingAtKavis: string;
    research: string[];
    certifications: Array<{ icon: string; label: string }>;
  };
}

export interface AboutHeroSlide {
  title: string;
  description: string;
  image: string;
}

export interface AboutCard {
  image: string;
  title: string;
  description: string;
}

export interface TechCard {
  title: string;
  backText: string;
  image: string;
}

export interface TeamMember {
  image: string;
  name: string;
  role: string;
  description: string;
}

export interface AboutContent {
  heroSlides: AboutHeroSlide[];
  intro: { title: string; description: string };
  prideBanner: { text: string; backgroundImage: string };
  cards: AboutCard[];
  howWeDoIt: {
    title: string;
    description: string;
    qualityAssurance: {
      title: string;
      description: string;
      image: string;
    };
  };
  technologies: {
    title: string;
    description: string;
    cards: TechCard[];
  };
  team: {
    title: string;
    description: string;
    members: TeamMember[];
  };
  cta: {
    title: string;
    buttonText: string;
    buttonLink: string;
  };
}

export type EmploymentType =
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Temporary"
  | "Internship";

export type WorkMode = "On-site" | "Hybrid" | "Remote";

export type ExperienceLevel =
  | "Entry"
  | "Mid"
  | "Senior"
  | "Lead"
  | "Executive";

export type JobStatus = "Open" | "Closed" | "Draft";

export interface JobOpening {
  id: string;
  jobCode: string;
  title: string;
  department: string;
  employmentType: EmploymentType;
  workMode: WorkMode;
  location: string;
  experienceLevel: ExperienceLevel;
  experienceYears: string;
  education: string;
  summary: string;
  responsibilities: string;
  requirements: string;
  preferredQualifications: string;
  benefits: string;
  salaryRange: string;
  openings: number;
  applyEmail: string;
  applyUrl: string;
  postedDate: string;
  closingDate: string;
  status: JobStatus;
  isFeatured: boolean;
}

export interface CareerContent {
  hero: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    backgroundImage: string;
  };
  growth: {
    title: string;
    description: string;
    cards: Array<{ icon: string; text: string }>;
  };
  contactCta: {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
  };
  jobBoard: {
    title: string;
    description: string;
    emptyMessage: string;
    jobs: JobOpening[];
  };
  diversity: {
    title: string;
    description: string;
  };
  bottomImage: {
    imageUrl: string;
  };
}

export interface ContactContent {
  intro: string;
  phone: string;
  phoneHref: string;
  address: string;
  form: {
    nameLabel: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    phonePlaceholder: string;
    messagePlaceholder: string;
    submitText: string;
    successMessage: string;
  };
  socialLinks: Array<{
    platform: string;
    url: string;
    icon: string;
  }>;
  decorativeImage: string;
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<LoginResponse>(response);
}

export async function getHomeContent(): Promise<HomeContent> {
  const response = await fetch(`${API_BASE_URL}/api/home`);
  return handleResponse<HomeContent>(response);
}

export async function saveHomeContent(
  content: HomeContent,
): Promise<{ message: string; data: HomeContent }> {
  const response = await fetch(`${API_BASE_URL}/api/home`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(content),
  });
  return handleResponse<{ message: string; data: HomeContent }>(response);
}

export async function getAboutContent(): Promise<AboutContent> {
  const response = await fetch(`${API_BASE_URL}/api/about`);
  return handleResponse<AboutContent>(response);
}

export async function saveAboutContent(
  content: AboutContent,
): Promise<{ message: string; data: AboutContent }> {
  const response = await fetch(`${API_BASE_URL}/api/about`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(content),
  });
  return handleResponse<{ message: string; data: AboutContent }>(response);
}

export async function getCareerContent(): Promise<CareerContent> {
  const response = await fetch(`${API_BASE_URL}/api/career`);
  return handleResponse<CareerContent>(response);
}

export async function saveCareerContent(
  content: CareerContent,
): Promise<{ message: string; data: CareerContent }> {
  const response = await fetch(`${API_BASE_URL}/api/career`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(content),
  });
  return handleResponse<{ message: string; data: CareerContent }>(response);
}

export async function getContactContent(): Promise<ContactContent> {
  const response = await fetch(`${API_BASE_URL}/api/contact`);
  return handleResponse<ContactContent>(response);
}

export async function saveContactContent(
  content: ContactContent,
): Promise<{ message: string; data: ContactContent }> {
  const response = await fetch(`${API_BASE_URL}/api/contact`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(content),
  });
  return handleResponse<{ message: string; data: ContactContent }>(response);
}

export async function uploadImage(
  file: File,
): Promise<{ message: string; url: string; filename: string }> {
  const formData = new FormData();
  formData.append("image", file);
  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: "POST",
    headers: getAuthTokenHeader(),
    body: formData,
  });
  return handleResponse<{ message: string; url: string; filename: string }>(
    response,
  );
}

export const usersApi = {
  list: async (): Promise<CmsUser[]> => {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<CmsUser[]>(response);
  },
  create: async (payload: {
    name: string;
    email: string;
    password: string;
    role: CmsUserRole;
    status: CmsUserStatus;
  }): Promise<CmsUser> => {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<CmsUser>(response);
  },
  update: async (
    id: number,
    payload: Partial<{
      name: string;
      email: string;
      password: string;
      role: CmsUserRole;
      status: CmsUserStatus;
    }>,
  ): Promise<CmsUser> => {
    const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<CmsUser>(response);
  },
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string }>(response);
  },
};

export function logout() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("isAuthenticated");
  localStorage.removeItem("adminEmail");
  localStorage.removeItem("adminName");
  localStorage.removeItem("adminRole");
  localStorage.removeItem("adminUserId");
}
