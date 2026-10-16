
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Trash2,
  RefreshCw,
  UploadCloud,
  LockKeyhole,
  CalendarDays,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Download,
} from "lucide-react";

import {
  getResumes,
  deleteResume,
  downloadResume,
} from "../services/resume.service";

export default function SavedResumes() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  const isAuthenticated = Boolean(
    localStorage.getItem("accessToken")
  );

  const fetchResumes = useCallback(async () => {
    if (!localStorage.getItem("accessToken")) {
      setResumes([]);
      setError("");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await getResumes();
      const body = response?.data ?? response;

      const list = Array.isArray(body)
        ? body
        : Array.isArray(body?.resumes)
          ? body.resumes
          : [];

      setResumes(list);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load your saved resumes. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const getResumeName = (resume) =>
    resume.originalName ||
    resume.fileName ||
    resume.filename ||
    resume.name ||
    "resume.pdf";

  const formatDate = (date) => {
    if (!date) return null;

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return null;

    return parsedDate.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleDownload = async (resume) => {
    setDownloadingId(resume.id);
    setError("");

    try {
      await downloadResume(resume.id, getResumeName(resume));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to download this resume. Please try again."
      );
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (resume) => {
    const confirmed = window.confirm(
      "Delete this resume? Its associated analysis history may also be deleted."
    );

    if (!confirmed) return;

    setDeletingId(resume.id);
    setError("");

    try {
      await deleteResume(resume.id);

      setResumes((current) =>
        current.filter((item) => item.id !== resume.id)
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete this resume. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Page heading */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            <ShieldCheck size={14} />
            Your private workspace
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Saved Resumes
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage and download your uploaded resumes.
          </p>
        </div>

        {isAuthenticated && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={fetchResumes}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <UploadCloud size={16} />
              Upload
            </Link>
          </div>
        )}
      </div>

      {/* Guest invitation */}
      {!isAuthenticated ? (
        <section className="relative overflow-hidden rounded-2xl border border-blue-100 bg-white px-6 py-12 text-center shadow-sm sm:px-10">
          <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-blue-50" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-indigo-50" />

          <div className="relative mx-auto flex max-w-lg flex-col items-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <LockKeyhole size={29} />
            </div>

            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Your resumes, all in one place
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Login to access your uploaded resumes, download your files,
              and continue analyzing new job opportunities.
            </p>

            <div className="mt-7 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Login to Your Account
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Create Account
              </Link>
            </div>

            <p className="mt-5 text-xs text-slate-400">
              Your uploaded files are private to your account.
            </p>
          </div>
        </section>
      ) : (
        <>
          {/* Error message */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <AlertCircle size={19} className="mt-0.5 shrink-0" />

              <div>
                <p>{error}</p>
                <button
                  type="button"
                  onClick={fetchResumes}
                  className="mt-2 font-semibold underline"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6">
              <RefreshCw
                size={28}
                className="animate-spin text-blue-600"
              />
              <p className="mt-4 text-sm text-slate-500">
                Loading your saved resumes...
              </p>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && resumes.length === 0 && (
            <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <FileText size={30} />
              </div>

              <h2 className="text-lg font-semibold text-slate-900">
                No saved resumes yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Upload your first PDF resume to keep it available for
                future job description analyses.
              </p>

              <Link
                to="/"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <UploadCloud size={17} />
                Upload Your Resume
              </Link>
            </section>
          )}

          {/* Resume list */}
          {!loading && !error && resumes.length > 0 && (
            <>
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-slate-900">
                  {resumes.length}
                </span>{" "}
                {resumes.length === 1 ? "resume" : "resumes"} saved
              </p>

              <div className="space-y-3">
                {resumes.map((resume) => {
                  const uploadedDate = formatDate(resume.createdAt);

                  const size =
                    typeof resume.size === "number"
                      ? resume.size
                      : typeof resume.fileSize === "number"
                        ? resume.fileSize
                        : null;

                  return (
                    <article
                      key={resume.id}
                      className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                          <FileText size={23} />
                        </div>

                        <div className="min-w-0">
                          <h2 className="break-words font-semibold text-slate-900">
                            {getResumeName(resume)}
                          </h2>

                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                            {uploadedDate && (
                              <span className="inline-flex items-center gap-1">
                                <CalendarDays size={13} />
                                Uploaded {uploadedDate}
                              </span>
                            )}

                            {size !== null && (
                              <span>
                                {(size / 1024).toFixed(1)} KB
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Download and Delete */}
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleDownload(resume)}
                          disabled={
                            downloadingId === resume.id ||
                            deletingId === resume.id
                          }
                          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-blue-200 px-4 py-2.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Download
                            size={16}
                            className={
                              downloadingId === resume.id
                                ? "animate-bounce"
                                : ""
                            }
                          />
                          {downloadingId === resume.id
                            ? "Downloading..."
                            : "Download"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(resume)}
                          disabled={
                            deletingId === resume.id ||
                            downloadingId === resume.id
                          }
                          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                          {deletingId === resume.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
