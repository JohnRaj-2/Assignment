import { useEffect, useState } from 'react';

export default function Home() {
  const [links, setLinks] = useState([]);
  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function fetchLinks() {
    const res = await fetch('/api/links');
    const data = await res.json();
    setLinks(data);
  }

  useEffect(() => { fetchLinks(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, code: code || undefined })
      });
      if (res.status === 201) {
        const created = await res.json();
        setMessage({ type: 'success', text: `Created ${created.code}` });
        setUrl(''); setCode('');
        fetchLinks();
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.error || 'Error' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(c) {
    if (!confirm('Delete this link?')) return;
    await fetch(`/api/links/${c}`, { method: 'DELETE' });
    fetchLinks();
  }

  return (
    <main style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>TinyLink - Dashboard</h1>
      <form onSubmit={handleCreate} style={{ marginBottom: 20 }}>
        <div>
          <label>URL: </label>
          <input value={url} onChange={e => setUrl(e.target.value)} style={{ width: 400 }} placeholder="https://example.com/..." />
        </div>
        <div style={{ marginTop: 8 }}>
          <label>Custom Code (optional): </label>
          <input value={code} onChange={e => setCode(e.target.value)} placeholder="6-8 alphanumeric" />
        </div>
        <div style={{ marginTop: 8 }}>
          <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create'}</button>
        </div>
        {message && <div style={{ marginTop: 8, color: message.type === 'error' ? 'red' : 'green' }}>{message.text}</div>}
      </form>

      <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr><th>Code</th><th>Target URL</th><th>Clicks</th><th>Last Clicked</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {links.map(l => (
            <tr key={l.code}>
              <td><a href={`/code/${l.code}`}>{l.code}</a></td>
              <td style={{ maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={l.url}>{l.url}</td>
              <td>{l.clicks}</td>
              <td>{l.last_clicked ? new Date(l.last_clicked).toLocaleString() : '-'}</td>
              <td>
                <button onClick={() => { navigator.clipboard?.writeText(`${location.origin}/${l.code}`); alert('Copied'); }}>Copy</button>
                <button onClick={() => handleDelete(l.code)} style={{ marginLeft: 8 }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
