
import api from "./api";

export const analyzeResume = async (resumeId, jobDescription) => {
  const response = await api.post("/analyses", {
    resumeId,
    jobDescription,
  });

  return response.data;
};

export const getAnalysisHistory = async () => {
  const response = await api.get("/analyses");
  return response.data;
};
