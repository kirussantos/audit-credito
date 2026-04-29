import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let _app: App | null = null;

function getAdminApp(): App | null {
  if (_app) return _app;
  if (getApps().length > 0) {
    _app = getApps()[0];
    return _app;
  }

  const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!key) return null;

  try {
    const serviceAccount = JSON.parse(key);
    _app = initializeApp({ credential: cert(serviceAccount) });
    return _app;
  } catch (err) {
    console.error("[firebase] Falha ao inicializar Firebase Admin:", err);
    return null;
  }
}

export function getDb(): Firestore | null {
  const app = getAdminApp();
  if (!app) return null;
  try {
    return getFirestore(app);
  } catch {
    return null;
  }
}
