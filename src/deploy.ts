import { $ } from "bun";

export const deploy = async (runInstall = false) => {
    await $`git pull`;

    if (runInstall) {
        await $`bun install`;
    }
}