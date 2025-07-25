export const getAISuggestion = async (prompt) => {
  console.log("Mock AI: Generating suggestion for prompt:", prompt);

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock responses based on prompt keywords
  if (prompt.includes("summary")) {
    return "Dynamic and results-oriented professional with 5+ years of experience in software development, specializing in React and Node.js. Proven ability to lead cross-functional teams and deliver high-quality, scalable solutions. Seeking to leverage expertise in a challenging environment.";
  } else if (prompt.includes("experience") || prompt.includes("project")) {
    return `- Led the development of a new e-commerce platform using React and Tailwind CSS, resulting in a 20% increase in user engagement.\n- Implemented a robust CI/CD pipeline, reducing deployment time by 50%.\n- Collaborated with cross-functional teams to define project requirements and deliver features on schedule.`;
  } else {
    return "AI suggestion: Start with strong action verbs. Quantify your achievements. Tailor to the job description.";
  }
};