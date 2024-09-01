import { Webhooks } from "@octokit/webhooks";
import logger from "src/logger";
import dotenv from 'dotenv'

dotenv.config();
const secret = process.env.GITHUB_WEBHOOK_SECRET;

if (!secret) {
    logger.error('Missing GITHUB_WEBHOOK_SECRET in env');
    process.exit(1);
}

export const handleWebhook = async (content: string, signature: string) => {
    const webhooks = new Webhooks({ secret });

    return await webhooks.verify(content, signature);
};
