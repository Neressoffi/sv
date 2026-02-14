import { Component } from 'react'

export class ErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#fff1f2] text-rose-900">
          <span className="text-4xl mb-4">💔</span>
          <h1 className="text-xl font-bold text-rose-800">Une erreur s'est produite</h1>
          <p className="mt-2 text-sm text-rose-700 text-center max-w-sm">
            Ouvre la console du navigateur (F12 → Console) pour voir le détail.
          </p>
          {this.state.error && (
            <pre className="mt-4 p-3 rounded-lg bg-white/80 text-xs overflow-auto max-w-full max-h-32">
              {this.state.error.message}
            </pre>
          )}
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-6 px-4 py-2 rounded-xl bg-rose-500 text-white font-medium"
          >
            Réessayer
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
