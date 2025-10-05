import { getApps, createApp } from "@/lib/actions";
import { Button } from "@/components/ui/button";

export default async function TestPage() {
  const { data: apps } = await getApps();

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Server Actions Example</h1>

      {/* Example: Form with server action */}
      <section className="mb-8 p-6 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Create App</h2>
        <form action={createApp} className="space-y-4">
          <input
            name="name"
            placeholder="App name"
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="slug"
            placeholder="Slug (e.g., instagram)"
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            className="w-full p-2 border rounded"
          />
          <select name="platform" className="w-full p-2 border rounded">
            <option value="IOS">iOS</option>
            <option value="ANDROID">Android</option>
            <option value="WEB">Web</option>
          </select>
          <Button type="submit">Create App</Button>
        </form>
      </section>

      {/* Example: Display data and button action */}
      <section className="p-6 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          Apps ({apps?.length || 0})
        </h2>
        <div className="space-y-4">
          {apps?.map((app) => (
            <div key={app.id} className="p-4 bg-muted rounded">
              <h3 className="font-bold">{app.name}</h3>
              <p className="text-sm text-muted-foreground">{app.description}</p>
              <p className="text-xs mt-2">{app.screens.length} screens</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
