import net from 'node:net';

const host = process.env.E2E_PORT_CHECK_HOST ?? '127.0.0.1';
const portsToCheck = [3000, 4000];
const skipPreflight =
  process.env.E2E_SKIP_PORT_PREFLIGHT === '1'
  || process.env.E2E_SKIP_PORT_PREFLIGHT === 'true';

function checkPortInUse(port, targetHost) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let resolved = false;

    const finish = (isInUse) => {
      if (resolved) {
        return;
      }

      resolved = true;
      socket.destroy();
      resolve(isInUse);
    };

    socket.setTimeout(350);
    socket.once('connect', () => {
      finish(true);
    });

    socket.once('timeout', () => {
      finish(false);
    });

    socket.once('error', (error) => {
      if (['ECONNREFUSED', 'EHOSTUNREACH', 'ENETUNREACH'].includes(error.code)) {
        finish(false);
        return;
      }

      finish(false);
    });

    socket.connect(port, targetHost);
  });
}

if (skipPreflight) {
  console.log('[preflight:e2e] Skipping port preflight check (E2E_SKIP_PORT_PREFLIGHT is set).');
  process.exit(0);
}

const results = await Promise.all(
  portsToCheck.map(async (port) => ({
    port,
    inUse: await checkPortInUse(port, host),
  })),
);

const busyPorts = results
  .filter((entry) => entry.inUse)
  .map((entry) => entry.port);

if (busyPorts.length > 0) {
  console.error(
    `[preflight:e2e] Ports in use: ${busyPorts.join(', ')} on ${host}.`,
  );
  console.error(
    '[preflight:e2e] Stop existing servers on ports 3000/4000 or set E2E_SKIP_PORT_PREFLIGHT=true to bypass intentionally.',
  );
  process.exit(1);
}

console.log('[preflight:e2e] Ports 3000/4000 are available.');
