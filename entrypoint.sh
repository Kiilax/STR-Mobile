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

RESULT=$(eas build:view "$BUILD_ID" --json 2>&1)

if echo "$RESULT" | jq empty >/dev/null 2>&1; then
    ARTIFACT_URL=$(echo "$RESULT" | jq -r '.artifacts.buildUrl // .artifacts.applicationArchiveUrl // empty')
else
    echo "Warning: JSON parsing failed, trying alternative extraction method..."
    ARTIFACT_URL=$(echo "$RESULT" | grep -o '"buildUrl":"[^"]*"' | head -1 | sed 's/"buildUrl":"\([^"]*\)"/\1/')
    
    if [ -z "$ARTIFACT_URL" ]; then
        ARTIFACT_URL=$(echo "$RESULT" | grep -o '"applicationArchiveUrl":"[^"]*"' | head -1 | sed 's/"applicationArchiveUrl":"\([^"]*\)"/\1/')
    fi
fi

if [ -z "$ARTIFACT_URL" ]; then
  echo "No artifact URL found. Raw output:"
  echo "$RESULT"
  exit 1
fi

echo "Downloading APK from: $ARTIFACT_URL"
mkdir -p /output
curl -L -o /output/app.apk "$ARTIFACT_URL"