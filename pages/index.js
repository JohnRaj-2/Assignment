import pool from '../../../lib/db';

const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { rows } = await pool.query('SELECT code, url, clicks, created_at, last_clicked FROM links ORDER BY created_at DESC');
      return res.status(200).json(rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'server error' });
    }
  } else if (req.method === 'POST') {
    const body = req.body || {};
    const { url, code } = body;

    if (!url || typeof url !== 'string') return res.status(400).json({ error: 'url required' });
    try {
      new URL(url);
    } catch (e) {
      return res.status(400).json({ error: 'invalid url' });
    }

    let shortCode = code;
    if (shortCode) {
      if (!CODE_REGEX.test(shortCode)) return res.status(400).json({ error: 'code invalid' });
    } else {
      // generate using nanoid
      const { customAlphabet } = require('nanoid');
      const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      shortCode = customAlphabet(alphabet, 7)();
    }

    try {
      const q = 'INSERT INTO links(code, url) VALUES($1, $2) RETURNING code, url, clicks, created_at, last_clicked';
      const { rows } = await pool.query(q, [shortCode, url]);
      return res.status(201).json(rows[0]);
    } catch (err) {
      // duplicate key error code for Postgres is '23505'
      if (err && err.code === '23505') {
        return res.status(409).json({ error: 'code already exists' });
      }
      console.error(err);
      return res.status(500).json({ error: 'server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
