# BYRD Travel App

A mobile application for travel agencies to share trip itineraries with their customers. Travelers can log in and view detailed information about their upcoming trips, including daily activities and important notes.

## Features

- Cross-platform (iOS and Android) mobile app
- User authentication (to be implemented with Supabase)
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
- Supabase (to be implemented later for authentication and database)

## Project Structure

The project follows a structured organization:

```
/src
  /screens         # App screens/pages
  /components      # Reusable UI components
  /hooks           # Custom React hooks
  /services        # API and service integrations
  /types           # TypeScript type definitions
  /assets          # Images, fonts, and other assets
  /navigation      # Navigation configuration
  /utils           # Utility functions
  /mockData        # Mock data for development
```

## Development

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI

### Setup

1. Clone the repository
2. Install dependencies:
```
npm install
```
3. Start the development server:
```
npm start
```

### Running on a Device

- iOS: Scan the QR code with the Camera app
- Android: Scan the QR code with the Expo Go app

## Future Enhancements

- Implement Supabase authentication
- Connect to a real backend API
- Add offline support
- Push notifications for trip updates
- Interactive maps for activities
- Weather information integration 