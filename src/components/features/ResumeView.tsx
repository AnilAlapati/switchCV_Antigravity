"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Linkedin, Github } from "lucide-react";

export interface ResumeData {
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
    if (!data) return <div>No resume data found.</div>;

    return (
        <div className="bg-white text-gray-900 min-h-[1100px] w-full max-w-[850px] mx-auto shadow-2xl p-12 md:p-16 print:shadow-none print:p-0 print:max-w-full">
            {/* Header */}
            <header className="border-b-2 border-gray-900 pb-8 mb-8">
                <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-gray-900 mb-2">
                    {data.fullName}
                </h1>
                <p className="text-xl text-gray-600 font-medium">{data.role}</p>

                {/* Contact Info (Optional) */}
                {data.contact && (
                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                        {data.contact.email && <div className="flex items-center gap-1"><Mail className="w-3 h-3" /> {data.contact.email}</div>}
                        {data.contact.phone && <div className="flex items-center gap-1"><Phone className="w-3 h-3" /> {data.contact.phone}</div>}
                        {data.contact.location && <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {data.contact.location}</div>}
                    </div>
                )}
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="md:col-span-2 space-y-8">
                    {/* Summary */}
                    <section>
                        <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 mb-4 pb-1">
                            Professional Summary
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            {data.summary}
                        </p>
                    </section>

                    {/* Experience */}
                    <section>
                        <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 mb-4 pb-1">
                            Work Experience
                        </h2>
                        <div className="space-y-6">
                            {data.experience?.map((exp, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-gray-800">{exp.role}</h3>
                                        <span className="text-sm text-gray-500 font-medium">{exp.duration}</span>
                                    </div>
                                    <div className="text-gray-700 font-medium mb-2">{exp.company}</div>
                                    <ul className="list-disc list-outside ml-4 space-y-1 text-gray-600 text-sm">
                                        {exp.description?.map((desc, i) => (
                                            <li key={i}>{desc}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    {/* Skills */}
                    <section>
                        <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 mb-4 pb-1">
                            Skills
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {data.skills?.map((skill, index) => (
                                <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* Education */}
                    <section>
                        <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 mb-4 pb-1">
                            Education
                        </h2>
                        <div className="space-y-4">
                            {data.education?.map((edu, index) => (
                                <div key={index}>
                                    <div className="font-bold text-gray-800">{edu.school}</div>
                                    <div className="text-sm text-gray-600">{edu.degree}</div>
                                    <div className="text-xs text-gray-500">{edu.year}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
