import { Webhooks } from "@octokit/webhooks";
require('dotenv').config();

export const handleWebhook = async (signature: string, content: string) => {
    const webhooks = new Webhooks({
        secret: process.env.GITHUB_WEBHOOK_SECRET!,
    });

    return await webhooks.verify(content, signature);
};
