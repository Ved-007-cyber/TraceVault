import { supabase } from "@/lib/supabase";

export default async function TestPage() {
  const { data, error } = await supabase
    .from("users")
    .select("*");

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <pre>{JSON.stringify(data, null, 2)}</pre>
  );
}