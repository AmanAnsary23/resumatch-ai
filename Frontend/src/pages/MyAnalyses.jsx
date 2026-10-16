
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  RefreshCw,
  FileText,
  LockKeyhole,
  Sparkles,
  CalendarDays,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import api from "../services/api";

export default function MyAnalyses() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAuthenticated = Boolean(localStorage.getItem("accessToken"));

  const fetchAnalyses = useCallback(async () => {
    if (!localStorage.getItem("accessToken")) {
      setAnalyses([]);
      setError("");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.get("/analyses");
      const body = response.data?.data ?? response.data;
      setAnalyses(Array.isArray(body) ? body : []);
    } catch (err) {
      const status = err.response?.status;

      if (status === 401) {
        setError("Your session has expired. Please log in again.");
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to load your analyses. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalyses();
  }, [fetchAnalyses]);

  const getScore = (analysis) =>
    analysis.matchScore ?? analysis.result?.matchScore;

  const getResumeName = (analysis) =>
    analysis.resume?.originalName ||
    analysis.resume?.fileName ||
    analysis.resume?.filename ||
    "Resume analysis";

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Page heading */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            <Sparkles size={14} />
            Your workspace
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            My Analyses
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review your previous resume and job description comparisons.
          </p>
        </div>

        {isAuthenticated && (
          <button
            type="button"
            onClick={fetchAnalyses}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
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
              Your career progress, all in one place
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Sign in to revisit your previous resume analyses, compare
              match scores, and track how your resume improves over time.
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
              Your analysis history stays private to your account.
            </p>
          </div>
        </section>
      ) : (
        <>
          {/* Loading */}
          {loading && (
            <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6">
              <RefreshCw
                size={28}
                className="animate-spin text-blue-600"
              />
              <p className="mt-4 text-sm text-slate-500">
                Loading your analyses...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 p-5"
            >
              <div className="flex items-start gap-3">
                <AlertCircle
                  size={20}
                  className="mt-0.5 shrink-0 text-red-600"
                />
                <div>
                  <h2 className="font-semibold text-red-800">
                    Unable to load analyses
                  </h2>
                  <p className="mt-1 text-sm text-red-700">{error}</p>

                  {error.includes("session has expired") ? (
                    <Link
                      to="/login"
                      className="mt-3 inline-flex font-semibold text-red-800 underline"
                    >
                      Login again
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={fetchAnalyses}
                      className="mt-3 font-semibold text-red-800 underline"
                    >
                      Try again
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && analyses.length === 0 && (
            <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <ClipboardList size={30} />
              </div>

              <h2 className="text-lg font-semibold text-slate-900">
                No analyses yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Your reports will appear here after you upload a resume
                and analyze it against a job description.
              </p>

              <Link
                to="/"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Sparkles size={16} />
                Analyze a Resume
              </Link>
            </section>
          )}

          {/* Analysis cards */}
          {!loading && !error && analyses.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  <span className="font-semibold text-slate-900">
                    {analyses.length}
                  </span>{" "}
                  {analyses.length === 1 ? "analysis" : "analyses"} found
                </p>

                <Link
                  to="/"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  + New analysis
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {analyses.map((analysis, index) => {
                  const score = getScore(analysis);

                  const numericScore =
                    score !== undefined &&
                    score !== null &&
                    Number.isFinite(Number(score))
                      ? Math.max(0, Math.min(100, Number(score)))
                      : null;

                  return (
                    <article
                      key={analysis.id ?? index}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                            <FileText size={21} />
                          </div>

                          <div className="min-w-0">
                            <h2 className="break-words font-semibold text-slate-900">
                              {getResumeName(analysis)}
                            </h2>

                            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                              <CalendarDays size={13} />
                              {formatDate(analysis.createdAt)}
                            </p>
                          </div>
                        </div>

                        {numericScore !== null && (
                          <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-700">
                            {numericScore}%
                          </span>
                        )}
                      </div>

                      {numericScore !== null && (
                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-blue-600"
                            style={{ width: `${numericScore}%` }}
                          />
                        </div>
                      )}

                      <div className="mt-5">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Job description
                        </p>

                        <p className="line-clamp-4 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                          {analysis.jobDescription ||
                            "No job description available."}
                        </p>
                      </div>

                      {analysis.result?.summary && (
                        <div className="mt-4 rounded-xl bg-slate-50 p-3">
                          <p className="mb-1 text-xs font-semibold text-slate-700">
                            AI Summary
                          </p>
                          <p className="line-clamp-3 text-sm leading-5 text-slate-600">
                            {analysis.result.summary}
                          </p>
                        </div>
                      )}
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
