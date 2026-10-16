import multer from "multer";

const storage = multer.diskStorage({
  destination: "uploads/resumes",

  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.pdf`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype !== "application/pdf") {
    return cb(new Error("Only PDF files are allowed"));
  }

  cb(null, true);
};

export const uploadResume = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});