"use client";

import { cn } from "@/lib/utils";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import {
    ClipboardCheck,
    User,
    Mail,
    Phone,
    GraduationCap,
    Send,
    CheckCircle2,
    School,
    UploadCloud,
    MapPin,
    MessageSquare,
    Copy,
    Check,
    ArrowRight,
    Shield,
    Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { PremiumInput } from "@/components/ui/PremiumInput";
import { PremiumSelect } from "@/components/ui/PremiumSelect";
import { PremiumTextarea } from "@/components/ui/PremiumTextarea";
import { PremiumGradePicker } from "@/components/ui/PremiumGradePicker";
import { PremiumDatePicker } from "@/components/ui/PremiumDatePicker";

function FileUpload({ label, onUpload }: { label: string, onUpload: (f: File) => void }) {
    return (
        <div className="space-y-2">
            <div className="h-4">
                <label className="text-[13px] text-navy/40 uppercase tracking-[0.3em] font-black ml-4">
                    {label}
                </label>
            </div>
            <label className="flex flex-col items-center justify-center w-full h-[140px] border-2 border-dashed border-navy/5 rounded-[2.5rem] hover:border-gold/40 hover:bg-gold/5 transition-all cursor-pointer group backdrop-blur-md bg-white/50 relative overflow-hidden shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex flex-col items-center justify-center pt-5 pb-6 relative z-10">
                    <div className="p-4 bg-navy/5 rounded-2xl mb-4 group-hover:bg-gold/10 group-hover:text-gold transition-all duration-500 group-hover:scale-110 shadow-sm">
                        <UploadCloud className="w-7 h-7" />
                    </div>
                    <p className="mb-2 text-[15px] text-navy/40 tracking-[0.2em] uppercase font-black"><span className="text-navy">CLICK TO UPLOAD</span> OR DRAG AND DROP</p>
                    <p className="text-[12px] text-navy/20 uppercase tracking-[0.3em] font-black">SVG, PNG, JPG or PDF (MAX 10MB)</p>
                </div>
                <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
            </label>
        </div>
    );
}

export default function SchoolRegisterPage() {
    const params = useParams();
    const schoolSlug = params.school as string;

    const [school, setSchool] = useState<any>(null);
    const [loadingSchool, setLoadingSchool] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [allClasses, setAllClasses] = useState<any[]>([]); // All classes for computing available grades
    const [filteredClasses, setFilteredClasses] = useState<any[]>([]); // Classes filtered by grade

    // Form State
    const [submitted, setSubmitted] = useState(false);
    const [trackingCode, setTrackingCode] = useState("");

    const [formData, setFormData] = useState({
        studentName: "",
        middleName: "",
        studentGrade: "",
        dateOfBirth: "",
        gender: "",
        address: "",
        previousSchool: "",
        medicalInfo: "",
        parentName: "",
        parentEmail: "",
        parentPhone: "",
        familyPhone: "",
        locationLink: "",
        classId: "",
        priorityFlags: [] as string[],
        notes: "",
        documents: [] as { name: string, url: string, type: string }[]
    });

    const handleFileUpload = async (file: File, type: string) => {
        const data = new FormData();
        data.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: data
            });
            const result = await res.json();
            if (result.success) {
                setFormData(prev => ({
                    ...prev,
                    documents: [...prev.documents, { name: result.name, url: result.url, type }]
                }));
            }
        } catch (e) {
            console.error(e);
            alert("Upload failed");
        }
    };

    useEffect(() => {
        // Verify School Validity
        fetch(`/api/schools/${schoolSlug}`)
            .then(res => {
                if (!res.ok) throw new Error("School not found");
                return res.json();
            })
            .then(data => setSchool(data))
            .catch(() => setSchool(null))
            .finally(() => setLoadingSchool(false));

        // Fetch all available classes
        fetch(`/api/${schoolSlug}/classes`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setAllClasses(data);
                    setFilteredClasses(data); // Initially show all
                }
            })
            .catch(() => {
                setAllClasses([]);
                setFilteredClasses([]);
            });
    }, [schoolSlug]);

    // Filter classes when grade changes
    useEffect(() => {
        if (formData.studentGrade) {
            const filtered = allClasses.filter(c => c.grade === formData.studentGrade);
            setFilteredClasses(filtered);
            // Reset class selection if current class doesn't match new grade
            if (formData.classId) {
                const currentClass = allClasses.find(c => c.id === formData.classId);
                if (currentClass && currentClass.grade !== formData.studentGrade) {
                    setFormData(prev => ({ ...prev, classId: "" }));
                }
            }
        } else {
            setFilteredClasses(allClasses);
        }
    }, [formData.studentGrade, allClasses]);

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const togglePriority = (flag: string) => {
        setFormData(prev => ({
            ...prev,
            priorityFlags: prev.priorityFlags.includes(flag)
                ? prev.priorityFlags.filter(f => f !== flag)
                : [...prev.priorityFlags, flag]
        }));
    };

    const handleSubmit = async () => {
        setLoadingSubmit(true);
        try {
            const res = await fetch("/api/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, schoolSlug }),
            });

            const result = await res.json();
            if (result.success) {
                setSubmitted(true);
                setTrackingCode(result.trackingCode);
            } else {
                console.error("Submission failed:", result);
                let errorMessage = result.error || "Unknown error";
                if (result.details) {
                    // Format Zod errors for display
                    const fieldErrors = Object.entries(result.details.fieldErrors || {})
                        .map(([field, errors]) => `${field}: ${(errors as any[]).join(", ")}`)
                        .join("\n");
                    if (fieldErrors) errorMessage += `\n${fieldErrors}`;
                }
                alert("Submission failed:\n" + errorMessage);
            }
        } catch (err) {
            alert("An error occurred during submission.");
        } finally {
            setLoadingSubmit(false);
        }
    };

    if (loadingSchool) return <div className="min-h-screen flex items-center justify-center text-emerald-600 font-orbitron font-bold tracking-widest animate-pulse">VERIFYING INSTITUTIONAL NODE...</div>;

    if (!school) return (
        <div className="min-h-screen flex flex-col items-center justify-center space-y-8 px-6 text-center bg-white">
            <div className="w-20 h-20 rounded-3xl bg-navy/5 border border-navy/10 flex items-center justify-center text-navy/20">
                <School size={40} />
            </div>
            <div className="space-y-2">
                <h1 className="text-3xl text-navy font-orbitron font-bold uppercase tracking-tighter">Invalid Node</h1>
                <p className="text-navy/40 font-rajdhani text-lg">The secure registration link you accessed is invalid or has expired.</p>
            </div>
        </div>
    );

    if (submitted) {
        return (
            <SuccessPage
                schoolName={school.name}
                trackingCode={trackingCode}
                onRegisterAnother={() => window.location.reload()}
            />
        );
    }

    return (
        <div className="min-h-screen bg-white text-navy selection:bg-emerald-500/30 relative overflow-hidden font-rajdhani">
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 md:px-6 py-12 md:py-20">
                <div className="max-w-4xl w-full space-y-12">
                    {/* Header */}
                    <div className="text-center space-y-8">
                        <div className="flex items-center justify-center gap-6 mb-10 translate-y-0 hover:-translate-y-1 transition-transform duration-500 cursor-default">
                            <div className="relative w-20 h-20 rounded-[2.5rem] bg-white border border-navy/10 flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.05)] group">
                                <div className="absolute inset-0 bg-emerald-500/5 rounded-[2.5rem] animate-pulse" />
                                <School size={32} className="text-emerald-600 relative z-10 group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="text-left">
                                <p className="text-[18px] uppercase tracking-[0.4em] text-navy/40 font-black">{school.name}</p>
                                <div className="flex items-center gap-3 mt-2">
                                    <div className="relative">
                                        <span className="block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-75" />
                                        <span className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                                    </div>
                                    <span className="text-[15px] text-gold uppercase tracking-[0.5em] font-black">ENROLLMENT PORTAL v5.0</span>
                                </div>
                            </div>
                        </div>
                        <h1 className="text-8xl md:text-[12rem] font-orbitron font-medium tracking-tighter text-navy leading-none uppercase">
                            Identity <br /><span className="text-emerald-600/20">Registry</span>
                        </h1>
                        <p className="text-navy/40 text-xl md:text-2xl uppercase tracking-[0.2em] font-bold max-w-2xl mx-auto leading-relaxed">
                            Initialize your secure academic record within the <span className="text-navy">centralized vision network</span>.
                        </p>
                    </div>

                    <GlassCard className="p-8 md:p-14 bg-white/70 border-navy/5 shadow-2xl shadow-navy/5 backdrop-blur-lg relative overflow-hidden">
                        {/* Top edge accent */}
                        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

                        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-16 relative z-10">
                            {/* Student Identity */}
                            <div className="space-y-10">
                                <div className="flex items-center gap-4 border-b border-navy/5 pb-5">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center">
                                        <GraduationCap size={20} className="text-emerald-600" />
                                    </div>
                                    <h3 className="text-[18px] text-navy font-orbitron font-bold uppercase tracking-widest">Student Core Information</h3>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <PremiumInput
                                        required
                                        label="Full Legal Name"
                                        icon={<User size={18} />}
                                        value={formData.studentName}
                                        onChange={(e) => updateField("studentName", e.target.value)}
                                        placeholder="EX: JOHN QUINCY DOE"
                                    />

                                    <PremiumInput
                                        label="Middle Name"
                                        icon={<User size={18} />}
                                        value={formData.middleName}
                                        onChange={(e) => updateField("middleName", e.target.value)}
                                        placeholder="OPTIONAL"
                                    />
                                </div>

                                <PremiumGradePicker
                                    label="Target Grade Level"
                                    grades={school?.grades?.length > 0 ? school.grades : Array.from(new Set(allClasses.map(c => c.grade))).sort().map(g => ({ id: g, level: g }))}
                                    selectedGrade={formData.studentGrade}
                                    onSelect={(level) => updateField("studentGrade", level)}
                                />

                                <div className="space-y-4">
                                    <label className="text-[13px] text-navy/40 uppercase tracking-[0.3em] font-black ml-4">Admission Status</label>
                                    <div className="h-[72px]">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const hasTransfer = formData.priorityFlags.includes("Transfer");
                                                updateField("priorityFlags", hasTransfer ? [] : ["Transfer"]);
                                            }}
                                            className={cn(
                                                "w-full h-full rounded-2xl border transition-all duration-500 text-[16px] font-bold uppercase tracking-[0.3em] font-orbitron",
                                                formData.priorityFlags.includes("Transfer")
                                                    ? "bg-emerald-500/5 border-emerald-500/40 text-emerald-600 shadow-[0_10px_30px_rgba(16,185,129,0.1)] scale-[1.02]"
                                                    : "bg-white/40 border-navy/5 text-navy/40 hover:bg-white/60 hover:border-navy/10"
                                            )}
                                        >
                                            Transfer Student Protocol
                                        </button>
                                    </div>
                                </div>

                                {formData.priorityFlags.includes("Transfer") && (
                                    <PremiumInput
                                        required
                                        label="Where were they before?"
                                        icon={<School size={18} />}
                                        value={formData.previousSchool}
                                        onChange={(e) => updateField("previousSchool", e.target.value)}
                                        placeholder="PREVIOUS SCHOOL NAME"
                                    />
                                )}

                                <PremiumTextarea
                                    label="Any comments or things we should know?"
                                    icon={<MessageSquare size={18} />}
                                    value={formData.notes}
                                    onChange={(e) => updateField("notes", e.target.value)}
                                    placeholder="TELL US WHY YOU ARE APPLYING OR ANY SPECIAL REQUESTS"
                                />

                                <div className="grid md:grid-cols-2 gap-8">
                                    <PremiumDatePicker
                                        required
                                        label="Birth Registry Date"
                                        value={formData.dateOfBirth}
                                        onChange={(val) => updateField("dateOfBirth", val)}
                                    />
                                    <div className="space-y-2">
                                        <label className="text-[13px] text-navy/40 uppercase tracking-[0.3em] font-black ml-4">Gender Classification</label>
                                        <div className="grid grid-cols-2 gap-4 h-[72px]">
                                            {["Male", "Female"].map((g) => (
                                                <button
                                                    type="button"
                                                    key={g}
                                                    onClick={() => updateField("gender", g.toLowerCase())}
                                                    className={cn(
                                                        "h-full rounded-2xl border transition-all duration-500 text-[16px] font-bold uppercase tracking-[0.3em] font-orbitron",
                                                        formData.gender === g.toLowerCase()
                                                            ? "bg-gold/5 border-gold/40 text-gold shadow-[0_10px_30px_rgba(197,160,40,0.1)] scale-[1.02]"
                                                            : "bg-white/40 border-navy/5 text-navy/40 hover:bg-white/60 hover:border-navy/10"
                                                    )}
                                                >
                                                    {g}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <PremiumTextarea
                                    label="Medical / Health Protocol"
                                    icon={<MessageSquare size={18} />}
                                    value={formData.medicalInfo}
                                    onChange={(e) => updateField("medicalInfo", e.target.value)}
                                    placeholder="LIST ALLERGIES, CHRONIC CONDITIONS, OR SPECIAL REQUIREMENTS..."
                                />

                                {formData.studentGrade && filteredClasses.length > 0 && (
                                    <PremiumSelect
                                        label="Section Allocation (Optional)"
                                        value={formData.classId}
                                        onChange={(e) => updateField("classId", e.target.value)}
                                    >
                                        <option value="" className="bg-white text-navy/40">Select a section</option>
                                        {filteredClasses.map((cls: any) => (
                                            <option key={cls.id} value={cls.id} className="bg-white text-navy font-bold uppercase tracking-[0.1em]">
                                                {cls.name}
                                                {cls.capacity && ` [${cls._count.applications}/${cls.capacity} NODES FILLED]`}
                                            </option>
                                        ))}
                                    </PremiumSelect>
                                )}
                            </div>

                            {/* Contact Node */}
                            <div className="space-y-10">
                                <div className="flex items-center gap-4 border-b border-navy/5 pb-5">
                                    <div className="w-10 h-10 rounded-xl bg-gold/5 border border-gold/10 flex items-center justify-center">
                                        <Phone size={20} className="text-gold" />
                                    </div>
                                    <h3 className="text-[18px] text-navy font-orbitron font-bold uppercase tracking-widest">Guardian Contact Node</h3>
                                </div>

                                <div className="space-y-8">
                                    <PremiumInput
                                        required
                                        label="Primary Guardian Name"
                                        icon={<User size={18} />}
                                        value={formData.parentName}
                                        onChange={(e) => updateField("parentName", e.target.value)}
                                        placeholder="LEGAL GUARDIAN NAME"
                                    />

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <PremiumInput
                                            required
                                            label="Digital Contact (Email)"
                                            type="email"
                                            icon={<Mail size={18} />}
                                            value={formData.parentEmail}
                                            onChange={(e) => updateField("parentEmail", e.target.value)}
                                            placeholder="IDENTITY@DOMAIN.COM"
                                        />
                                        <PremiumInput
                                            label="Mobile Protocol (Phone)"
                                            type="tel"
                                            icon={<Phone size={18} />}
                                            value={formData.parentPhone}
                                            onChange={(e) => updateField("parentPhone", e.target.value)}
                                            placeholder="+251 ..."
                                        />
                                        <PremiumInput
                                            label="Family Number"
                                            type="tel"
                                            icon={<Phone size={18} />}
                                            value={formData.familyPhone}
                                            onChange={(e) => updateField("familyPhone", e.target.value)}
                                            placeholder="SECONDARY CONTACT"
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <PremiumTextarea
                                            required
                                            label="Residential Registry (Address)"
                                            value={formData.address}
                                            onChange={(e) => updateField("address", e.target.value)}
                                            placeholder="TYPE FULL RESIDENTIAL ADDRESS..."
                                        />
                                        <PremiumInput
                                            label="Spatial Coordinates (GPS/Link)"
                                            icon={<MapPin size={18} />}
                                            value={formData.locationLink}
                                            onChange={(e) => updateField("locationLink", e.target.value)}
                                            placeholder="PASTE MAP LINK OR COORDINATES"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Digital Assets */}
                            <div className="space-y-10">
                                <div className="flex items-center gap-4 border-b border-navy/5 pb-5">
                                    <div className="w-10 h-10 rounded-xl bg-navy/5 border border-navy/10 flex items-center justify-center">
                                        <UploadCloud size={20} className="text-navy" />
                                    </div>
                                    <h3 className="text-[18px] text-navy font-orbitron font-bold uppercase tracking-widest">Digital Asset Verification</h3>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <FileUpload
                                        label="Birth Certificate (Required)"
                                        onUpload={(file) => handleFileUpload(file, 'Birth Certificate')}
                                    />
                                    <FileUpload
                                        label="Previous Report Card (Optional)"
                                        onUpload={(file) => handleFileUpload(file, 'Report Card')}
                                    />
                                </div>

                                {formData.documents.length > 0 && (
                                    <div className="space-y-5">
                                        <p className="text-[14px] text-navy/40 uppercase tracking-[0.4em] font-black ml-2">Verified Documents</p>
                                        <div className="grid gap-4">
                                            {formData.documents.map((doc, i) => (
                                                <div key={i} className="flex items-center justify-between p-5 bg-white/50 border border-navy/5 rounded-3xl group hover:border-emerald-500/30 transition-all duration-500 shadow-sm">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/5 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                                                            <ClipboardCheck size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[18px] font-bold text-navy">{doc.name}</p>
                                                            <p className="text-[13px] text-navy/40 uppercase tracking-[0.2em] font-black">{doc.type}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-[13px] text-emerald-600 bg-emerald-500/10 px-6 py-2.5 rounded-full uppercase tracking-[0.2em] font-black border border-emerald-500/20">Verified</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Finalization */}
                            <div className="space-y-8 pt-8">
                                <div className="flex items-start gap-4 p-6 bg-gold/[0.03] rounded-3xl border border-gold/20 shadow-[0_10px_30px_rgba(197,160,40,0.05)]">
                                    <div className="w-6 h-6 rounded-lg border-2 border-gold/30 flex-shrink-0 flex items-center justify-center bg-gold/5 mt-0.5">
                                        <CheckCircle2 size={14} className="text-gold" />
                                    </div>
                                    <p className="text-[17px] text-navy/60 uppercase tracking-widest leading-relaxed font-bold">
                                        I hereby certify that all provided information is accurate and matches the legal registry of the applicant.
                                    </p>
                                </div>

                                <button
                                    disabled={loadingSubmit}
                                    className="group relative w-full py-7 bg-navy hover:bg-navy/95 text-white rounded-[2.5rem] transition-all flex items-center justify-center gap-5 font-bold shadow-[0_20px_40px_rgba(0,26,61,0.2)] hover:shadow-[0_25px_50px_rgba(0,26,61,0.3)] active:scale-[0.98] disabled:opacity-50 overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center gap-5 text-[18px] font-orbitron uppercase tracking-[0.3em]">
                                        {loadingSubmit ? (
                                            <>
                                                <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                                                Processing Registry...
                                            </>
                                        ) : (
                                            <>
                                                Submit Identity Registry
                                                <Send size={18} className="group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform duration-500" />
                                            </>
                                        )}
                                    </span>
                                    <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                </button>
                            </div>
                        </form>
                    </GlassCard>

                    <div className="flex flex-col items-center gap-4 opacity-30">
                        <div className="w-1 h-12 bg-gradient-to-b from-navy to-transparent" />
                        <p className="text-[14px] text-center text-navy font-bold uppercase tracking-[0.6em]">
                            Clae Systems // Secure Registry Protocol v5.0
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

const SuccessPage = ({ schoolName, trackingCode, onRegisterAnother }: { schoolName: string; trackingCode: string; onRegisterAnother: () => void }) => {
    const [copied, setCopied] = useState(false);

    const copyCode = async () => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(trackingCode);
            } else {
                const ta = document.createElement("textarea");
                ta.value = trackingCode;
                ta.style.position = "fixed";
                ta.style.left = "-9999px";
                document.body.appendChild(ta);
                ta.focus();
                ta.select();
                document.execCommand("copy");
                ta.remove();
            }
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch (err) {
            console.error("Copy failed", err);
        }
    };

    const stagger = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.1 }
        }
    };

    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } }
    };

    return (
        <div className="min-h-screen bg-white text-navy selection:bg-emerald-500/30 relative overflow-hidden font-rajdhani">
            {/* Decorative ambient glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/[0.04] rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gold/[0.03] rounded-full blur-[60px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 py-12">
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="show"
                    className="max-w-lg w-full space-y-10"
                >
                    {/* Success Icon */}
                    <motion.div variants={fadeUp} className="flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 scale-[2.5] bg-emerald-500/10 rounded-full blur-[40px] animate-pulse" />
                            <div className="relative w-24 h-24 rounded-[2rem] bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-500/30">
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
                                >
                                    <CheckCircle2 size={48} className="text-white" strokeWidth={1.5} />
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Title */}
                    <motion.div variants={fadeUp} className="text-center space-y-3">
                        <h1 className="text-5xl sm:text-6xl font-orbitron font-light text-navy tracking-tighter">
                            Registration{" "}
                            <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent font-normal">
                                Complete
                            </span>
                        </h1>
                        <div className="flex items-center justify-center gap-3">
                            <span className="w-8 h-[1px] bg-navy/10" />
                            <p className="text-navy/40 font-bold uppercase tracking-[0.4em] text-[11px]">{schoolName}</p>
                            <span className="w-8 h-[1px] bg-navy/10" />
                        </div>
                    </motion.div>

                    {/* Tracking Code Card */}
                    <motion.div variants={fadeUp}>
                        <div className="relative group">
                            <div className="absolute -inset-[1px] bg-gradient-to-br from-emerald-500/20 via-emerald-500/5 to-gold/10 rounded-[2rem] opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative bg-white rounded-[2rem] p-8 sm:p-10 border border-navy/5 space-y-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Shield size={14} className="text-emerald-500/60" />
                                        <p className="text-[10px] text-navy/30 uppercase tracking-[0.3em] font-black">Tracking Code</p>
                                    </div>
                                    <button
                                        onClick={copyCode}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95",
                                            copied
                                                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                                : "bg-navy/5 text-navy/40 hover:text-navy/70 border border-navy/5 hover:border-navy/10"
                                        )}
                                    >
                                        {copied ? <Check size={14} /> : <Copy size={14} />}
                                        {copied ? "Copied!" : "Copy"}
                                    </button>
                                </div>
                                <div className="text-center py-4">
                                    <p
                                        className="text-5xl sm:text-7xl text-emerald-600 font-orbitron font-bold select-all cursor-pointer tracking-tight"
                                        style={{ textShadow: "0 0 60px rgba(16,185,129,0.1)" }}
                                        onClick={copyCode}
                                    >
                                        {trackingCode}
                                    </p>
                                </div>
                                <p className="text-[11px] text-navy/30 text-center font-medium leading-relaxed">
                                    Use this code to track your application status at any time
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Info Tiles */}
                    <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3">
                        {[
                            { icon: <Mail size={18} />, label: "SMS Sent", sub: "Confirmation dispatched" },
                            { icon: <Shield size={18} />, label: "Secured", sub: "Application recorded" },
                            { icon: <Sparkles size={18} />, label: "In Review", sub: "Processing begins" }
                        ].map((tile, i) => (
                            <div key={i} className="p-4 sm:p-5 rounded-2xl bg-white border border-navy/5 text-center space-y-2 shadow-sm">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center mx-auto text-emerald-500/60">
                                    {tile.icon}
                                </div>
                                <p className="text-[11px] text-navy font-black uppercase tracking-wider">{tile.label}</p>
                                <p className="text-[10px] text-navy/30 font-medium leading-snug">{tile.sub}</p>
                            </div>
                        ))}
                    </motion.div>

                    {/* Actions */}
                    <motion.div variants={fadeUp} className="space-y-4">
                        <button
                            onClick={onRegisterAnother}
                            className="group w-full py-5 bg-navy hover:bg-navy/90 text-white font-bold rounded-2xl transition-all duration-300 text-[12px] uppercase tracking-[0.3em] shadow-lg shadow-navy/15 flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            <span>Register Another Student</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <p className="text-[10px] text-navy/20 text-center uppercase tracking-[0.3em] font-medium">
                            Clae Systems // Secure Registry Protocol v5.0
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};
