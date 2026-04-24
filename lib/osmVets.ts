// Fetch nearby vets using OpenStreetMap Overpass API (free)
// Usage: fetchOSMVets(lat, lng, radiusInMeters)

export interface OSMVet {
  id: number;
  name: string;
  lat: number;
  lon: number;
  address?: string;
}

export async function fetchOSMVets(lat: number, lng: number, radius = 50000): Promise<OSMVet[]> {
  // Overpass QL query for vet clinics within radius
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="veterinary"](around:${radius},${lat},${lng});
      way["amenity"="veterinary"](around:${radius},${lat},${lng});
      relation["amenity"="veterinary"](around:${radius},${lat},${lng});
    );
    out center tags;
  `;
  const url = "https://overpass-api.de/api/interpreter";
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(query)}`,
  });
  if (!res.ok) throw new Error("Failed to fetch from OSM Overpass API");
  const data = await res.json();
  return (data.elements || []).map((el: any) => ({
    id: el.id,
    name: el.tags?.name || "Unknown Vet Clinic",
    lat: el.lat || el.center?.lat,
    lon: el.lon || el.center?.lon,
    address: el.tags?.['addr:full'] || el.tags?.['addr:street'] || '',
  }));
}
