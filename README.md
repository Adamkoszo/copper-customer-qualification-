# Copper CRM Customer Qualification Embedded App

Interactive questionnaire embedded app for Copper CRM that qualifies leads based on credit assessment, income, and lending criteria.

## Features

🔴 **CRITICAL Questions (7)**
- KHR credit bureau status
- Employment status
- Property type & material
- Monthly income
- JTM% (debt-to-income ratio)
- Outstanding debt
- Bank assignment

🟡 **IMPORTANT Questions (5)**
- Employment stability
- Income documentation
- Property documentation
- Contract signing timeline
- Special considerations

🟢 **OPTIONAL Questions (3)**
- Special income sources
- Business details
- Insurance requirements

## Scoring System

- **Score 0-30**: 🔴 NO-GO (High risk, qualification issues)
- **Score 31-70**: 🟡 WAIT (Review required, additional documentation)
- **Score 71-100**: 🟢 GO (Good qualification, proceed)

## Deployment

### Prerequisites
- Node.js 14+
- npm or yarn

### Local Development

```bash
npm install
npm start
```

Runs on `http://localhost:3000`

### Deploy to Vercel (1-Click)

1. Go to https://vercel.com
2. Click "Add New Project"
3. Select this GitHub repository
4. Click "Deploy"
5. Get your HTTPS URL

### Add to Copper CRM

1. In Copper, go to **Settings → Integrations → Embedded Apps**
2. Click "Add Embedded App"
3. **App URL**: `https://your-vercel-deployment.vercel.app`
4. **Entities**: Select "Leads", "People", "Opportunities"
5. **Display Location**: Activity Panel or Sidebar
6. Save

## Technical Stack

- **React 18** - UI framework
- **Copper SDK** - Access Copper context & data
- **Vercel** - Hosting & auto-deployment

## File Structure

```
src/
├── App.js          # Main questionnaire component
├── App.css         # Styling
└── index.js        # React entry point
public/
├── index.html      # HTML template (Copper SDK loaded here)
package.json        # Dependencies
vercel.json         # Vercel deployment config
```

## Copper SDK Integration

The app loads the Copper SDK from the HTML template to:
- Access customer name from Copper context
- Initialize embedded app interface
- Display within Copper's iframe

## Support & Updates

For issues or feature requests, see the main Solutor2 CRM project.

---

**Version**: 1.0  
**Updated**: March 10, 2026  
**License**: Internal Use Only
