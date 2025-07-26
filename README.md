# VoiceCV Builder

[VoiceCV Builder Demo]


# 🗣️ Your Voice, Your CV, Instantly.

VoiceCV Builder is an innovative web application developed for the Bhashini Startup Velocity 2.0 Hackathon. It aims to revolutionize resume creation by making it voice-driven and highly accessible.

Forget tedious typing! With VoiceCV Builder, you can simply speak your professional details, and watch your CV come to life in real-time.

# ✨ Features

* Voice Input: Easily dictate your resume content using your voice.
* Multilingual Support: Speak in various Indian languages (and English) to populate your CV.
* Real-time Editor: See instant updates as you add or modify content.
* Structured Sections: Organize your resume with dedicated sections for personal info, experience, education, skills, projects, and awards.
* PDF Export: Download your professionally formatted CV as a clean PDF document.

# 🚀 Get Started (Run Locally)

To run VoiceCV Builder on your machine:

1.  Clone the repository:
    git clone [https://github.com/sanjaaaaaa/voicecv_builder.git](https://github.com/sanjaaaaaa/voicecv_builder.git)
    cd voicecv_builder

2.  Install dependencies:
    npm install

3.  Configure Bhashini Translation (Optional, but recommended for multilingual input):
    * Open `src/context/VoiceContext.jsx`.
    * Find `BHASHINI_TRANSLATION_ENDPOINT`, `INFERENCE_API_KEY`, and `UDYAT_KEY`.
    * Replace the placeholder values (`"YOUR_..."`) with your actual Bhashini API endpoint and keys obtained from the Bhashini team.
    * (Note: Voice input (ASR) uses your browser's native capabilities, but translation from Indian languages to English requires Bhashini's Translation API.)

4.  Start the application:
    npm run dev

5.  Open in browser:
    Navigate to `http://localhost:3000`

# 🛠️ Built With

* [React.js](https://react.dev/) - Frontend library
* [Next.js](https://nextjs.org/) - React framework
* [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
* [Bhashini APIs](https://bhashini.gov.in/) - For multilingual translation (requires configuration)
* [Google Gemini](https://gemini.google.com/) - For AI suggestions (mocked in current version)
* [html2pdf.js](https://raw.githack.com/MrRio/jsPDF/master/docs/html2pdf.js.html) - PDF generation

# 💡 Important Note
This version of the project uses **in-memory data storage** and **does not include persistent backend storage**. All entered CV data will be lost upon refreshing the page or closing the browser. This was done to simplify the project for the hackathon submission.

# 🤝 Contribution
Contributions are welcome! Feel free to fork the repository, open issues, or submit pull requests.

# 📄 License
This project is open-source and available under the MIT License.
