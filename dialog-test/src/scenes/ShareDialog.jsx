import { ArrowIcon, ChevronDownIcon, CloseIcon, LockIcon, XSmallIcon } from '../icons.jsx';

const PEOPLE = [
	{ name: 'Ricky Morty', color: '#8b5e3c', role: 'Owner' },
	{ name: 'Alice Telton', color: '#2a645a' },
	{ name: 'Lisa', color: '#2a645a' },
	{ name: 'nal@gmail.com', color: '#7b5bd6' },
	{ name: 'Jason Wu', color: '#405dff' },
	{ name: 'Emma Chen', color: '#a8452f' },
	{ name: 'Daniel Park', color: '#1f6f4a' },
	{ name: 'Sofia Rossi', color: '#8a5c1f' },
	{ name: 'Mark Liu', color: '#2f5fa8' },
	{ name: 'Nina Patel', color: '#7a2f6b' },
	{ name: 'Oliver Brandt', color: '#3d6b2f' },
	{ name: 'Yuki Tanaka', color: '#6b4fb8' },
];

function initials(name) {
	if (name.includes('@')) return name[0].toUpperCase();
	const parts = name.split(' ').filter(Boolean);
	return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
}

/** The first entry is always the owner; everyone after that can edit. */
export function buildPeople(count) {
	return Array.from({ length: count }, (_, i) => {
		const base = PEOPLE[i % PEOPLE.length];
		const suffix = i >= PEOPLE.length ? ` ${Math.floor(i / PEOPLE.length) + 1}` : '';
		return {
			...base,
			name: base.name.includes('@') ? base.name : base.name + suffix,
			role: i === 0 ? 'Owner' : 'Can edit',
		};
	});
}

export default function ShareDialog({ count, bodyRef }) {
	const people = buildPeople(count);

	return (
		<>
			<header className="dialog__header dialog__header--share">
				<div className="dialog__title-bar">
					<h2 className="dialog__title" id="dialog-title">
						Share “PD weekly sync”
					</h2>
					<button className="icon-button" type="button" aria-label="Close">
						<CloseIcon />
					</button>
				</div>
			</header>

			{/* Stays put above the scroll area, like the header. */}
			<div className="share__invite">
				<div className="field">
					<div className="field__chips">
						<span className="chip">
							<span className="avatar avatar--24" style={{ background: '#2a645a' }}>
								AT
							</span>
							Alice Telton
							<span className="chip__remove">
								<XSmallIcon />
							</span>
						</span>
						<span className="chip">
							<span className="avatar avatar--24" style={{ background: '#2a645a' }}>
								L
							</span>
							Lisa
							<span className="chip__remove">
								<XSmallIcon />
							</span>
						</span>
					</div>
					<span className="selector selector--plain">
						Can view
						<ArrowIcon />
					</span>
				</div>
				<button className="button button--primary" type="button">
					Share
				</button>
			</div>

			<div className="dialog__body dialog__body--share" ref={bodyRef}>
				<h3 className="share__section-title">People with access</h3>
				<div className="share__people">
					{people.map((person, index) => (
						<div className="person" key={index}>
							<span className="avatar" style={{ background: person.color }}>
								{initials(person.name)}
							</span>
							<span className="person__name">{person.name}</span>
							<span className="selector selector--plain">
								{person.role}
								{person.role !== 'Owner' && <ArrowIcon />}
							</span>
						</div>
					))}
				</div>
			</div>

			{/* Pinned: the quick-share block never gets pushed below the fold. */}
			<footer className="dialog__footer dialog__footer--share">
				<h3 className="share__section-title">Quick share</h3>
				<div className="quick-share">
					<span className="quick-share__icon">
						<LockIcon />
					</span>
					<span className="quick-share__text">
						<span className="selector selector--plain selector--inline">
							Restricted
							<ArrowIcon />
						</span>
						<span className="quick-share__description">
							Only people with access can open with link
						</span>
					</span>
					<span className="selector selector--plain">
						Can view
						<ChevronDownIcon />
					</span>
				</div>
				<button className="button button--tertiary" type="button">
					Copy link
				</button>
			</footer>
		</>
	);
}
