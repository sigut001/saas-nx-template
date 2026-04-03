import dotenv from 'dotenv';

dotenv.config();

export async function fetchHubSpotContacts(apiKey: string) {
    console.log(`[HubSpot CRM] Fetching Contacts data via API...`);
    
    // Mock Response based on official HubSpot API v3 Documentation
    // Real call: axios.get(`https://api.hubapi.com/crm/v3/objects/contacts?properties=firstname,lastname,email,lifecyclestage`, { headers: { Authorization: `Bearer ${apiKey}` }})
    
    return {
        "results": [
            {
                "id": "512",
                "properties": {
                    "createdate": "2026-03-15T10:00:00.000Z",
                    "email": "elon.musk@example.com",
                    "firstname": "Elon",
                    "lastname": "Musk",
                    "lifecyclestage": "lead"
                },
                "createdAt": "2026-03-15T10:00:00.000Z",
                "updatedAt": "2026-04-01T14:20:00.000Z",
                "archived": false
            },
            {
                "id": "513",
                "properties": {
                    "createdate": "2026-03-16T11:30:00.000Z",
                    "email": "tim.cook@example.com",
                    "firstname": "Tim",
                    "lastname": "Cook",
                    "lifecyclestage": "customer"
                },
                "createdAt": "2026-03-16T11:30:00.000Z",
                "updatedAt": "2026-04-02T09:15:00.000Z",
                "archived": false
            }
        ],
        "paging": {
            "next": {
                "after": "NTEz",
                "link": "?after=NTEz"
            }
        }
    };
}
