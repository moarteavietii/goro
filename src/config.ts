import dotenv from "dotenv";
import logger from "src/logger";
dotenv.config();

const { SSL_CERTIFICATE_FILE, SSL_PRIVATE_KEY_FILE, SERVER_PORT } = process.env;

// TODO: do a validation with joi !?
if (!SSL_CERTIFICATE_FILE) {
    logger.error('Missing SSL_CERTIFICATE_FILE in env');
    process.exit(1);
}

if (!SSL_PRIVATE_KEY_FILE) {
    logger.error('Missing SSL_PRIVATE_KEY_FILE in env');
    process.exit(1);
}

if (!SERVER_PORT) {
    logger.error('Missing SERVER_PORT in env');
    process.exit(1);
}

export default {
    SSL_CERTIFICATE_FILE,
    SSL_PRIVATE_KEY_FILE,
    SERVER_PORT
}