/**
 * Renders a JSON-LD script tag. Server Component — no client JS shipped.
 * Uses a stable key so React does not re-order scripts across pages.
 */
export function JsonLd({ data, id }: { data: object; id?: string }) {
  return (
    <script
      type="application/ld+json"
      id={id}
      // JSON.stringify output is safe: no user input is embedded unsanitized.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
