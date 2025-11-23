import pool from '../lib/db';

export async function getServerSideProps({ params, res }) {
  const code = params.code;
  const client = pool;
  try {
    const { rows } = await client.query('SELECT url FROM links WHERE code=$1', [code]);
    if (!rows.length) {
      res.statusCode = 404;
      return { props: { notFound: true } };
    }
    const url = rows[0].url;
    await client.query('UPDATE links SET clicks = clicks + 1, last_clicked = now() WHERE code=$1', [code]);
    return {
      redirect: {
        destination: url,
        permanent: false
      }
    };
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    return { props: { notFound: true } };
  }
}

export default function RedirectPage({ notFound }) {
  if (notFound) return <h1>404 Not Found</h1>;
  return <p>Redirecting...</p>;
}
