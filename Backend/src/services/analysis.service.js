const SKILLS = [
  "JavaScript",
  "TypeScript",
  "Java",
  "Python",
  "Node.js",
  "Express.js",
  "React",
  "Spring Boot",
  "Django",
  "FastAPI",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Redis",
  "Kafka",
  "Docker",
  "Kubernetes",
  "AWS",
  "Git",
  "Linux",
  "REST API",
  "JWT",
  "Microservices",
  "System Design",
  "CI/CD",
  "SQL",
  "Machine Learning",
];

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const containsSkill = (text, skill) => {
  const pattern = escapeRegex(skill).replace(/\s+/g, "\\s+");
  const regex = new RegExp(`(?<![\\w])${pattern}(?![\\w])`, "i");

  return regex.test(text);
};

export const analyzeSkills = (resumeText, jobDescription) => {
  const resumeSkills = SKILLS.filter((skill) =>
    containsSkill(resumeText, skill)
  );

  const requiredSkills = SKILLS.filter((skill) =>
    containsSkill(jobDescription, skill)
  );

  if (requiredSkills.length === 0) {
    const error = new Error(
      "No recognizable technical skills found in the job description."
    );
    error.statusCode = 400;
    throw error;
  }

  const matchedSkills = requiredSkills.filter((skill) =>
    resumeSkills.includes(skill)
  );

  const missingSkills = requiredSkills.filter(
    (skill) => !resumeSkills.includes(skill)
  );

  const matchScore = Math.round(
    (matchedSkills.length / requiredSkills.length) * 100
  );

  return {
    matchScore,
    matchedSkills,
    missingSkills,
    totalRequiredSkills: requiredSkills.length,
  };
};