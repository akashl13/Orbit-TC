import { ArrowLeft, BriefcaseBusiness } from 'lucide-react';
import AiCvPro from '../components/AiCvPro';
export default function CreateCvPage(){return <main className="cv-page"><header className="jobs-nav"><a href="/" className="brand"><span className="brand-mark"><BriefcaseBusiness size={18}/></span>orbit</a><nav><a href="/jobs">Find jobs</a><a href="/">Dashboard</a></nav><a href="/" className="jobs-signin"><ArrowLeft size={15}/>Back</a></header><AiCvPro/></main>}
