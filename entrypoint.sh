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

RESULT=$(eas build:view "$BUILD_ID" --output json 2>&1)
CLEANED_RESULT=$(echo "$RESULT" | sed ':a;N;$!ba;s/\n/\\n/g' | sed 's/"/\\"/g' | tr -d '\r')

ARTIFACT_URL=$(echo "$CLEANED_RESULT" | jq -r '.artifacts.buildUrl // .artifacts.applicationArchiveUrl // empty')

if [ -z "$ARTIFACT_URL" ]; then
  echo "No artifact URL found:"
  echo "$RESULT"
  exit 1
fi

echo "Downloading APK from: $ARTIFACT_URL"
mkdir -p /output
curl -L -o /output/app.apk "$ARTIFACT_URL"