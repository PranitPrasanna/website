const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');

// POST route for contact form
router.post('/submit', async (req, res) => {
    try {
        const { firstName, lastName, email, message } = req.body;

        // Validate required fields
        if (!firstName || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields'
            });
        }

        // Try to save to database if MongoDB is connected
        let savedContact = null;
        try {
            const newContact = new Contact({
                firstName,
                lastName,
                email,
                message
            });
            savedContact = await newContact.save();
            console.log('Contact saved to database:', savedContact._id);
        } catch (dbError) {
            console.error('Database save error:', dbError);
            // Continue even if database save fails
        }

        // Send email notification
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.RECEIVER_EMAIL,
                replyTo: email,
                subject: `Contact Form Submission from ${firstName} ${lastName || ''}`,
                html: `
                    <h3>New Contact Form Submission</h3>
                    <p><strong>Name:</strong> ${firstName} ${lastName || ''}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Message:</strong></p>
                    <p>${message.replace(/\n/g, '<br>')}</p>
                    <hr>
                    <p><small>Submitted on: ${new Date().toLocaleString()}</small></p>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log('Email notification sent successfully');
        } catch (emailError) {
            console.error('Email notification error:', emailError);
            // Don't fail the whole request if email fails
        }

        // Send success response
        res.json({
            success: true,
            message: 'Thank you for your message! We will get back to you soon.',
            data: {
                id: savedContact ? savedContact._id : Date.now(),
                name: `${firstName} ${lastName || ''}`.trim(),
                email,
                message
            }
        });

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while processing your request'
        });
    }
});

// GET route to retrieve all contacts
router.get('/all', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching contacts'
        });
    }
});

// GET route to test if API is working
router.get('/test', (req, res) => {
    res.json({ message: 'Contact API is working!' });
});

module.exports = router;