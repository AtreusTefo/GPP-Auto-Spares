import React from 'react'
import { BuilderComponent, builder, useIsPreviewing } from '@builder.io/react'
import './App.css'

// Initialize Builder with your API key
builder.init('29449c4a506b4f0da87f7d56d9c46785')

function App() {
  const isPreviewing = useIsPreviewing()
  
  return (
    <div className="App">
      {/* Builder.io content will be rendered here */}
      <BuilderComponent model="page" />
      
      {/* Fallback content when no Builder.io content is found */}
      {!isPreviewing && (
        <div className="fallback-content">
          <h1>Welcome to GPP Website</h1>
          <p>This website is powered by Builder.io</p>
          <p>Create content in your Builder.io dashboard to see it here.</p>
        </div>
      )}
    </div>
  )
}

export default App