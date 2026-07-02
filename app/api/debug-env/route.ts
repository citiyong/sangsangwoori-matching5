export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? null;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? null;

  return Response.json({
    url,
    urlLength: url?.length ?? 0,
    keyLength: key?.length ?? 0,
    keyStartsWith: key?.slice(0, 12) ?? null,
    keyEndsWith: key?.slice(-12) ?? null,
  });
}
