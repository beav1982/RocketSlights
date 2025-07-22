# Slights Game App

A multiplayer card game built with React and Supabase.

## Deployment Setup

### Environment Variables

For Netlify deployment, set these environment variables:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_URL=https://your-app.netlify.app
```

### Supabase Configuration

1. **Enable Google OAuth Provider:**
   - Go to your Supabase dashboard
   - Navigate to Authentication > Providers
   - Enable Google provider
   - Add your Google OAuth credentials
   - Set authorized redirect URLs:
     - `https://your-project.supabase.co/auth/v1/callback`
    - `https://your-app.netlify.app/auth/callback`

2. **Configure Site URL:**
   - Go to Authentication > Settings
   - Set Site URL to: `https://your-app.netlify.app`
   - Add redirect URLs:
    - `https://your-app.netlify.app/game-lobby-dashboard`
    - `https://your-app.netlify.app/**`

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
6. Copy Client ID and Client Secret to Supabase

### Netlify Deployment

1. Connect your repository to Netlify
2. Set environment variables in the Netlify dashboard
3. Deploy
4. Ensure `netlify.toml` handles SPA redirects

## Troubleshooting

### Favicon 404 Error
- Ensure `public/favicon.ico` exists
- Check `vite.config.js` configuration
- Verify Netlify build includes public assets

### Google OAuth "Provider not enabled" Error
- Verify Google provider is enabled in Supabase
- Check redirect URLs configuration
- Ensure environment variables are set correctly

### Build Errors
- Check Node.js version compatibility
- Verify all dependencies are installed
- Review build logs for specific errors

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in values
4. Start development server: `npm run dev`

## Production Build

```bash
npm run build
npm run preview
```

## 🙏 Acknowledgments

- Built with [Rocket.new](https://rocket.new)
- Powered by React and Vite
- Styled with Tailwind CSS

Built with ❤️ on Rocket.new