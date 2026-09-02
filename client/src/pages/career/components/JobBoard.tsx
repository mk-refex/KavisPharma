import { useEffect, useMemo, useState } from 'react';
import { getCareerContent, type JobOpening } from '@/services/api';
import { defaultCareerContent } from '@/data/careerDefaults';

const PAGE_SIZE = 6;

function toList(text: string) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function formatDate(value: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function JobDetailPanel({
  job,
  onBack,
}: {
  job: JobOpening;
  onBack?: () => void;
}) {
  const responsibilities = toList(job.responsibilities);
  const requirements = toList(job.requirements);
  const preferred = toList(job.preferredQualifications);
  const benefits = toList(job.benefits);

  const applyHref = job.applyUrl
    ? job.applyUrl
    : `mailto:${job.applyEmail}?subject=${encodeURIComponent(
        `Application: ${job.title}${job.jobCode ? ` (${job.jobCode})` : ''}`,
      )}`;

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="sticky top-0 z-10 bg-white border-b border-background-200 px-5 md:px-6 py-4">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="lg:hidden inline-flex items-center gap-1.5 text-sm text-primary-600 mb-3"
          >
            <i className="ri-arrow-left-line"></i>
            Back to listings
          </button>
        )}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-heading text-xl md:text-2xl font-semibold text-secondary-900">
                {job.title}
              </h3>
              {job.isFeatured && (
                <span className="text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded bg-accent-50 text-accent-700">
                  Featured
                </span>
              )}
            </div>
            <p className="text-sm text-foreground-600">
              {[job.department, job.location, job.employmentType, job.workMode]
                .filter(Boolean)
                .join(' · ')}
            </p>
            {job.jobCode && (
              <p className="text-xs text-foreground-400 mt-1">
                Requisition: {job.jobCode}
              </p>
            )}
          </div>
          <a
            href={applyHref}
            target={job.applyUrl ? '_blank' : undefined}
            rel={job.applyUrl ? 'noopener noreferrer' : undefined}
            className="inline-flex shrink-0 items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-sm transition-colors"
          >
            Apply Now
            <i className="ri-arrow-right-line"></i>
          </a>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 md:px-6 py-5 space-y-6">
        <p className="text-sm md:text-base text-foreground-700 leading-relaxed">
          {job.summary}
        </p>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-primary-50 text-primary-700">
            {job.employmentType}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-background-100 text-foreground-700">
            {job.workMode}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-background-100 text-foreground-700">
            {job.experienceLevel}
            {job.experienceYears ? ` · ${job.experienceYears}` : ''}
          </span>
          {job.openings > 1 && (
            <span className="px-2.5 py-1 rounded-full bg-background-100 text-foreground-700">
              {job.openings} openings
            </span>
          )}
          {job.salaryRange && (
            <span className="px-2.5 py-1 rounded-full bg-accent-50 text-accent-700">
              {job.salaryRange}
            </span>
          )}
        </div>

        {job.education && (
          <div>
            <h4 className="text-sm font-semibold text-secondary-900 mb-1">
              Education
            </h4>
            <p className="text-sm text-foreground-700">{job.education}</p>
          </div>
        )}

        {responsibilities.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-secondary-900 mb-2">
              Key Responsibilities
            </h4>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground-700">
              {responsibilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {requirements.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-secondary-900 mb-2">
              Required Qualifications
            </h4>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground-700">
              {requirements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {preferred.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-secondary-900 mb-2">
              Preferred Qualifications
            </h4>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground-700">
              {preferred.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {benefits.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-secondary-900 mb-2">
              Benefits
            </h4>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground-700">
              {benefits.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-xs text-foreground-500 pt-2 border-t border-background-100">
          {job.postedDate ? `Posted ${formatDate(job.postedDate)}` : ''}
          {job.closingDate ? ` · Apply by ${formatDate(job.closingDate)}` : ''}
        </p>
      </div>
    </div>
  );
}

export default function JobBoard() {
  const [section, setSection] = useState(defaultCareerContent.jobBoard);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('all');
  const [employmentType, setEmploymentType] = useState('all');
  const [workMode, setWorkMode] = useState('all');
  const [location, setLocation] = useState('all');
  const [page, setPage] = useState(1);
  const [mobileShowDetail, setMobileShowDetail] = useState(false);

  useEffect(() => {
    getCareerContent()
      .then((data) => {
        if (data.jobBoard) {
          setSection(data.jobBoard);
          const firstOpen = data.jobBoard.jobs.find((j) => j.status === 'Open');
          if (firstOpen) setSelectedId(firstOpen.id);
        }
      })
      .catch(() => {});
  }, []);

  const openJobs = useMemo(
    () => section.jobs.filter((job) => job.status === 'Open'),
    [section.jobs],
  );

  const filterOptions = useMemo(() => {
    const departments = [...new Set(openJobs.map((j) => j.department).filter(Boolean))].sort();
    const employmentTypes = [...new Set(openJobs.map((j) => j.employmentType))].sort();
    const workModes = [...new Set(openJobs.map((j) => j.workMode))].sort();
    const locations = [...new Set(openJobs.map((j) => j.location).filter(Boolean))].sort();
    return { departments, employmentTypes, workModes, locations };
  }, [openJobs]);

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();
    return openJobs.filter((job) => {
      if (department !== 'all' && job.department !== department) return false;
      if (employmentType !== 'all' && job.employmentType !== employmentType) return false;
      if (workMode !== 'all' && job.workMode !== workMode) return false;
      if (location !== 'all' && job.location !== location) return false;
      if (!query) return true;
      const haystack = [
        job.title,
        job.department,
        job.location,
        job.jobCode,
        job.summary,
        job.employmentType,
        job.workMode,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [openJobs, search, department, employmentType, workMode, location]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [search, department, employmentType, workMode, location]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pagedJobs = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredJobs.slice(start, start + PAGE_SIZE);
  }, [filteredJobs, page]);

  useEffect(() => {
    if (filteredJobs.length === 0) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !filteredJobs.some((j) => j.id === selectedId)) {
      setSelectedId(filteredJobs[0].id);
    }
  }, [filteredJobs, selectedId]);

  const selectedJob =
    filteredJobs.find((j) => j.id === selectedId) ||
    openJobs.find((j) => j.id === selectedId) ||
    null;

  const selectClass =
    'w-full px-3 py-2 text-sm border border-background-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 outline-none';

  const clearFilters = () => {
    setSearch('');
    setDepartment('all');
    setEmploymentType('all');
    setWorkMode('all');
    setLocation('all');
  };

  const hasActiveFilters =
    search.trim() !== '' ||
    department !== 'all' ||
    employmentType !== 'all' ||
    workMode !== 'all' ||
    location !== 'all';

  return (
    <section className="w-full py-12 md:py-16 bg-background-50">
      <div className="w-full px-4 md:px-8 lg:px-16">
        <div className="text-center max-w-4xl mx-auto mb-8 md:mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-primary-500 mb-4">
            {section.title}
          </h2>
          <p className="text-sm md:text-base text-foreground-700 leading-relaxed">
            {section.description}
          </p>
        </div>

        {openJobs.length === 0 ? (
          <div className="max-w-5xl mx-auto rounded-lg border border-dashed border-background-300 bg-white px-6 py-10 text-center">
            <p className="text-sm text-foreground-600">{section.emptyMessage}</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto rounded-xl border border-background-200 bg-white shadow-sm overflow-hidden min-h-[560px] lg:min-h-[640px]">
            <div className="grid grid-cols-1 lg:grid-cols-12 h-full min-h-[560px] lg:min-h-[640px]">
              {/* Left: list + filters */}
              <aside
                className={`lg:col-span-5 xl:col-span-4 border-r border-background-200 flex flex-col bg-background-50 ${
                  mobileShowDetail ? 'hidden lg:flex' : 'flex'
                }`}
              >
                <div className="p-4 border-b border-background-200 space-y-3 bg-white">
                  <div className="relative">
                    <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-foreground-400"></i>
                    <input
                      type="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search jobs, department, location..."
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className={selectClass}
                      aria-label="Filter by department"
                    >
                      <option value="all">All departments</option>
                      {filterOptions.departments.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <select
                      value={employmentType}
                      onChange={(e) => setEmploymentType(e.target.value)}
                      className={selectClass}
                      aria-label="Filter by employment type"
                    >
                      <option value="all">All types</option>
                      {filterOptions.employmentTypes.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <select
                      value={workMode}
                      onChange={(e) => setWorkMode(e.target.value)}
                      className={selectClass}
                      aria-label="Filter by work mode"
                    >
                      <option value="all">All work modes</option>
                      {filterOptions.workModes.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className={selectClass}
                      aria-label="Filter by location"
                    >
                      <option value="all">All locations</option>
                      {filterOptions.locations.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-foreground-500">
                      {filteredJobs.length} result
                      {filteredJobs.length === 1 ? '' : 's'}
                    </p>
                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="text-xs font-medium text-primary-600 hover:text-primary-700"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {pagedJobs.length === 0 ? (
                    <div className="px-4 py-10 text-center">
                      <p className="text-sm text-foreground-600">
                        No jobs match your search or filters.
                      </p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-background-200">
                      {pagedJobs.map((job) => {
                        const isSelected = selectedId === job.id;
                        return (
                          <li key={job.id}>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedId(job.id);
                                setMobileShowDetail(true);
                              }}
                              className={`w-full text-left px-4 py-4 transition-colors ${
                                isSelected
                                  ? 'bg-primary-50 border-l-4 border-l-primary-500'
                                  : 'bg-white hover:bg-background-50 border-l-4 border-l-transparent'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                    <h3
                                      className={`text-sm font-semibold truncate ${
                                        isSelected
                                          ? 'text-primary-700'
                                          : 'text-secondary-900'
                                      }`}
                                    >
                                      {job.title}
                                    </h3>
                                    {job.isFeatured && (
                                      <span className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-accent-50 text-accent-700">
                                        Featured
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-foreground-600 truncate">
                                    {job.department}
                                    {job.department && job.location ? ' · ' : ''}
                                    {job.location}
                                  </p>
                                  <p className="text-xs text-foreground-400 mt-1">
                                    {[job.employmentType, job.workMode]
                                      .filter(Boolean)
                                      .join(' · ')}
                                  </p>
                                </div>
                                <i className="ri-arrow-right-s-line text-lg text-foreground-400 shrink-0 mt-0.5 lg:hidden"></i>
                              </div>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                {filteredJobs.length > PAGE_SIZE && (
                  <div className="border-t border-background-200 bg-white px-4 py-3 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-background-300 text-foreground-700 hover:bg-background-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <i className="ri-arrow-left-s-line"></i>
                      Prev
                    </button>
                    <span className="text-xs text-foreground-500">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-background-300 text-foreground-700 hover:bg-background-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next
                      <i className="ri-arrow-right-s-line"></i>
                    </button>
                  </div>
                )}
              </aside>

              {/* Right: detail */}
              <div
                className={`lg:col-span-7 xl:col-span-8 min-h-[560px] lg:min-h-[640px] ${
                  mobileShowDetail ? 'block' : 'hidden lg:block'
                }`}
              >
                {selectedJob ? (
                  <JobDetailPanel
                    job={selectedJob}
                    onBack={() => setMobileShowDetail(false)}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center px-6 text-center">
                    <div>
                      <i className="ri-briefcase-line text-4xl text-foreground-300 mb-3"></i>
                      <p className="text-sm text-foreground-600">
                        Select a job from the list to view details.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
