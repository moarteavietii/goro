import * as Sentry from "@sentry/bun";
import dotenv from 'dotenv';
dotenv.config();

const sentryDsn = process.env.SENTRY_DSN;

if (!sentryDsn) {
    console.error('Missing SENTRY_DSN in env');
    process.exit(1);
}

Sentry.init({
    dsn: sentryDsn,
    // Tracing
    tracesSampleRate: 1.0, // Capture 100% of the transactions
    // Set `tracePropagationTargets` to control for which URLs trace propagation should be enabled
    tracePropagationTargets: ["localhost", /^https:\/\/moarteavietii\.go\.ro/],
});
