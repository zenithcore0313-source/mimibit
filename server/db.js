// =====================================================================
// MIMIBIT Persistent Data Engine (Zero-Config JSON Store)
// Guarantees 0-dependency native compilation issues on AWS Linux
// =====================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const INITIAL_DB = {
  creators: [],
  donations: [],
  charges: [],
  bankTransfers: [],
  payouts: [],
  messages: [],
  users: [
    {
      id: "usr_admin_root",
      email: "zeze1.sec@gmail.com",
      name: "root",
      handle: "root",
      role: "admin",
      passwordHash: "64e72bbff787049047debb40d09ee9fc735934246caaae896e3bda363c4ca6d3",
      salt: "53100712c9388c2aaeb09d74426ed1ec",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      carrotsBalance: 999999,
      tickets: 9999,
      isLoggedIn: true,
      createdAt: "2026-10-17T16:28:59.697Z"
    },
    {
      id: "usr_admin_musengche",
      email: "Qwer1821@mimibit.me",
      username: "Qwer1821",
      name: "뮤생체",
      handle: "Qwer1821",
      role: "admin",
      passwordHash: "de32fe32f4ff24e3d6488effae7e8b87afca0aefc5fa9480f02205b9c33e4876",
      salt: "e9a1263742b8b3c64c6089b339ab570d",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      carrotsBalance: 999999,
      tickets: 9999,
      isLoggedIn: true,
      createdAt: "2026-10-19T00:00:00.000Z"
    }
  ]
};

// Ensure data folder and file exist
export function initDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), 'utf-8');
  }
}

export function readDb() {
  initDb();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.users)) parsed.users = [];
    if (!Array.isArray(parsed.creators)) parsed.creators = [];
    if (!Array.isArray(parsed.donations)) parsed.donations = [];
    if (!Array.isArray(parsed.charges)) parsed.charges = [];
    if (!Array.isArray(parsed.bankTransfers)) parsed.bankTransfers = [];
    if (!Array.isArray(parsed.payouts)) parsed.payouts = [];
    return parsed;
  } catch (err) {
    return INITIAL_DB;
  }
}

export function writeDb(data) {
  initDb();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}
