import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function CodeStats() {
  const router = useRouter();
  const { code } = router.query;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code) return;
    setLoading(true);
    fetch(`/api/links/${code}`).then(async res => {
      if (res.ok) setData(await res.json());
      else setData({ error: 'Not found' });
      setLoading(false);
    });
  }, [code]);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data</p>;
  if (data.error) return <p>{data.error}</p>;

  return (
    <main style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>Stats for {data.code}</h1>
      <p><strong>Target:</strong> <a href={data.url}>{data.url}</a></p>
      <p><strong>Clicks:</strong> {data.clicks}</p>
      <p><strong>Created:</strong> {new Date(data.created_at).toLocaleString()}</p>
      <p><strong>Last clicked:</strong> {data.last_clicked ? new Date(data.last_clicked).toLocaleString() : '-'}</p>
      <p><a href="/">Back to dashboard</a></p>
    </main>
  );
}
