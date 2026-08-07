import {
	BookmarkIcon,
	ChevronDownIcon,
	GearIcon,
	MoreIcon,
	SearchIcon,
	SlidersIcon,
	SparkleIcon,
} from '../icons.jsx';

/* Static backdrop for the Share dialog — the CrOS Library summary screen
   (Figma node 20740:3326). Nothing here is interactive on purpose. */

const NAV = ['Home', 'Ask AI', 'Meetings', 'Templates', 'Trash'];

const MEETING_GROUPS = [
	{
		label: 'Today',
		items: [
			{ title: 'PD weekly sync', time: '14:00-14:45', active: true },
			{ title: 'Product Design Alignment Meeting', time: '13:00-13:45' },
		],
	},
	{
		label: 'Yesterday',
		items: [
			{ title: 'Vibe OS Product Standup', time: '13:00-13:45' },
			{ title: 'Design-Dev Collaboration Sync', time: '13:00-13:45' },
			{ title: 'AI Web Roadmap Discussion', time: '13:00-13:45' },
		],
	},
	{
		label: 'January 14',
		items: [
			{ title: 'Vibe AI Daily', time: '13:00-13:45' },
			{ title: 'AI Features Planning', time: '13:00-13:45' },
			{ title: 'Vibe AI Design review', time: '13:00-13:45' },
		],
	},
];

const SECTIONS = [
	{
		heading: 'Lead quality',
		lines: [
			'Fewer but better-qualified leads — pre-vetted, higher-intent clients.',
			'Roughly 30% fewer inbound documents by removing the PII collection step and deferring it to onboarding.',
			'Conversion held steady at 12% of total traffic (lead submitted subset); traffic quality improved week over week.',
		],
	},
	{
		heading: 'Scope',
		lines: [
			'Ship the trimmed intake phase within the current time constraints, while flagging that it is not the long-term solution.',
			'Escalate the remaining privacy concerns to senior leadership (“the top”) before we widen the rollout.',
			'Land the copy revisions as soon as possible — either tomorrow or Thursday — after the P1 bugs before release.',
		],
	},
];

const ACTION_ITEMS = [
	'Schedule full end-to-end testing — Owner: Jason — Deadline: by Friday (aim for tomorrow or Thursday) — Priority: High',
	'Send quick note in Slack to solicit participants and identify required teams — Owner: Jason',
	'Draft the revised intake copy and circulate for review — Owner: Alice',
];

export default function AppBackground() {
	return (
		<div className="app" aria-hidden="true">
			<div className="app__topbar">
				<span className="app__brand">
					<SparkleIcon /> Vibe AI
				</span>
				<span className="app__topbar-actions">
					<GearIcon />
					<span className="avatar avatar--24" style={{ background: '#8b5e3c' }} />
				</span>
			</div>

			<div className="app__main">
				<nav className="app__nav">
					<div className="app__workspace">
						<span className="app__workspace-mark" />
						Vibe Inc
						<ChevronDownIcon />
					</div>
					{NAV.map((item) => (
						<div
							className={`app__nav-item${item === 'Meetings' ? ' app__nav-item--active' : ''}`}
							key={item}
						>
							<span className="app__nav-dot" />
							{item}
						</div>
					))}
				</nav>

				<aside className="app__list">
					<div className="app__search">
						<span className="app__search-field">
							<SearchIcon />
							Find...
						</span>
						<span className="app__search-filter">
							<SlidersIcon />
						</span>
					</div>
					{MEETING_GROUPS.map((group) => (
						<div className="app__group" key={group.label}>
							<div className="app__group-label">{group.label}</div>
							{group.items.map((item) => (
								<div
									className={`app__meeting${item.active ? ' app__meeting--active' : ''}`}
									key={item.title}
								>
									<div className="app__meeting-title">{item.title}</div>
									<div className="app__meeting-time">{item.time}</div>
								</div>
							))}
						</div>
					))}
				</aside>

				<main className="app__content">
					<div className="app__content-head">
						<h1 className="app__title">
							PD weekly sync <BookmarkIcon />
						</h1>
						<span className="app__head-actions">
							<MoreIcon />
							<span className="app__share-button">Share</span>
						</span>
					</div>

					<div className="app__meta">
						<span className="app__chip">Dec 27, 2025</span>
						<span className="app__chip">Dec 20, 2025</span>
						<span className="app__chip">Dec</span>
						<span className="app__chip">Timeline</span>
					</div>
					<div className="app__meta app__meta--muted">
						<span>Room</span>
						<span className="avatar avatar--24" style={{ background: '#2a645a' }} />
						<span className="app__meta-spacer" />
						<span>Copy</span>
						<span>
							Template: <b>General alignment</b>
						</span>
					</div>

					<div className="app__doc">
						{SECTIONS.map((section) => (
							<section className="app__section" key={section.heading}>
								<h2 className="app__section-heading">{section.heading}</h2>
								{section.lines.map((line) => (
									<p className="app__line" key={line}>
										{line}
									</p>
								))}
							</section>
						))}

						<section className="app__section">
							<h2 className="app__section-heading">Action Items</h2>
							{ACTION_ITEMS.map((item) => (
								<p className="app__line app__line--todo" key={item}>
									<span className="app__todo-box" />
									{item}
								</p>
							))}
						</section>
					</div>

					<span className="app__ask-ai">
						<SparkleIcon /> Ask AI
					</span>
				</main>
			</div>
		</div>
	);
}
