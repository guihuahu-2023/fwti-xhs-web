import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const registryUrl = new URL('../public/access-registry.json', import.meta.url);
const orderPattern = /^P\d{18}$/;

function fingerprint(value) {
  return createHash('sha256').update(value).digest('hex');
}

function normalizeOrder(value) {
  return value
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '')
    .replace(/[０-９]/g, (char) => String(char.charCodeAt(0) - 0xfee0));
}

async function readRegistry() {
  return JSON.parse(await readFile(registryUrl, 'utf8'));
}

async function saveRegistry(registry) {
  await writeFile(registryUrl, `${JSON.stringify(registry, null, 2)}\n`, 'utf8');
  console.log(`已更新：${fileURLToPath(registryUrl)}`);
}

const [, , command, rawValue] = process.argv;
const registry = await readRegistry();

if (command === 'list') {
  console.log(`已授权订单指纹：${registry.allowedOrderHashes.length} 条`);
  console.log(`管理员口令：${registry.adminAccessHash ? '已设置' : '未设置'}`);
  process.exit(0);
}

if (command === 'set-admin') {
  if (!rawValue || rawValue.length < 24) {
    throw new Error('管理员口令至少需要 24 个字符。');
  }
  registry.adminAccessHash = fingerprint(rawValue.trim());
  await saveRegistry(registry);
  console.log('管理员口令指纹已更新；请妥善保存明文口令，仓库不会保存明文。');
  process.exit(0);
}

const order = normalizeOrder(rawValue ?? '');
if (!orderPattern.test(order)) {
  throw new Error('订单号必须为 P 开头、共 19 位，P 后为 18 位数字。');
}
const hash = fingerprint(order);

if (command === 'add-order') {
  registry.allowedOrderHashes = Array.from(
    new Set([...registry.allowedOrderHashes, hash]),
  ).sort();
  await saveRegistry(registry);
  console.log('订单已加入白名单；GitHub 只会保存不可逆指纹。');
  process.exit(0);
}

if (command === 'remove-order') {
  registry.allowedOrderHashes = registry.allowedOrderHashes.filter(
    (item) => item !== hash,
  );
  await saveRegistry(registry);
  console.log('订单已移出白名单。');
  process.exit(0);
}

throw new Error(
  '用法：node scripts/manage-access.mjs list | add-order <订单号> | remove-order <订单号> | set-admin <口令>',
);
