import { fetchHubSpotContacts } from '../hubspot-eval';
import fs from 'fs';
import path from 'path';

async function main() {
    console.log('--- HubSpot CRM API Test Runner ---');
    
    const apiKey = process.env.HUBSPOT_API_KEY || 'MOCK_HUBSPOT_KEY';

    const data = await fetchHubSpotContacts(apiKey);
    
    // Save to tests/results/
    const date = new Date().toISOString().split('T')[0];
    const resultDir = path.join(__dirname, 'results');
    const resultPath = path.join(resultDir, `hubspot-payload_${date}.json`);
    
    if (!fs.existsSync(resultDir)) {
        fs.mkdirSync(resultDir, { recursive: true });
    }

    fs.writeFileSync(resultPath, JSON.stringify(data, null, 2));
    console.log(`✅ [HubSpot Test] Payload erfolgreich gespeichert unter: ${resultPath}`);
}

main().catch(console.error);
