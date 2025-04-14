# BYRD Travel App

A mobile application for travel agencies to share trip itineraries with their customers. Travelers can log in and view detailed information about their upcoming trips, including daily activities and important notes.

## Features

- Cross-platform (iOS and Android) mobile app
- User authentication with Supabase
- View list of upcoming trips
- Detailed trip itineraries
- Day-by-day activity breakdown
- Activity details with timing and location information

## Tech Stack

- React Native
- Expo
- TypeScript
- React Navigation
- React Native Paper (UI components)
- Supabase (authentication and database)

## Project Structure

The project follows a structured organization:

```
/src
  /screens         # App screens/pages
  /components      # Reusable UI components
  /context         # React context providers
  /hooks           # Custom React hooks
  /services        # API and service integrations
  /types           # TypeScript type definitions
  /assets          # Images, fonts, and other assets
  /navigation      # Navigation configuration
  /utils           # Utility functions
  /mockData        # Mock data for development
  /supabase        # Supabase client and related code
```

## Development

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- Supabase account

### Setup

1. Clone the repository
2. Install dependencies:
```
npm install
```
3. Set up Supabase:
   - Create a new project on [Supabase](https://supabase.com/)
   - Enable email/password authentication in the Auth settings
   - Create your database tables (or use the provided SQL setup scripts)
   - Copy your Supabase URL and anon key

4. Create a `.env` file in the root directory with your Supabase credentials:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Update the Supabase client in `src/supabase/client.ts` with your credentials.

6. Start the development server:
```
npm start
```

### Supabase Setup

To enable authentication in your Supabase project:

1. Go to Authentication > Settings
2. Enable Email provider
3. Configure any additional providers as needed (Google, Apple, etc.)
4. Set up redirects for email confirmation and password recovery

### Running on a Device

- iOS: Scan the QR code with the Camera app
- Android: Scan the QR code with the Expo Go app

## Future Enhancements

- Add more authentication providers (Google, Apple)
- Implement real-time updates for trip changes
- Add offline support
- Push notifications for trip updates
- Interactive maps for activities
- Weather information integration 