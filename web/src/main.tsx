import { StrictMode, Component, Suspense, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

class RootErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) {
      return <div className="p-6 text-sm text-red-700 bg-red-50">Something went wrong. Please refresh.</div>
    }
    return this.props.children
  }
}

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Root element #root not found')

createRoot(rootEl).render(
  <StrictMode>
    <RootErrorBoundary>
      <Suspense fallback={<div className="p-6 text-gray-600">Loading…</div>}>
        <App />
      </Suspense>
    </RootErrorBoundary>
  </StrictMode>
)
