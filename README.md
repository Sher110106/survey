# Smart Blinds Survey Web Application

A Next.js web application for collecting expert feedback on sustainable motorized blind concepts. Energy specialists rate 12 innovative blind designs across weighted criteria, and their responses are aggregated into an admin dashboard.

## 🚀 Quick Start

```bash
cd survey-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📄 Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with project pitch and survey overview |
| `/survey` | Rate all 12 blind concepts across 4 categories |
| `/results` | Your personal results (localStorage) |
| `/admin` | **📊 Aggregated results from all respondents** |

## 🎯 The Concept

We're developing **motorized blinds that automatically adapt** to:
- 🌡️ Temperature changes (preserve cold/capture warmth)
- ☁️ Cloud cover (avoid constant hunting)
- ⚡ Energy efficiency (minimize motor cycles)

This survey helps determine which underlying blind mechanism to use as our automation platform.

## 📋 Rating Categories

Each concept is rated 1-10 on these weighted criteria:

| Category | Weight | Focus |
|----------|--------|-------|
| **Retrofit & Plug-Play** | 30% | DIY installation in Indian context |
| **Design Integrity** | 30% | 8 sub-principles (functionality, durability, etc.) |
| **Net-Zero Impact** | 30% | Quantifiable energy/water savings |
| **Feasibility** | 10% | Realistic execution with available resources |

### Critical Failure Rule
If **Functionality** or **Durability** scores below 4 in Design Integrity, the entire category is capped at 4.

## 🏗️ Project Structure

```
survey-app/
├── data/
│   └── submissions.json      # Stored survey responses
├── public/
│   └── images/               # 12 concept images (1.png - 12.png)
├── src/
│   ├── app/
│   │   ├── page.tsx          # Landing page
│   │   ├── survey/           # Survey flow
│   │   ├── results/          # Personal results
│   │   ├── admin/            # Aggregated dashboard
│   │   └── api/
│   │       ├── submissions/  # POST/GET submissions
│   │       └── results/      # GET aggregated stats
│   ├── components/
│   │   ├── IdeaCard.tsx      # Display blind concept
│   │   ├── RatingSlider.tsx  # 1-10 slider input
│   │   ├── CategoryRating.tsx# Category with sliders
│   │   └── ResultsChart.tsx  # Rankings visualization
│   ├── data/
│   │   ├── ideas.ts          # 12 blind concepts
│   │   └── categories.ts     # Rating criteria
│   └── hooks/
│       └── useSurvey.ts      # State management
```

## 🔌 API Endpoints

### `POST /api/submissions`
Save a new survey submission.

```json
{
  "ratings": {
    "1": { "retrofit": 8, "design": {...}, "netzero": 7, "feasibility": 9 },
    "2": { ... }
  }
}
```

### `GET /api/submissions`
Retrieve all submissions (raw data).

### `GET /api/results`
Get aggregated statistics:
- Total respondents
- Idea rankings by weighted score
- Category averages across all submissions
- Recent submission timestamps

## 💾 Data Storage

Survey responses are stored in `data/submissions.json`. Each submission includes:
- Unique ID
- Timestamp
- All ratings per idea

## 🎨 Design Features

- Premium dark theme with glassmorphism
- Animated landing page mockup
- Color-coded score feedback (red→green)
- Responsive layout for all devices
- LocalStorage for survey progress

## 📊 For Survey Administrators

1. Share the survey URL with energy specialists
2. They complete the survey at `/survey`
3. View aggregated results at `/admin`
4. Rankings and statistics update in real-time
5. Raw data available at `/api/submissions`

## 🛠️ Technologies

- **Next.js 16** with App Router
- **TypeScript**
- **CSS Modules** (no Tailwind)
- **File-based JSON storage**

## 📝 License

MIT
