import dotenv from 'dotenv';

dotenv.config();

export async function fetchPostHogData(projectId: string, apiKey: string) {
    console.log(`[PostHog] Fetching analytics data for Project ID: ${projectId}...`);
    
    // Mock Response based on official PostHog API documentation for a 'Trend' insight
    // Real call would be: axios.get(`https://eu.posthog.com/api/projects/${projectId}/insights/trend/`, { headers: { Authorization: `Bearer ${apiKey}` }})
    
    return {
        "is_cached": false,
        "last_refresh": new Date().toISOString(),
        "result": [
            {
                "action": {
                    "id": "$pageview",
                    "type": "events",
                    "order": 0,
                    "name": "$pageview",
                    "custom_name": null,
                    "math": "total"
                },
                "label": "Pageviews",
                "count": 1420,
                "data": [100, 150, 120, 200, 250, 220, 380],
                "labels": ["01-Apr-2026", "02-Apr-2026", "03-Apr-2026", "04-Apr-2026", "05-Apr-2026", "06-Apr-2026", "07-Apr-2026"],
                "days": ["2026-04-01", "2026-04-02", "2026-04-03", "2026-04-04", "2026-04-05", "2026-04-06", "2026-04-07"],
                "aggregated_value": 1420
            }
        ],
        "next": null
    };
}
