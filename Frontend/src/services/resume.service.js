
import api from "./api";

export const uploadResume = async (file) => {
  const formData = new FormData();

  formData.append("resume", file);

  const response = await api.post("/resumes", formData);

  return response.data;
};

export const getResumes = async () => {
  const response = await api.get("/resumes");
  return response.data;
};

export const deleteResume = async (resumeId) => {
  const response = await api.delete(`/resumes/${resumeId}`);
  return response.data;
};


export const downloadResume = async (resumeId, fileName) => {
  const response = await api.get(
    `/resumes/${resumeId}/download`,
    { responseType: "blob" }
  );

  const blobUrl = URL.createObjectURL(response.data);
  const link = document.createElement("a");

  link.href = blobUrl;
  link.download = fileName || "resume.pdf";

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(blobUrl);
};

