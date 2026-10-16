
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  UploadCloud,
  FileText,
  X,
  Lightbulb,
  Sparkles,
  LockKeyhole,
  LoaderCircle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { uploadResume } from "../services/resume.service";
import { analyzeResume } from "../services/analysis.service";

export default function Dashboard() {
  const fileInputRef = useRef(null);

  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");

  const [isAuthenticated] = useState(
    Boolean(localStorage.getItem("accessToken"))
  );

  const [uploading, setUploading] = useState(false);
  const [uploadedResume, setUploadedResume] = useState(null);
  const [uploadError, setUploadError] = useState("");

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setUploadedResume(null);
    setUploadError("");
    setAnalysisError("");
    setAnalysisResult(null);

    if (file.type !== "application/pdf") {
      setResume(null);
      event.target.value = "";
      setUploadError("Please select a PDF file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setResume(null);
      event.target.value = "";
      setUploadError("File size must be 5 MB or less.");
      return;
    }

    setResume(file);
  };

  const handleUpload = async () => {
    if (!isAuthenticated) {
      setUploadError("Please login or register to upload your resume.");
      return;
    }

    if (!resume) {
      setUploadError("Please choose a PDF resume first.");
      return;
    }

    setUploading(true);
    setUploadError("");
    setUploadedResume(null);
    setAnalysisError("");
    setAnalysisResult(null);

    try {
      const response = await uploadResume(resume);

      if (!response.success || !response.resume?.id) {
        throw new Error("The uploaded resume ID was not returned.");
      }

      setUploadedResume(response.resume);
    } catch (error) {
      setUploadError(
        error.response?.data?.message ||
          error.message ||
          "Resume upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!isAuthenticated) {
      setAnalysisError("Please login or register to analyze your resume.");
      return;
    }

    if (!uploadedResume?.id) {
      setAnalysisError("Please upload your resume successfully first.");
      return;
    }

    if (!jobDescription.trim()) {
      setAnalysisError("Please enter a job description.");
      return;
    }

    setAnalyzing(true);
    setAnalysisError("");
    setAnalysisResult(null);

    try {
      const response = await analyzeResume(
        uploadedResume.id,
        jobDescription.trim()
      );

      if (!response.success || !response.data) {
        throw new Error("The analysis response was incomplete.");
      }

      setAnalysisResult(response.data);
    } catch (error) {
      setAnalysisError(
        error.response?.data?.message ||
          error.message ||
          "Analysis failed. Please try again."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const removeResume = () => {
    setResume(null);
    setUploadedResume(null);
    setUploadError("");
    setAnalysisError("");
    setAnalysisResult(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const setExampleJD = () => {
    setJobDescription(
      "We need a Java backend developer with Spring Boot, PostgreSQL, REST API development, Docker, Kafka, and experience building secure, scalable applications."
    );
    setAnalysisError("");
  };

  const formatLabel = (key) =>
    key
      .replace(/([A-Z])/g, " $1")
      .replace(/[_-]/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());

  const renderKeywordSection = ({
    dataKey,
    title,
    color,
    Icon,
  }) => {
    const keywords = Array.isArray(analysisResult?.[dataKey])
      ? analysisResult[dataKey]
      : [];

    const themes = {
      green: {
        card: "border-green-200 bg-green-50/50",
        badge: "bg-green-100 text-green-800",
        icon: "text-green-600",
        count: "bg-green-100 text-green-800",
      },
      red: {
        card: "border-red-200 bg-red-50/50",
        badge: "bg-red-100 text-red-800",
        icon: "text-red-600",
        count: "bg-red-100 text-red-800",
      },
      amber: {
        card: "border-amber-200 bg-amber-50/50",
        badge: "bg-amber-100 text-amber-800",
        icon: "text-amber-600",
        count: "bg-amber-100 text-amber-800",
      },
    };

    const theme = themes[color];

    return (
      <section
        key={dataKey}
        className={`min-w-0 rounded-2xl border p-5 ${theme.card}`}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="font-semibold text-slate-900">{title}</h3>

          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold ${theme.count}`}
          >
            {keywords.length}
          </span>
        </div>

        {keywords.length === 0 ? (
          <p className="text-sm text-slate-500">
            No keywords in this category.
          </p>
        ) : (
          <div className="space-y-3">
            {keywords.map((item, index) => {
              const keyword =
                typeof item === "string"
                  ? item
                  : item?.keyword || "Keyword";

              const evidence =
                typeof item === "string"
                  ? ""
                  : item?.evidence || "";

              return (
                <div
                  key={`${keyword}-${index}`}
                  className="rounded-xl border border-white bg-white p-3 shadow-sm"
                >
                  <div className="flex items-start gap-2">
                    <Icon
                      size={17}
                      className={`mt-1 shrink-0 ${theme.icon}`}
                    />

                    <div className="min-w-0 flex-1">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-sm font-medium ${theme.badge}`}
                      >
                        {keyword}
                      </span>

                      {evidence && (
                        <p className="mt-2 break-words text-sm leading-5 text-slate-600">
                          {evidence}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    );
  };

  const renderListSection = (dataKey, title) => {
    const items = Array.isArray(analysisResult?.[dataKey])
      ? analysisResult[dataKey]
      : [];

    return (
      <section
        key={dataKey}
        className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <h3 className="mb-3 font-semibold text-slate-900">{title}</h3>

        {items.length === 0 ? (
          <p className="text-sm text-slate-500">No items available.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm leading-6 text-slate-600"
              >
                <span className="text-blue-600">•</span>
                <span className="break-words">
                  {typeof item === "string"
                    ? item
                    : item?.keyword || JSON.stringify(item)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
          <Sparkles size={14} />
          AI Powered
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          See how well{" "}
          <span className="text-blue-600">your resume</span> matches a job
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Get an instant match score, missing keywords, and personalized
          suggestions to improve your resume.
        </p>
      </div>

      {/* Guest login banner */}
      {!isAuthenticated && (
        <div className="flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 font-semibold text-slate-900">
              <LockKeyhole size={19} className="text-blue-600" />
              Login required
            </div>

            <p className="mt-1 text-sm text-slate-600">
              Create an account or login to upload your resume and analyze it.
            </p>
          </div>

          <div className="flex shrink-0 gap-2">
            <Link
              to="/login"
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Register
            </Link>
          </div>
        </div>
      )}

      {/* Upload and job description */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Resume upload */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <UploadCloud size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                1. Upload Your Resume
              </h2>
              <p className="text-xs text-slate-500">
                PDF only (Max 5 MB)
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            disabled={!isAuthenticated || uploading}
            className="hidden"
          />

          <button
            type="button"
            disabled={!isAuthenticated || uploading}
            onClick={() => {
              if (resume) {
                handleUpload();
              } else {
                fileInputRef.current?.click();
              }
            }}
            className="flex min-h-40 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/70 p-5 text-center transition hover:border-blue-400 hover:bg-blue-50/50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? (
              <LoaderCircle
                size={34}
                className="mb-3 animate-spin text-blue-600"
              />
            ) : (
              <FileText size={34} className="mb-3 text-slate-700" />
            )}

            <span className="text-sm font-medium text-slate-800">
              {uploading
                ? "Uploading resume..."
                : resume
                  ? resume.name
                  : "Choose a PDF resume"}
            </span>

            <span className="my-1 text-xs text-slate-500">
              {resume
                ? `${(resume.size / 1024).toFixed(1)} KB`
                : "Maximum 5 MB"}
            </span>

            <span className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white">
              {uploading
                ? "Please wait..."
                : resume
                  ? "Upload Resume"
                  : "Choose File"}
            </span>
          </button>

          {resume && (
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                disabled={uploading}
                onClick={removeResume}
                className="inline-flex items-center gap-1 rounded px-2 py-1 text-sm text-slate-500 hover:bg-slate-100 hover:text-red-600 disabled:opacity-50"
              >
                <X size={16} />
                Remove file
              </button>
            </div>
          )}

          {uploadedResume && (
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
              <CheckCircle size={18} className="mt-0.5 shrink-0" />
              <span>Resume uploaded successfully!</span>
            </div>
          )}

          {uploadError && (
            <p
              role="alert"
              className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600"
            >
              {uploadError}
            </p>
          )}
        </section>

        {/* Job description */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileText size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                2. Paste Job Description
              </h2>
              <p className="text-xs text-slate-500">
                Paste the full job description for better accuracy
              </p>
            </div>
          </div>

          <div className="relative">
            <textarea
              value={jobDescription}
              onChange={(event) => {
                setJobDescription(event.target.value);
                setAnalysisError("");
              }}
              disabled={!isAuthenticated || analyzing}
              maxLength={20000}
              placeholder={
                isAuthenticated
                  ? "Paste job description here..."
                  : "Login to enter a job description..."
              }
              className="h-40 w-full resize-y rounded-xl border border-slate-200 bg-white p-4 pb-8 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            />

            <span className="absolute bottom-3 right-3 text-xs text-slate-400">
              {jobDescription.length}/20000
            </span>
          </div>

          <button
            type="button"
            disabled={!isAuthenticated || analyzing}
            onClick={setExampleJD}
            className="mt-3 inline-flex items-center gap-2 text-sm text-slate-600 transition hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Lightbulb size={17} />
            Try an example JD
          </button>
        </section>
      </div>

      {/* Analyze button */}
      <button
        type="button"
        disabled={!isAuthenticated || uploading || analyzing}
        onClick={handleAnalyze}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-4 font-semibold text-white shadow-sm transition hover:bg-blue-950 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {analyzing ? (
          <LoaderCircle size={19} className="animate-spin" />
        ) : (
          <Sparkles size={19} />
        )}

        {analyzing
          ? "Analyzing your resume..."
          : isAuthenticated
            ? "Analyze My Resume"
            : "Login to Analyze Resume"}
      </button>

      {/* Analysis error */}
      {analysisError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          {analysisError}
        </div>
      )}

      {/* AI analysis results */}
      {analysisResult && (
        <section className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50/50 p-5 shadow-sm">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              <CheckCircle size={14} />
              Analysis completed
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              Your AI Analysis
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Results generated from your resume and job description.
            </p>
          </div>

          {/* Match score */}
          {analysisResult.matchScore !== undefined && (
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <p className="text-sm font-medium text-blue-700">
                Resume Match Score
              </p>

              <p className="mt-1 text-4xl font-bold text-blue-900">
                {analysisResult.matchScore}%
              </p>

              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-blue-100">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{
                    width: `${Math.max(
                      0,
                      Math.min(100, Number(analysisResult.matchScore) || 0)
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Summary */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="mb-2 font-semibold text-slate-900">Summary</h3>
            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {analysisResult.summary || "No summary available."}
            </p>
          </section>

          {/* Keyword analysis */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {[
              {
                dataKey: "matchedKeywords",
                title: "Matched Keywords",
                color: "green",
                Icon: CheckCircle,
              },
              {
                dataKey: "missingKeywords",
                title: "Missing Keywords",
                color: "red",
                Icon: X,
              },
              {
                dataKey: "partiallyMatchedKeywords",
                title: "Partially Matched Keywords",
                color: "amber",
                Icon: Lightbulb,
              },
            ].map((category) =>
              renderKeywordSection(category)
            )}
          </div>

          {/* Requirements, strengths and improvements */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {renderListSection(
              "matchedRequirements",
              "Matched Requirements"
            )}

            {renderListSection(
              "missingRequirements",
              "Missing Requirements"
            )}

            {renderListSection("strengths", "Strengths")}

            {renderListSection("improvements", "Improvements")}
          </div>
        </section>
      )}
    </div>
  );
}
