import pool from '../../../../lib/db';

export default async function handler(req, res) {
  const { code } = req.query;
  if (req.method === 'GET') {
    try {
      const { rows } = await pool.query('SELECT code, url, clicks, created_at, last_clicked FROM links WHERE code=$1', [code]);
      if (!rows.length) return res.status(404).json({ error: 'not found' });
      return res.status(200).json(rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { rowCount } = await pool.query('DELETE FROM links WHERE code=$1', [code]);
      if (!rowCount) return res.status(404).json({ error: 'not found' });
      return res.status(204).end();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
