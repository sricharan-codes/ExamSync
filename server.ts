import express from 'express';
import {createServer as createViteServer} from 'vite';
import dotenv from 'dotenv';
import {GoogleGenAI} from '@google/genai';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser } from './src/db/users.ts';
import { getExamAttendees } from './src/db/queries.ts';

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());

  // Initialize Gemini AI if API key is present
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey ? new GoogleGenAI({apiKey}) : null;

  // API endpoint for AI Exam Assistant
  app.post('/api/ai-assistant', async (req, res) => {
    try {
      const {prompt, context} = req.body;
      if (!ai) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY is not configured on the server. Please add your Gemini API key in the AI Studio secrets panel.',
        });
      }

      const systemInstruction = `You are ExamSync Pro AI, an expert Examination Controller assistant in a university/institution real-time examination management and communication system. 
You help exam controllers and invigilators analyze seating arrangements, resolve allocation conflicts, handle emergency alerts, draft broadcast notifications, and ensure fair invigilation distribution.
Context provided: ${JSON.stringify(context || {})}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {role: 'user', parts: [{text: `${systemInstruction}\n\nUser Question/Request: ${prompt}`}]}
        ],
      });

      const text = response.text || 'No response generated.';
      res.json({response: text});
    } catch (error: any) {
      console.error('AI Assistant error:', error);
      res.status(500).json({error: error.message || 'Failed to generate AI response'});
    }
  });

  // Protected endpoint to get user profile and sync with DB
  app.get('/api/profile', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const email = req.user!.email!;
      const name = req.user!.name;
      const user = await getOrCreateUser(uid, email, name);
      res.json(user);
    } catch (error: any) {
      console.error('Failed to get/create user:', error);
      res.status(500).json({error: 'Failed to synchronize user profile'});
    }
  });

  // Protected endpoint to get exam attendees
  app.get('/api/exams/:examId/attendees', requireAuth, async (req: AuthRequest, res) => {
    try {
      const examId = parseInt(req.params.examId);
      if (isNaN(examId)) return res.status(400).json({error: 'Invalid exam ID'});
      
      const attendees = await getExamAttendees(examId);
      res.json(attendees);
    } catch (error: any) {
      console.error('Failed to get exam attendees:', error);
      res.status(500).json({error: 'Failed to fetch exam attendees'});
    }
  });

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: {middlewareMode: true},
    appType: 'spa',
  });

  app.use(vite.middlewares);

  const port = Number(process.env.PORT || 3000);
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

startServer();
