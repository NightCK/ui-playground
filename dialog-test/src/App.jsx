import { useEffect, useMemo, useRef, useState } from 'react';
import { useDialKit } from 'dialkit';
import { CheckIcon, ChevronDownIcon, CloseIcon } from './icons.jsx';

const FORMATS = ['PDF', 'DOCX', 'TXT'];

/** The three sizes under test. `custom` falls back to the free slider. */
const WIDTH_PRESETS = { small: 480, medium: 640, large: 800 };

const TRANSCRIPT_LABELS = [
	'Transcript',
	'Transcript — Kickoff',
	'Transcript — Design sync',
	'Transcript — Weekly standup',
	'Transcript — Customer interview',
	'Transcript — Roadmap review',
	'Transcript — Retro',
	'Transcript — 1:1 notes',
	'Transcript — Bug triage',
	'Transcript — Sprint planning',
	'Transcript — Stakeholder update',
	'Transcript — Research readout',
];

/** Rows mirror the Figma exportDialog: first row checked, an Audio row last. */
function buildItems(count) {
	const items = [];
	for (let i = 0; i < count; i++) {
		if (i === 0) items.push({ label: 'Summary', format: 'PDF', checked: true });
		else if (i === count - 1) items.push({ label: 'Audio', format: 'MP3', checked: false });
		else
			items.push({
				label: TRANSCRIPT_LABELS[(i - 1) % TRANSCRIPT_LABELS.length],
				format: FORMATS[i % FORMATS.length],
				checked: false,
			});
	}
	return items;
}

export default function App() {
	/* Mirrors the preset one render behind so the config can drop the custom
	   slider — DialKit re-registers the panel whenever the config changes. */
	const [preset, setPreset] = useState('small');

	const config = useMemo(
		() => ({
			size: {
				maxHeightVh: [85, 40, 100, 1],
				widthPreset: {
					type: 'select',
					options: [
						{ value: 'small', label: 'Small · 480' },
						{ value: 'medium', label: 'Medium · 640' },
						{ value: 'large', label: 'Large · 800' },
						{ value: 'custom', label: 'Custom' },
					],
					default: 'small',
				},
				...(preset === 'custom' ? { customWidth: [480, 320, 960, 4] } : {}),
			},
			content: {
				itemCount: [20, 0, 80, 1],
			},
		}),
		[preset],
	);

	const dials = useDialKit(
		'Dialog',
		config,
		/* Key is versioned: bumping it lets new defaults win over saved values. */
		{ persist: { key: 'dialog-playground-v3' } },
	);

	const { maxHeightVh, widthPreset, customWidth } = dials.size;
	const { itemCount } = dials.content;

	useEffect(() => {
		setPreset(widthPreset);
	}, [widthPreset]);

	const width = widthPreset === 'custom' ? (customWidth ?? 480) : WIDTH_PRESETS[widthPreset];

	const dialogRef = useRef(null);
	const bodyRef = useRef(null);
	const [metrics, setMetrics] = useState(null);

	useEffect(() => {
		const dialog = dialogRef.current;
		const body = bodyRef.current;
		if (!dialog || !body) return;

		const measure = () => {
			setMetrics({
				viewport: window.innerHeight,
				maxHeightPx: Math.round((window.innerHeight * maxHeightVh) / 100),
				dialogHeight: Math.round(dialog.getBoundingClientRect().height),
				bodyVisible: Math.round(body.clientHeight),
				bodyContent: Math.round(body.scrollHeight),
			});
		};

		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(dialog);
		observer.observe(body);
		window.addEventListener('resize', measure);
		return () => {
			observer.disconnect();
			window.removeEventListener('resize', measure);
		};
	}, [maxHeightVh, width, itemCount]);

	const items = buildItems(itemCount);
	const scrolls = metrics ? metrics.bodyContent > metrics.bodyVisible + 1 : false;
	const capped = metrics ? metrics.dialogHeight >= metrics.maxHeightPx - 1 : false;

	return (
		<div className="overlay">
			<div
				className="dialog"
				role="dialog"
				aria-modal="true"
				aria-labelledby="dialog-title"
				ref={dialogRef}
				style={{ '--dialog-max-height': `${maxHeightVh}vh`, '--dialog-width': `${width}px` }}
			>
				<header className="dialog__header">
					<div className="dialog__title-bar">
						<h2 className="dialog__title" id="dialog-title">
							Export
						</h2>
						<button className="icon-button" type="button" aria-label="Close">
							<CloseIcon />
						</button>
					</div>
				</header>

				<div className="dialog__body" ref={bodyRef}>
					<div className="dialog__rows">
						{items.map((item, index) => (
							<div className="row" key={index}>
								<span className="row__checkbox-hit">
									<span className={`checkbox${item.checked ? ' checkbox--selected' : ''}`}>
										{item.checked && <CheckIcon />}
									</span>
								</span>
								<span className="row__label">{item.label}</span>
								<span className="selector">
									{item.format}
									{item.format !== 'MP3' && <ChevronDownIcon />}
								</span>
							</div>
						))}
					</div>
					<p className="dialog__filename">
						File name: <strong>‘AI notetaker brainstorming.pdf’</strong>
					</p>
				</div>

				<footer className="dialog__footer">
					<button className="button button--secondary" type="button">
						Cancel
					</button>
					<button className="button button--primary" type="button">
						Export
					</button>
				</footer>
			</div>

			{metrics && (
				<div className="hud">
					<div className="hud__row">
						<span>viewport</span>
						<b>{metrics.viewport}px</b>
					</div>
					<div className="hud__row">
						<span>
							max-height {maxHeightVh}vh
						</span>
						<b>{metrics.maxHeightPx}px</b>
					</div>
					<div className="hud__row">
						<span>dialog height</span>
						<b>
							{metrics.dialogHeight}px {capped ? '(capped)' : '(hug)'}
						</b>
					</div>
					<div className="hud__row">
						<span>body visible / content</span>
						<b>
							{metrics.bodyVisible} / {metrics.bodyContent}px
						</b>
					</div>
					<div className="hud__row">
						<span>scrolling</span>
						<b className={scrolls ? 'hud--on' : ''}>{scrolls ? 'yes' : 'no'}</b>
					</div>
					<div className="hud__row">
						<span>width ({widthPreset})</span>
						<b>{width}px</b>
					</div>
				</div>
			)}
		</div>
	);
}
