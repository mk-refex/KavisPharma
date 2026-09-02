import { useEffect, useState, type DragEvent, type ReactNode } from "react";
import type {
  EmploymentType,
  ExperienceLevel,
  JobOpening,
  JobStatus,
  WorkMode,
} from "@/services/api";
import {
  emptyJobOpening,
  EMPLOYMENT_TYPES,
  WORK_MODES,
  EXPERIENCE_LEVELS,
  JOB_STATUSES,
} from "@/data/careerDefaults";

const inputClass =
  "w-full px-3 py-2 text-sm border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-foreground-700 mb-1">
        {label}
      </label>
      {hint && <p className="text-[11px] text-foreground-500 mb-1">{hint}</p>}
      {children}
    </div>
  );
}

interface CareerJobsEditorProps {
  jobs: JobOpening[];
  sectionTitle: string;
  sectionDescription: string;
  emptyMessage: string;
  onSectionChange: (field: "title" | "description" | "emptyMessage", value: string) => void;
  onJobsChange: (jobs: JobOpening[]) => void;
}

export default function CareerJobsEditor({
  jobs,
  sectionTitle,
  sectionDescription,
  emptyMessage,
  onSectionChange,
  onJobsChange,
}: CareerJobsEditorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(jobs[0]?.id ?? null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [showSectionSettings, setShowSectionSettings] = useState(false);
  const [mobileShowEditor, setMobileShowEditor] = useState(false);

  useEffect(() => {
    if (jobs.length === 0) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !jobs.some((job) => job.id === selectedId)) {
      setSelectedId(jobs[0].id);
    }
  }, [jobs, selectedId]);

  const selectedIndex = jobs.findIndex((job) => job.id === selectedId);
  const selectedJob = selectedIndex >= 0 ? jobs[selectedIndex] : null;

  const updateSelected = <K extends keyof JobOpening>(
    field: K,
    value: JobOpening[K],
  ) => {
    if (selectedIndex < 0) return;
    onJobsChange(
      jobs.map((job, i) =>
        i === selectedIndex ? { ...job, [field]: value } : job,
      ),
    );
  };

  const addJob = () => {
    const job = emptyJobOpening();
    onJobsChange([...jobs, job]);
    setSelectedId(job.id);
    setMobileShowEditor(true);
  };

  const deleteSelected = () => {
    if (selectedIndex < 0) return;
    const next = jobs.filter((_, i) => i !== selectedIndex);
    onJobsChange(next);
    setSelectedId(next[0]?.id ?? null);
    setMobileShowEditor(false);
  };

  const handleDragStart = (index: number) => (e: DragEvent) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  };

  const handleDragOver = (index: number) => (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDrop = (toIndex: number) => (e: DragEvent) => {
    e.preventDefault();
    const fromIndex = dragIndex ?? Number(e.dataTransfer.getData("text/plain"));
    setDragIndex(null);
    setDragOverIndex(null);
    if (Number.isNaN(fromIndex) || fromIndex === toIndex) return;

    const next = [...jobs];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    onJobsChange(next);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <p className="text-sm text-foreground-600">
            {jobs.length} job{jobs.length === 1 ? "" : "s"}
          </p>
          <button
            type="button"
            onClick={() => setShowSectionSettings((v) => !v)}
            className="text-xs font-medium text-primary-600 hover:text-primary-700"
          >
            {showSectionSettings ? "Hide section settings" : "Section settings"}
          </button>
        </div>
        <button
          type="button"
          onClick={addJob}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary-500 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-600"
        >
          <i className="ri-add-line"></i>
          New Job
        </button>
      </div>

      {showSectionSettings && (
        <div className="bg-white rounded-xl border border-background-200 p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <Field label="Section Title">
            <input
              className={inputClass}
              value={sectionTitle}
              onChange={(e) => onSectionChange("title", e.target.value)}
            />
          </Field>
          <Field label="Section Description">
            <input
              className={inputClass}
              value={sectionDescription}
              onChange={(e) => onSectionChange("description", e.target.value)}
            />
          </Field>
          <Field label="Empty State Message">
            <input
              className={inputClass}
              value={emptyMessage}
              onChange={(e) => onSectionChange("emptyMessage", e.target.value)}
            />
          </Field>
        </div>
      )}

      <div className="rounded-xl border border-background-200 bg-white overflow-hidden min-h-[560px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
          {/* Left list */}
          <aside
            className={`lg:col-span-4 border-r border-background-200 bg-background-50 flex flex-col ${
              mobileShowEditor ? "hidden lg:flex" : "flex"
            }`}
          >
            <div className="px-3 py-2 border-b border-background-200 bg-white">
              <p className="text-[11px] text-foreground-500">
                Drag handle to reorder. Click a job to edit.
              </p>
            </div>

            <ul className="flex-1 overflow-y-auto divide-y divide-background-200">
              {jobs.length === 0 ? (
                <li className="px-4 py-10 text-center text-sm text-foreground-500">
                  No jobs yet. Create one to get started.
                </li>
              ) : (
                jobs.map((job, index) => {
                  const isSelected = job.id === selectedId;
                  const isDragOver = dragOverIndex === index && dragIndex !== index;
                  return (
                    <li
                      key={job.id}
                      draggable
                      onDragStart={handleDragStart(index)}
                      onDragOver={handleDragOver(index)}
                      onDrop={handleDrop(index)}
                      onDragEnd={handleDragEnd}
                      className={`${
                        isDragOver ? "border-t-2 border-t-primary-500" : ""
                      } ${dragIndex === index ? "opacity-50" : ""}`}
                    >
                      <div
                        className={`flex items-stretch ${
                          isSelected
                            ? "bg-primary-50 border-l-4 border-l-primary-500"
                            : "bg-white border-l-4 border-l-transparent hover:bg-background-50"
                        }`}
                      >
                        <button
                          type="button"
                          className="px-2 text-foreground-400 hover:text-foreground-600 cursor-grab active:cursor-grabbing self-stretch flex items-center"
                          title="Drag to reorder"
                          aria-label="Drag to reorder"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <i className="ri-draggable text-lg"></i>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedId(job.id);
                            setMobileShowEditor(true);
                          }}
                          className="flex-1 min-w-0 text-left px-2 py-2.5"
                        >
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span
                              className={`text-sm font-semibold truncate ${
                                isSelected ? "text-primary-700" : "text-secondary-900"
                              }`}
                            >
                              {job.title || "Untitled job"}
                            </span>
                            <span
                              className={`shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                                job.status === "Open"
                                  ? "bg-green-100 text-green-700"
                                  : job.status === "Draft"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {job.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-foreground-500 truncate">
                            {[job.department, job.location, job.employmentType]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        </button>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </aside>

          {/* Right editor */}
          <div
            className={`lg:col-span-8 flex flex-col min-h-[560px] ${
              mobileShowEditor ? "flex" : "hidden lg:flex"
            }`}
          >
            {!selectedJob ? (
              <div className="flex-1 flex items-center justify-center text-sm text-foreground-500 px-6 text-center">
                Select a job from the list to edit its details.
              </div>
            ) : (
              <>
                <div className="sticky top-0 z-10 bg-white border-b border-background-200 px-4 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={() => setMobileShowEditor(false)}
                      className="lg:hidden inline-flex items-center gap-1 text-sm text-primary-600 mb-1"
                    >
                      <i className="ri-arrow-left-line"></i>
                      Back to list
                    </button>
                    <h3 className="font-semibold text-secondary-900 truncate">
                      {selectedJob.title || "Untitled job"}
                    </h3>
                    <p className="text-xs text-foreground-500 truncate">
                      {[selectedJob.jobCode, selectedJob.department]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={deleteSelected}
                    className="shrink-0 text-sm text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-5">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground-500 mb-3">
                      Core details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Field label="Job Title *">
                        <input
                          className={inputClass}
                          value={selectedJob.title}
                          onChange={(e) => updateSelected("title", e.target.value)}
                        />
                      </Field>
                      <Field label="Job / Requisition Code">
                        <input
                          className={inputClass}
                          value={selectedJob.jobCode}
                          onChange={(e) => updateSelected("jobCode", e.target.value)}
                        />
                      </Field>
                      <Field label="Department *">
                        <input
                          className={inputClass}
                          value={selectedJob.department}
                          onChange={(e) =>
                            updateSelected("department", e.target.value)
                          }
                        />
                      </Field>
                      <Field label="Location *">
                        <input
                          className={inputClass}
                          value={selectedJob.location}
                          onChange={(e) =>
                            updateSelected("location", e.target.value)
                          }
                        />
                      </Field>
                      <Field label="Employment Type *">
                        <select
                          className={inputClass}
                          value={selectedJob.employmentType}
                          onChange={(e) =>
                            updateSelected(
                              "employmentType",
                              e.target.value as EmploymentType,
                            )
                          }
                        >
                          {EMPLOYMENT_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Work Mode *">
                        <select
                          className={inputClass}
                          value={selectedJob.workMode}
                          onChange={(e) =>
                            updateSelected("workMode", e.target.value as WorkMode)
                          }
                        >
                          {WORK_MODES.map((mode) => (
                            <option key={mode} value={mode}>
                              {mode}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Experience Level *">
                        <select
                          className={inputClass}
                          value={selectedJob.experienceLevel}
                          onChange={(e) =>
                            updateSelected(
                              "experienceLevel",
                              e.target.value as ExperienceLevel,
                            )
                          }
                        >
                          {EXPERIENCE_LEVELS.map((level) => (
                            <option key={level} value={level}>
                              {level}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Years of Experience">
                        <input
                          className={inputClass}
                          value={selectedJob.experienceYears}
                          onChange={(e) =>
                            updateSelected("experienceYears", e.target.value)
                          }
                        />
                      </Field>
                      <Field label="Number of Openings *">
                        <input
                          type="number"
                          min={1}
                          className={inputClass}
                          value={selectedJob.openings}
                          onChange={(e) =>
                            updateSelected(
                              "openings",
                              Math.max(1, Number(e.target.value) || 1),
                            )
                          }
                        />
                      </Field>
                      <Field label="Status *">
                        <select
                          className={inputClass}
                          value={selectedJob.status}
                          onChange={(e) =>
                            updateSelected("status", e.target.value as JobStatus)
                          }
                        >
                          {JOB_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground-500 mb-3">
                      Job description
                    </h4>
                    <div className="space-y-3">
                      <Field label="Short Summary *">
                        <textarea
                          className={`${inputClass} resize-y`}
                          rows={2}
                          value={selectedJob.summary}
                          onChange={(e) =>
                            updateSelected("summary", e.target.value)
                          }
                        />
                      </Field>
                      <Field label="Education">
                        <input
                          className={inputClass}
                          value={selectedJob.education}
                          onChange={(e) =>
                            updateSelected("education", e.target.value)
                          }
                        />
                      </Field>
                      <Field label="Key Responsibilities *" hint="One item per line">
                        <textarea
                          className={`${inputClass} resize-y`}
                          rows={4}
                          value={selectedJob.responsibilities}
                          onChange={(e) =>
                            updateSelected("responsibilities", e.target.value)
                          }
                        />
                      </Field>
                      <Field label="Required Qualifications *" hint="One item per line">
                        <textarea
                          className={`${inputClass} resize-y`}
                          rows={4}
                          value={selectedJob.requirements}
                          onChange={(e) =>
                            updateSelected("requirements", e.target.value)
                          }
                        />
                      </Field>
                      <Field label="Preferred Qualifications" hint="One item per line">
                        <textarea
                          className={`${inputClass} resize-y`}
                          rows={3}
                          value={selectedJob.preferredQualifications}
                          onChange={(e) =>
                            updateSelected(
                              "preferredQualifications",
                              e.target.value,
                            )
                          }
                        />
                      </Field>
                      <Field label="Benefits / What We Offer" hint="One item per line">
                        <textarea
                          className={`${inputClass} resize-y`}
                          rows={3}
                          value={selectedJob.benefits}
                          onChange={(e) =>
                            updateSelected("benefits", e.target.value)
                          }
                        />
                      </Field>
                      <Field label="Salary Range">
                        <input
                          className={inputClass}
                          value={selectedJob.salaryRange}
                          onChange={(e) =>
                            updateSelected("salaryRange", e.target.value)
                          }
                        />
                      </Field>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground-500 mb-3">
                      Application & publishing
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Field label="Apply Email">
                        <input
                          type="email"
                          className={inputClass}
                          value={selectedJob.applyEmail}
                          onChange={(e) =>
                            updateSelected("applyEmail", e.target.value)
                          }
                        />
                      </Field>
                      <Field label="Apply URL">
                        <input
                          type="url"
                          className={inputClass}
                          value={selectedJob.applyUrl}
                          onChange={(e) =>
                            updateSelected("applyUrl", e.target.value)
                          }
                        />
                      </Field>
                      <Field label="Posted Date">
                        <input
                          type="date"
                          className={inputClass}
                          value={selectedJob.postedDate}
                          onChange={(e) =>
                            updateSelected("postedDate", e.target.value)
                          }
                        />
                      </Field>
                      <Field label="Application Deadline">
                        <input
                          type="date"
                          className={inputClass}
                          value={selectedJob.closingDate}
                          onChange={(e) =>
                            updateSelected("closingDate", e.target.value)
                          }
                        />
                      </Field>
                      <label className="flex items-center gap-2 md:col-span-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedJob.isFeatured}
                          onChange={(e) =>
                            updateSelected("isFeatured", e.target.checked)
                          }
                          className="h-4 w-4 rounded border-background-300 text-primary-500 focus:ring-primary-500"
                        />
                        <span className="text-sm text-foreground-700">
                          Feature this job on the career page
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
