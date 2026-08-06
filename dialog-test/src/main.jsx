import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DialRoot } from 'dialkit';
import 'dialkit/styles.css';
import './styles.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<App />
		{/* This whole page is the tuning tool, so keep the panel in the
		    production build too — DialRoot hides itself otherwise. */}
		<DialRoot position="top-right" defaultOpen theme="dark" productionEnabled />
	</StrictMode>,
);
