import { execSync, spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const currentFilePath = fileURLToPath(import.meta.url);
const scriptsDirectory = dirname(currentFilePath);
const repositoryRoot = resolve(scriptsDirectory, '..');

const shouldPush = process.argv.includes('--push');

function runCommand(command, argumentsList) {
    const commandResult = spawnSync(command, argumentsList, {
        cwd: repositoryRoot,
        stdio: 'inherit',
        env: process.env,
    });

    if (commandResult.status !== 0) {
        process.exit(commandResult.status ?? 1);
    }
}

function readCommitSha() {
    const explicitTag = process.env.IMAGE_TAG?.trim();

    if (explicitTag) {
        return explicitTag;
    }

    return execSync('git rev-parse --short=12 HEAD', {
        cwd: repositoryRoot,
        encoding: 'utf8',
    }).trim();
}

function normalizeRegistryPrefix(value) {
    return value.trim().replace(/\/+$/v, '');
}

function resolveImageRepository(imageName) {
    const registryPrefix = normalizeRegistryPrefix(process.env.DOCKER_REGISTRY ?? '');

    return registryPrefix ? `${registryPrefix}/${imageName}` : imageName;
}

const releaseTag = readCommitSha();

const imageDefinitions = [
    {
        imageName: process.env.BACKEND_IMAGE_NAME?.trim() || 'nestjs-backend',
        dockerfilePath: 'apps/nestjs-backend/dockerfile',
    },
    {
        imageName: process.env.FRONTEND_IMAGE_NAME?.trim() || 'nextjs-frontend',
        dockerfilePath: 'apps/nextjs-frontend/dockerfile',
    },
];

for (const imageDefinition of imageDefinitions) {
    const repositoryName = resolveImageRepository(imageDefinition.imageName);
    const latestTag = `${repositoryName}:latest`;
    const versionTag = `${repositoryName}:${releaseTag}`;

    console.log(`\nBuilding ${repositoryName} with tags latest and ${releaseTag}...`);
    runCommand('docker', [
        'build',
        '-f',
        imageDefinition.dockerfilePath,
        '-t',
        latestTag,
        '-t',
        versionTag,
        '.',
    ]);

    if (shouldPush) {
        console.log(`\nPushing ${latestTag}...`);
        runCommand('docker', ['push', latestTag]);

        console.log(`\nPushing ${versionTag}...`);
        runCommand('docker', ['push', versionTag]);
    }
}

console.log('\nRelease image tags created successfully:');
for (const imageDefinition of imageDefinitions) {
    const repositoryName = resolveImageRepository(imageDefinition.imageName);
    console.log(`- ${repositoryName}:latest`);
    console.log(`- ${repositoryName}:${releaseTag}`);
}

if (!shouldPush) {
    console.log('\nUse --push to push both tags to the configured registry.');
}
