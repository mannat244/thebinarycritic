export async function GET(req) {
    try {
        // Extract query params from request URL
        const { searchParams } = new URL(req.url);
        const providerName = searchParams.get("provider");
        const movieTitle = searchParams.get("movie");

        if (!providerName || !movieTitle) {
            return new Response(JSON.stringify({ error: "Missing provider or movie title" }), { status: 400 });
        }

        // Map provider name to actual URL
        let providerUrl = getProviderURL(providerName);
        
        // Construct search query
        let searchQuery = `site:${providerUrl} "${movieTitle}"`;
        const apiUrl = `https://serpapi.com/search?engine=google_light&q=${encodeURIComponent(searchQuery)}&api_key=${"e4af0ebdf76190ffb35221397b50ebd3eb9eef02703f1f6940127d14524eb866"}&hl=en&gl=in`;

        // Fetch data from SerpAPI
        const response = await fetch(apiUrl);
        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}

// Function to map provider names to URLs
function getProviderURL(providerName) {
    const providerMap = {
        "Netflix": "https://www.netflix.com",
        "Amazon Prime Video": "https://www.primevideo.com",
        "Disney+": "https://www.disneyplus.com",
        "Apple TV": "https://tv.apple.com",
        "Hulu": "https://www.hulu.com",
        "Max": "https://www.max.com",
        "Paramount+": "https://www.paramountplus.com",
        "Peacock": "https://www.peacocktv.com",
        "Google Play Movies": "https://play.google.com/store/movies",
        "YouTube Movies": "https://www.youtube.com/movies",
        "Vudu": "https://www.vudu.com",
        "JioHotstar": "https://www.hotstar.com",
        "JioCinema": "https://www.jiocinema.com",
        "Voot": "https://www.voot.com",
        "Zee5": "https://www.zee5.com",
        "SonyLIV": "https://www.sonyliv.com",
    };

    return providerMap[providerName] || "https://www.imdb.com/";
}
