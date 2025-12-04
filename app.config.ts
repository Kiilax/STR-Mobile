import 'dotenv/config';

export default ({ config }: { config: any }) => ({
  ...config,
  android: {
    ...config.android,
    package: "com.hermoor.strmobile",
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      },
    },
  },
});
