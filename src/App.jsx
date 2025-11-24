import { Scene } from './components/Scene'
import { UIOverlay } from './components/UIOverlay'
import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100 text-red-800 p-8 z-50">
          <div>
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <pre className="bg-white p-4 rounded shadow overflow-auto max-w-2xl">
              {this.state.error && this.state.error.toString()}
            </pre>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

function App() {
  return (
    <div className="w-full h-screen bg-[#f0e6d2]">
      <ErrorBoundary>
        <Scene />
      </ErrorBoundary>
      <UIOverlay />
    </div>
  )
}

export default App
