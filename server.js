
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Read JSON data sent by the website
app.use(express.json({ limit: "10kb" }));

// Allow Live Server to communicate with this backend
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});

// File where submissions will be saved
const filePath = path.join(__dirname, "submissions.json");

// Save a submission
function saveSubmission(submission) {
    let submissions = [];

    if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, "utf8");

        if (fileData.trim() !== "") {
            submissions = JSON.parse(fileData);
        }
    }

    submissions.push(submission);

    fs.writeFileSync(
        filePath,
        JSON.stringify(submissions, null, 4)
    );
}

// Test the backend
app.get("/", (req, res) => {
    res.send("SaveMore backend is running!");
});

// ENQUIRY FORM
app.post("/api/enquiry", (req, res) => {
    const { name, email, enquiryType, message } = req.body;

    if (
        typeof name !== "string" ||
        name.trim().length < 2 ||
        name.trim().length > 100 ||
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        typeof enquiryType !== "string" ||
        !["Product", "Price", "Availability", "Services"].includes(enquiryType) ||
        typeof message !== "string" ||
        message.trim().length < 10 ||
        message.trim().length > 2000
    ) {
        return res.status(400).json({
            success: false,
            message: "Please enter valid information in all enquiry fields."
        });
    }

    try {
        saveSubmission({
            type: "Enquiry",
            name: name.trim(),
            email: email.trim(),
            enquiryType: enquiryType,
            message: message.trim(),
            date: new Date().toISOString()
        });

        res.json({
            success: true,
            message: `Thank you, ${name.trim()}! Your enquiry has been received and saved.`
        });

    } catch (error) {
        console.error("Enquiry saving error:", error);

        res.status(500).json({
            success: false,
            message: "Your enquiry could not be saved. Please try again."
        });
    }
});

// CONTACT FORM
app.post("/api/contact", (req, res) => {
    const { name, email, subject, message } = req.body;

    if (
        typeof name !== "string" ||
        name.trim().length < 2 ||
        name.trim().length > 100 ||
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        typeof subject !== "string" ||
        subject.trim().length < 3 ||
        subject.trim().length > 150 ||
        typeof message !== "string" ||
        message.trim().length < 10 ||
        message.trim().length > 2000
    ) {
        return res.status(400).json({
            success: false,
            message: "Please enter valid information in all contact fields."
        });
    }

    try {
        saveSubmission({
            type: "Contact",
            name: name.trim(),
            email: email.trim(),
            subject: subject.trim(),
            message: message.trim(),
            date: new Date().toISOString()
        });

        res.json({
            success: true,
            message: `Thank you, ${name.trim()}! Your contact message has been received and saved.`
        });

    } catch (error) {
        console.error("Contact saving error:", error);

        res.status(500).json({
            success: false,
            message: "Your message could not be saved. Please try again."
        });
    }
});

// Start the backend
app.listen(PORT, () => {
    console.log(`SaveMore backend running at http://localhost:${PORT}`);
});
