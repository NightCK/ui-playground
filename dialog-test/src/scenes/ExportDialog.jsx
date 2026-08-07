import { CheckIcon, ChevronDownIcon, CloseIcon } from '../icons.jsx';

const FORMATS = ['PDF', 'DOCX', 'TXT'];

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
export function buildItems(count) {
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

export default function ExportDialog({ count, bodyRef }) {
	const items = buildItems(count);

	return (
		<>
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
		</>
	);
}
