import { useEffect, useState } from "react"

type Health = "Unknown" | "Healthy" | "Unhealthy"

export default function App() {
  const [health, setHealth] = useState<Health>("Unknown")

  useEffect(() => {
    fetch("/api/v1/hello")
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(() => setHealth("Healthy"))
      .catch(() => setHealth("Unhealthy"))
  }, [])

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-semibold tracking-tight">Reporting Service</div>
          <nav className="flex items-center gap-6 text-sm">
            <a href="/swagger" className="hover:underline">Swagger</a>
            <a href="/health" className="hover:underline">Health</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 p-10">
          <h1 className="text-3xl font-bold">Reporting Service</h1>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <Card title="API Status">
              <Badge ok={health === "Healthy"}>{health}</Badge>
              <p className="mt-2 text-sm text-gray-600">Checks connectivity to <code>/api/v1/hello</code>.</p>
            </Card>

            <Card title="OpenAPI / Swagger">
              <a className="text-blue-600 hover:underline" href="/swagger">View API docs</a>
              <p className="mt-2 text-sm text-gray-600">Interactive docs for your endpoints.</p>
            </Card>

            <Card title="Next steps">
              <ul className="mt-2 list-disc pl-5 text-sm text-gray-600">
                <li>Hook up the database</li>
                <li>Add DevExpress Viewer & Designer</li>
                <li>Secure with auth (JWT or cookies)</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      <footer className="py-10 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Reporting Service
      </footer>
    </main>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="font-medium">{title}</div>
      <div className="mt-3">{children}</div>
    </div>
  )
}

function Badge({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
      {children}
    </span>
  )
}
