/**
 * Static profile content. Sourced directly from the resume + LinkedIn.
 * Edit this file to swap in fresh bio copy without touching components.
 */
export const profile = {
  name: 'Sunil Kumar B',
  shortName: 'Sunil',
  role: 'Full-Stack Developer & Engineering Student',
  pitch:
    'Engineering student at Panimalar Engineering College, building full-stack web apps and learning to ship production systems — JavaScript, Python, Go, AWS.',
  location: 'Chennai, India · Open to remote internships',
  email: 'sunilkumarb200703@gmail.com',
  social: {
    github: 'https://github.com/Sunilkumarb2007',
    linkedin: 'https://www.linkedin.com/in/sunilkumarblink/',
  },
  about: [
    'Hi — I am Sunil, a Bachelor of Engineering student in Electrical & Electronics at Panimalar Engineering College, Chennai. I write software because the loop of "imagine, build, ship, debug" is the most honest feedback any craft has.',
    'Across my projects I have shipped a full-stack AI medical assistant (React + Flask), a Go bookstore service with GORM and Gorilla Mux, an AWS CodePipeline deploying to EC2, and shell automation around the GitHub API. I care about clean APIs, defensive error handling, and making things actually work in production.',
    'Currently going deeper into distributed systems, cloud architecture (AWS, OCI), and AI tooling. Outside of class I am writing more code, prepping for AWS/Oracle certifications, and looking for an internship where I can learn from people who ship.',
  ],
  highlights: [
    { label: 'Languages', value: '6+' },
    { label: 'Projects shipped', value: '4' },
    { label: 'Cloud certs', value: '2' },
    { label: 'CGPA', value: '7.8' },
  ],
} as const;
