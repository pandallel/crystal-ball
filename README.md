# Crystal Ball - Fortune Teller Website

A silly web application that generates random, humorous "predictions" about your future using AI, inspired by a Reddit post about a "very really real and definitely not fake" fortune teller.

## Features

- Interactive crystal ball animation
- AI-generated silly fortunes using OpenAI's GPT models
- Responsive design that works on mobile and desktop
- Vercel serverless deployment

## Usage

Visit the deployed site or run locally to use the fortune teller. Click the "Tell My Fortune" button to receive your (very real, definitely not made up) AI-generated prediction.

## Setup & Deployment

### Local Development

1. Clone this repository
2. Install dependencies: `npm install`
3. Create a `.env` file with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
4. Run the development server: `npm start`
5. Open http://localhost:3000 in your browser

### Deploying to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` to deploy
3. Add your OpenAI API key in the Vercel dashboard:
   - Go to your project settings
   - Add an environment variable named `OPENAI_API_KEY`

## Technologies Used

- HTML5 and CSS3 with animations
- Vanilla JavaScript for frontend
- OpenAI API for fortune generation
- Vercel for serverless functions and hosting

## Credits

Inspired by a post on r/BenignExistence.
