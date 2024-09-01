import { Webhooks } from "@octokit/webhooks";
require('dotenv').config();

const secret = process.env.GITHUB_WEBHOOK_SECRET;

if(!secret) {
    console.error('Missing GITHUB_WEBHOOK_SECRET in env');
    process.exit(1);
}

export const handleWebhook = async (content: string, signature: string) => {
    const webhooks = new Webhooks({ secret });

    return await webhooks.verify(content, signature);
};
