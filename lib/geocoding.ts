// src/lib/geocoding.ts
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    // NOTE: For production, use a robust service like Google Maps Geocoding API or Mapbox.
    // This is a placeholder using a free, rate-limited API for demonstration.
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data && data.length > 0) {
            return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        }
        return null;
    } catch (error) {
        console.error("Geocoding error:", error);
        return null;
    }
}