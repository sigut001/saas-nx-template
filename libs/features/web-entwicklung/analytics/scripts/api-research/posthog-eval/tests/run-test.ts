import { fetchPostHogData } from '../posthog-eval';
import fs from 'fs';
import path from 'path';

async function main() {
    console.log('--- PostHog API Test Runner ---');
    // We use mock parameters if env variables are not present.
    const projectId = process.env.POSTHOG_PROJECT_ID || 'MOCK_PROJECT_123';
    const apiKey = process.env.POSTHOG_API_KEY || 'MOCK_PAT_KEY';

    const data = await fetchPostHogData(projectId, apiKey);
    
    // Save to tests/results/ according to functional script rules
    const date = new Date().toISOString().split('T')[0];
    const resultDir = path.join(__dirname, 'results');
    const resultPath = path.join(resultDir, `posthog-payload_${date}.json`);
    
    if (!fs.existsSync(resultDir)) {
        fs.mkdirSync(resultDir, { recursive: true });
    }

    fs.writeFileSync(resultPath, JSON.stringify(data, null, 2));
    console.log(`✅ [PostHog Test] Payload erfolgreich gespeichert unter: ${resultPath}`);
}

main().catch(console.error);
