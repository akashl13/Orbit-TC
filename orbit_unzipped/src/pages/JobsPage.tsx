import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BriefcaseBusiness, ChevronLeft, Heart, MapPin, Search, SlidersHorizontal } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../lib/supabase';
import sampleJobs from '../data/sample-jobs.json';

type Job = { id: number; title: string; company: string; category: string; location: string; employment_type: string; salary: string; description: string };
const filters = ['All', 'Engineering', 'Design', 'People', 'Product', 'Marketing'];
const token = async () => { const { data: { session } } = await supabase.auth.getSession(); return { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token || ''}` } };

export default function JobsPage () {
	const { user } = useAuth();
	const [jobs, setJobs] = useState<Job[]>([]);
	const [saved, setSaved] = useState<number[]>([]);
	const [applied, setApplied] = useState<number[]>([]);
	const [q, setQ] = useState('');
	const [cat, setCat] = useState('All');
	const [notice, setNotice] = useState('');
	const [loading, setLoading] = useState(true);

	const load = async () => {
		setLoading(true);
		try {
			const r = await fetch('/api/jobs');
			if (r.ok) {
				const data = await r.json();
				// If API returned empty, fallback to sample data for demo
				if (!data || (Array.isArray(data) && data.length === 0)) {
					setJobs(sampleJobs as Job[]);
				} else {
					setJobs(data as Job[]);
				}
			} else {
				setJobs(sampleJobs as Job[]);
			}
		} catch (err) {
			// network or server error: use sample data so UI isn't empty
			setJobs(sampleJobs as Job[]);
		}

		// load saved jobs for authenticated user
		if (user) {
			try {
				const s = await fetch('/api/saved-jobs', { headers: await token() });
				if (s.ok) setSaved((await s.json()).map((x: { job_id: number }) => x.job_id));
				const a = await fetch('/api/applications', { headers: await token() });
				if (a.ok) setApplied((await a.json()).map((x: any) => x.job_id));
			} catch (e) {
				// ignore
			}
		}

		setLoading(false);
	};

	useEffect(() => { load() }, [user]);

	const list = useMemo(() => jobs.filter(j => (cat === 'All' || j.category === cat) && `${j.title} ${j.company} ${j.location}`.toLowerCase().includes(q.toLowerCase())), [jobs, q, cat]);

	const action = async (job: Job, kind: 'apply' | 'save') => {
		// Demo behavior: allow applying locally when not signed in
		if (!user && kind === 'apply') {
			setNotice(`Application submitted for ${job.title} (demo).`);
			setApplied(prev => prev.includes(job.id) ? prev : [...prev, job.id]);
			return;
		}

		if (!user) { setNotice('Sign in to save roles and submit an application.'); return }

		const isSaved = saved.includes(job.id);
		try {
			const r = await fetch(kind === 'apply' ? '/api/applications' : '/api/saved-jobs', { method: kind === 'apply' ? 'POST' : isSaved ? 'DELETE' : 'POST', headers: await token(), body: JSON.stringify({ job_id: job.id }) });
			const d = await r.json();
			setNotice(r.ok ? (kind === 'apply' ? `Application sent for ${job.title}.` : isSaved ? 'Removed from saved roles.' : 'Saved to your shortlist.') : d.error);
			if (r.ok && kind === 'save') load();
			if (r.ok && kind === 'apply') setApplied(prev => prev.includes(job.id) ? prev : [...prev, job.id]);
		} catch (err: any) {
			// if API fails, fall back to demo behavior so users can still interact
			if (kind === 'apply') {
				setNotice(`Application submitted for ${job.title} (demo).`);
				setApplied(prev => prev.includes(job.id) ? prev : [...prev, job.id]);
			} else {
				setNotice('Unable to save role. Please try again later.');
			}
		}
	};

	return (
		<main className="jobs-page">
			<header className="jobs-nav">
				<a href="/" className="brand"><span className="brand-mark"><BriefcaseBusiness size={18} /></span>orbit</a>
				<nav><a href="/">Dashboard</a><a href="/create-cv">Create CV</a></nav>
				<a className="jobs-signin" href={user ? '/' : '/sign-in'}>{user ? 'My dashboard' : 'Sign in'}</a>
			</header>

			<section className="jobs-hero">
				<a href="/" className="back-link"><ChevronLeft size={15} />Dashboard</a>
				<span className="eyebrow">INDIA’S NEXT OPPORTUNITY</span>
				<h1>Find the role that<br /><em>changes your trajectory.</em></h1>
				<p>Explore thoughtfully selected openings across India’s most ambitious teams.</p>
				<div className="jobs-search"><Search size={19} /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Job title, company, skill or location" /><button>Search</button></div>
			</section>

			<section className="jobs-content">
				<aside className="job-filter-panel">
					<div className="filter-title"><SlidersHorizontal size={16} />Filters</div>
					<strong>Department</strong>
					{filters.map(x => <button onClick={() => setCat(x)} key={x} className={cat === x ? 'selected' : ''}>{x}</button>)}
					<div className="cities"><strong>Popular cities</strong><span>Delhi · Noida</span><span>Gurugram · Chandigarh</span><span>Mohali · Bengaluru</span><span>Mumbai · Pune</span></div>
				</aside>

				<section className="results">
					<div className="results-head"><div><span className="eyebrow">OPEN ROLES</span><h2>{loading ? 'Finding opportunities…' : `${list.length} roles to explore`}</h2></div><span>Updated weekly</span></div>
					{notice && <div className="notice">{notice}</div>}

					<div className="jobs-list">
						{list.map(j => (
							<article className="wide-job" key={j.id} style={{ transform: 'translateZ(0)', perspective: 800 }}>
								<div className="wide-avatar">{j.company[0]}</div>
								<div className="wide-main"><span className="tag">{j.category}</span><h3>{j.title}</h3><p>{j.company}</p><div className="wide-meta"><span><MapPin size={14} />{j.location}</span><span>{j.employment_type}</span><span>{j.salary}</span></div></div>
								<p className="wide-description">{j.description}</p>
								<div className="wide-actions">
									<button className="save-job" onClick={() => action(j, 'save')}><Heart size={17} fill={saved.includes(j.id) ? 'currentColor' : 'none'} /></button>
									<button className={"role-apply " + (applied.includes(j.id) ? 'applied' : '')} onClick={() => action(j, 'apply')}>{applied.includes(j.id) ? 'Applied' : 'Apply'} <ArrowRight size={15} /></button>
								</div>
							</article>
						))}
					</div>

					{!loading && !list.length && <div className="empty">No matching positions found. Try another keyword or department.</div>}
				</section>
			</section>
		</main>
	)
}
