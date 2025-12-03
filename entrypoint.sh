#!/bin/sh
echo "DEBUG:"
pwd
ls -a
echo "END DEBUG"

echo "Using EXPO_TOKEN=${EXPO_TOKEN:+***redacted***}"

JSON=$(eas build --platform android --profile apk --non-interactive --json) || {
  echo "eas build failed"
  echo "$JSON"
  exit 1
}

BUILD_ID=$(echo "$JSON" | jq -r '.id // .buildId')
echo "Build ID: $BUILD_ID"

RESULT=$(eas build:view "$BUILD_ID" --json)
ARTIFACT_URL=$(echo "$RESULT" | jq -r '.artifacts[0].url // .artifactUrl')

if [ -z "$ARTIFACT_URL" ]; then
  echo "No artifact URL found:"
  echo "$RESULT"
  exit 1
fi

echo "Downloading APK from: $ARTIFACT_URL"
mkdir -p output
curl -L -o output/app.apk "$ARTIFACT_URL"
ls -lh output/app.apk
pwd
