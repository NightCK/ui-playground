import { useEffect, useMemo, useRef, useState } from 'react';
import { useDialKit } from 'dialkit';
import AppBackground from './scenes/AppBackground.jsx';
import ExportDialog from './scenes/ExportDialog.jsx';
import ShareDialog from './scenes/ShareDialog.jsx';

/** The three sizes under test. `custom` falls back to the free slider. */
const WIDTH_PRESETS = { small: 480, medium: 640, large: 800 };

export default function App() {
	/* Mirrors the preset one render behind so the config can drop the custom
	   slider — DialKit re-registers the panel whenever the config changes. */
	const [preset, setPreset] = useState('small');

	const config = useMemo(
		() => ({
			scene: {
				type: 'select',
				options: [
					{ value: 'dialog', label: '純 dialog' },
					{ value: 'share', label: 'Share Dialog' },
				],
				default: 'dialog',
			},
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

	const scene = dials.scene;
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
	}, [maxHeightVh, width, itemCount, scene]);

	const scrolls = metrics ? metrics.bodyContent > metrics.bodyVisible + 1 : false;
	const capped = metrics ? metrics.dialogHeight >= metrics.maxHeightPx - 1 : false;

	return (
		<div className={`stage stage--${scene}`}>
			{scene === 'share' && <AppBackground />}

			<div className="overlay">
				<div
					className={`dialog dialog--${scene}`}
					role="dialog"
					aria-modal="true"
					aria-labelledby="dialog-title"
					ref={dialogRef}
					style={{ '--dialog-max-height': `${maxHeightVh}vh`, '--dialog-width': `${width}px` }}
				>
					{scene === 'share' ? (
						<ShareDialog count={itemCount} bodyRef={bodyRef} />
					) : (
						<ExportDialog count={itemCount} bodyRef={bodyRef} />
					)}
				</div>
			</div>

			{metrics && (
				<div className="hud">
					<div className="hud__row">
						<span>scene</span>
						<b>{scene === 'share' ? 'Share Dialog' : '純 dialog'}</b>
					</div>
					<div className="hud__row">
						<span>{scene === 'share' ? 'people' : 'items'}</span>
						<b>{itemCount}</b>
					</div>
					<div className="hud__row">
						<span>viewport</span>
						<b>{metrics.viewport}px</b>
					</div>
					<div className="hud__row">
						<span>max-height {maxHeightVh}vh</span>
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
