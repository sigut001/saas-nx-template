import { fetchPageSpeedData } from '../pagespeed-eval';
import fs from 'fs';
import path from 'path';

async function main() {
    console.log('--- PageSpeed API Test Runner ---');
    
    const targetUrl = process.env.PAGESPEED_TARGET_URL || 'https://angular.dev';
    const apiKey = process.env.PAGESPEED_API_KEY || ''; // works a few times without key

    const data = await fetchPageSpeedData(targetUrl, apiKey);
    
    // Save to tests/results/
    const date = new Date().toISOString().split('T')[0];
    const resultDir = path.join(__dirname, 'results');
    const resultPath = path.join(resultDir, `pagespeed-payload_${date}.json`);
    
    if (!fs.existsSync(resultDir)) {
        fs.mkdirSync(resultDir, { recursive: true });
    }

    fs.writeFileSync(resultPath, JSON.stringify(data, null, 2));
    console.log(`✅ [PageSpeed Test] Payload erfolgreich gespeichert unter: ${resultPath}`);
}

main().catch(console.error);
