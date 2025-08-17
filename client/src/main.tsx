
import React from 'react';
import { createRoot } from 'react-dom/client';
function App(){ return <div>Client ready</div>; }
const root = createRoot(document.getElementById('root')!);
root.render(<App />);
