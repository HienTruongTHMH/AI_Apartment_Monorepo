// Service layer for AI Agent backend (DungGiaIT/AI-integrated-apartments)
// Backend: FastAPI + Gemini 2.5-Flash
// Endpoint: POST /agent-api/api/verify-listing (proxied via Vite → localhost:8000)

export interface VerifyListingRequest {
  rawText: string;       // 20–1000 chars of raw Vietnamese listing text
  owner_id: string;      // UUID of the landlord
  db_apartment_data?: Record<string, unknown>; // optional reference data
}

export interface VerifyAmenity {
  amenities_name: string;
  category: "Furniture" | "Building" | "Policy";
}

export interface VerifyListingData {
  listing: {
    title: string;
    description: string;
    price_per_month?: number;
    status: "Draft" | "Published" | "Rented";
  };
  apartment_meta: {
    area_m2?: number;
    floor?: number;
    room_number?: string;
    note?: string;
    amenities: VerifyAmenity[];
  };
  image_tags_suggested: string[];
  validation: {
    status: "Pass" | "Fail";
    score: number;
    data_conflicts: string[];
    is_verified_by_db: boolean;
    missing_fields: string[];
    issues: string[];
    feedback_to_owner?: string;
  };
}

export interface VerifyListingResponse {
  success: boolean;
  data?: VerifyListingData;
  error?: string;
}

// Build raw text from LandlordApp form fields
export function buildRawText(form: {
  title?: string;
  description?: string;
  address?: string;
  price?: string;
  area?: string;
  rooms?: string;
}): string {
  const parts = [
    form.title || "Căn hộ cho thuê",
    form.description,
    form.address ? `Địa chỉ: ${form.address}` : "",
    form.price ? `Giá thuê: ${Number(form.price) * 1000} VNĐ/tháng (${form.price}K)` : "",
    form.area ? `Diện tích: ${form.area}m²` : "",
    form.rooms ? `${form.rooms} phòng ngủ` : "",
  ].filter(Boolean).join(". ");

  // API limit: 20–1000 chars
  return parts.slice(0, 950);
}

// Call the AI Agent verify endpoint
// Returns null if backend is unreachable (will trigger simulation fallback)
export async function verifyListing(
  req: VerifyListingRequest
): Promise<VerifyListingResponse | null> {
  try {
    const res = await fetch("/agent-api/api/verify-listing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
      signal: AbortSignal.timeout(15_000), // 15s timeout
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { success: false, error: `HTTP ${res.status}: ${body.slice(0, 120)}` };
    }

    return (await res.json()) as VerifyListingResponse;
  } catch (err) {
    // Network error / backend not running → caller will use simulation
    if (err instanceof Error && err.name === "TimeoutError") {
      return { success: false, error: "Backend timeout (>15s)" };
    }
    return null; // null = backend unreachable
  }
}

// Health check – used to show agent status badge in UI
export async function checkAgentHealth(): Promise<boolean> {
  try {
    const res = await fetch("/agent-api/api/health", {
      signal: AbortSignal.timeout(3_000),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data?.status === "ok";
  } catch {
    return false;
  }
}
