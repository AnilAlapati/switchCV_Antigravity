import { cn } from "@/lib/utils";
import { Mail, MapPin, Phone, Linkedin, Github } from "lucide-react";

interface ResumeData {
    fullName: string;
    role: string;
    summary: string;
    experience: {
        company: string;
        role: string;
        duration: string;
        description: string[];
    }[];
    skills: string[];
    education: {
        school: string;
        degree: string;
        year: string;
    }[];
    contact?: {
        email?: string;
        phone?: string;
        location?: string;
        linkedin?: string;
        github?: string;
    };
}

export default function ResumeView({ data }: { data: ResumeData }) {
    return (
        <div className="max-w-4xl mx-auto bg-white text-black shadow-2xl rounded-lg overflow-hidden print:shadow-none print:rounded-none">
            {/* Header */}
            <div className="bg-slate-900 text-white p-8 md:p-12">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">{data.fullName}</h1>
                <p className="text-xl md:text-2xl text-slate-300 font-light">{data.role}</p>

                <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-400">
                    {data.contact?.email && (
                        <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            <span>{data.contact.email}</span>
                        </div>
                    )}
                    {data.contact?.location && (
                        <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{data.contact.location}</span>
                        </div>
                    )}
                    {data.contact?.phone && (
                        <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            <span>{data.contact.phone}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-8 md:p-12 grid md:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-8">
                    {/* Summary */}
                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-wider text-slate-800 border-b-2 border-slate-200 pb-2 mb-4">
                            Professional Summary
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            {data.summary}
                        </p>
                    </section>

                    {/* Experience */}
                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-wider text-slate-800 border-b-2 border-slate-200 pb-2 mb-4">
                            Experience
                        </h2>
                        <div className="space-y-6">
                            {data.experience.map((exp, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-lg text-slate-800">{exp.role}</h3>
                                        <span className="text-sm text-slate-500 font-medium">{exp.duration}</span>
                                    </div>
                                    <div className="text-slate-600 font-medium mb-2">{exp.company}</div>
                                    <ul className="list-disc list-outside ml-4 space-y-1 text-slate-600">
                                        {exp.description.map((desc, j) => (
                                            <li key={j}>{desc}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Skills */}
                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-wider text-slate-800 border-b-2 border-slate-200 pb-2 mb-4">
                            Skills
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map((skill, i) => (
                                <span key={i} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* Education */}
                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-wider text-slate-800 border-b-2 border-slate-200 pb-2 mb-4">
                            Education
                        </h2>
                        <div className="space-y-4">
                            {data.education.map((edu, i) => (
                                <div key={i}>
                                    <h3 className="font-bold text-slate-800">{edu.school}</h3>
                                    <div className="text-slate-600">{edu.degree}</div>
                                    <div className="text-sm text-slate-500">{edu.year}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
