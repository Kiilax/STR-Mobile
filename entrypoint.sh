#!/bin/sh

if [ -n "$EXPO_TOKEN" ]; then
  echo "Clearing cached credentials..."
  rm -rf ~/.expo ~/.eas-cli || true
  echo "Logging out previous user..."
  eas logout || true
  echo "Logging in with EXPO_TOKEN..."
  export EXPO_TOKEN
  echo "Checking authenticated user..."
  eas whoami || {
    echo "Failed to authenticate with EXPO_TOKEN"
    exit 1
  }
  
  if ! grep -q '"projectId"' app.json 2>/dev/null; then
    echo "Initializing EAS project..."
    eas init --non-interactive --force || {
      echo "Failed to initialize EAS project"
      exit 1
    }
  fi
fi

JSON=$(eas build --platform android --profile apk --non-interactive --json) || {
  echo "eas build failed"
  echo "$JSON"
  exit 1
}

BUILD_ID=$(echo "$JSON" | jq -r '.id // .buildId')

echo "Fetching build details for ID: $BUILD_ID"
RESULT_OUTPUT=$(eas build:view "$BUILD_ID" 2>&1)

ARTIFACT_URL=$(echo "$RESULT_OUTPUT" | grep -o 'https://[^ ]*\.apk' | head -1)

if [ -z "$ARTIFACT_URL" ]; then
    ARTIFACT_URL=$(echo "$RESULT_OUTPUT" | grep -o 'https://expo\.dev/artifacts/eas/[^ ]*' | head -1 | sed 's/"$//')
fi

ARTIFACT_URL=$(echo "$ARTIFACT_URL" | sed 's/[" ,]*$//')

if [ -z "$ARTIFACT_URL" ]; then
  echo "No artifact URL found. Raw output:"
  echo "$RESULT_OUTPUT"
  exit 1
fi

echo "Downloading APK from: $ARTIFACT_URL"
mkdir -p /output
curl -L -o /output/app.apk "$ARTIFACT_URL"

if [ $? -eq 0 ] && [ -f /output/app.apk ]; then
    echo "Download successful! APK saved to /output/app.apk"
    ls -lh /output/app.apk
    echo "File size: $(du -h /output/app.apk | cut -f1)"
    echo "File exists and is readable"
else
    echo "Download failed! Checking /output directory:"
    ls -la /output/
    exit 1
fi