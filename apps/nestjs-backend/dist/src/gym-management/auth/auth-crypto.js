"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.hashOpaqueToken = hashOpaqueToken;
const node_buffer_1 = require("node:buffer");
const node_crypto_1 = require("node:crypto");
const scryptKeyLength = 64;
function hashPassword(password) {
    const salt = (0, node_crypto_1.randomBytes)(16).toString('hex');
    const derivedKey = (0, node_crypto_1.scryptSync)(password, salt, scryptKeyLength).toString('hex');
    return `scrypt$${salt}$${derivedKey}`;
}
function verifyPassword(password, passwordHash) {
    if (!passwordHash.startsWith('scrypt$')) {
        return password === passwordHash;
    }
    const [algorithm, salt, derivedKey] = passwordHash.split('$');
    if (algorithm !== 'scrypt' || !salt || !derivedKey) {
        return false;
    }
    const candidate = (0, node_crypto_1.scryptSync)(password, salt, derivedKey.length / 2).toString('hex');
    return (0, node_crypto_1.timingSafeEqual)(node_buffer_1.Buffer.from(candidate, 'hex'), node_buffer_1.Buffer.from(derivedKey, 'hex'));
}
function hashOpaqueToken(token) {
    return (0, node_crypto_1.createHash)('sha256').update(token).digest('hex');
}
//# sourceMappingURL=auth-crypto.js.map