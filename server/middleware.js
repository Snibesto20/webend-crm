import { ApiKey } from './models.js';

export const auth = (allowedRoles = []) => async (req, res, next) => {
  const userKey = req.headers['x-api-key'];
  if (!userKey) return res.status(401).json({ error: "API raktas nepateiktas." });

  try {
    const keyDoc = await ApiKey.findOne({ key: userKey });
    if (!keyDoc) return res.status(401).json({ error: "Neteisingas raktas." });

    if (allowedRoles.length > 0 && !allowedRoles.includes(keyDoc.role)) {
      return res.status(403).json({ error: "Prieiga uždrausta." });
    }

    req.user = keyDoc;
    next();
  } catch (err) {
    res.status(500).json({ error: "Serverio klaida autorizacijos metu." });
  }
};