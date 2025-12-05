#!/bin/sh

# JSON=$(eas build --platform android --profile apk --non-interactive --json) || {
#   echo "eas build failed"
#   echo "$JSON"
#   exit 1
# }

# BUILD_ID=$(echo "$JSON" | jq -r '.id // .buildId')

# RESULT=$(eas build:view "$BUILD_ID" --json)
# ARTIFACT_URL=$(echo "$RESULT" | jq -r '.artifacts.buildUrl // .artifacts.applicationArchiveUrl // empty')

# if [ -z "$ARTIFACT_URL" ]; then
#   echo "No artifact URL found:"
#   echo "$RESULT"
#   exit 1
# fi

$ARTIFACT_URL="https://expo.dev/artifacts/eas/mbAtaEwYYCgoSJ5DGBkdjn.apk"

echo "Downloading APK from: $ARTIFACT_URL"
mkdir -p /output
curl -L -o /output/app.apk "$ARTIFACT_URL"