// Google Places API utility for fetching nearby vets
// Add your Google Maps API key in .env.local as NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

export interface GoogleVet {
  place_id: string;
  name: string;
  vicinity: string;
  geometry: { location: { lat: number; lng: number } };
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: { open_now: boolean };
  photos?: { photo_reference: string }[];
  types?: string[];
}

export async function fetchNearbyVets(lat: number, lng: number, radius = 50000): Promise<GoogleVet[]> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) throw new Error("Google Maps API key not set");

  const endpoint = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=veterinary_care&key=${apiKey}`;
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error("Failed to fetch from Google Places API");
  const data = await res.json();
  return data.results as GoogleVet[];
}
