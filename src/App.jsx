import React from 'react';
import BezierCanvas from './components/BezierCanvas';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Bezier Canvas</h1>
      </header>
      <main>
        <BezierCanvas />
      </main>
    </div>
  );
}

export default App;
