#!/usr/bin/env bash

set -euo pipefail

BRANCH="${GITHUB_REF_NAME:-}"
EVENT="${GITHUB_EVENT_NAME:-}"

echo "Branch: ${BRANCH:-unknown}, Event: ${EVENT:-unknown}"

if [[ "${EVENT}" != "workflow_dispatch" ]] \
   && [[ "${BRANCH}" != "main" ]] \
   && [[ "${BRANCH}" != "dev" ]] \
   && [[ "${BRANCH}" != "project-foundation" ]]; then
  echo "Skipping Maestro tests for branch ${BRANCH}"
  exit 0
fi

APK_PATH="android/app/build/outputs/apk/release/app-release.apk"
if [[ ! -f "${APK_PATH}" ]]; then
  echo "Error: APK not found at ${APK_PATH}"
  exit 1
fi

adb install -r "${APK_PATH}"
sleep 5

TEST_EMAIL="auth-bot+${GITHUB_RUN_ID:-0}-${GITHUB_RUN_ATTEMPT:-0}@example.com"
TEST_USER="authBotUser${GITHUB_RUN_ID:-0}"
TEST_PASSWORD="${MAESTRO_TEST_PASSWORD:-AuthBotTest123!}"

export TEST_EMAIL TEST_USER TEST_PASSWORD

TEST_SUITE="${TEST_SUITE:-}"

run_flow() {
  local flow_path="$1"
  local output_file="$2"
  local label="$3"

  if ! maestro test "${flow_path}" --format junit --output "${output_file}"; then
    echo "${label} flow failed"
  fi
}

if [[ "${TEST_SUITE}" == "auth" ]] \
   || [[ "${TEST_SUITE}" == "all" ]] \
   || [[ -z "${TEST_SUITE}" ]]; then
  run_flow .maestro/flows/auth/register.yaml maestro-android-register.xml "Register"
  run_flow .maestro/flows/auth/oauth-google.yaml maestro-android-oauth-google.xml "OAuth Google"
  run_flow .maestro/flows/auth/oauth-wechat.yaml maestro-android-oauth-wechat.xml "OAuth WeChat"
fi

if ! ls maestro-android-*.xml >/dev/null 2>&1; then
  echo '<?xml version="1.0"?><testsuites></testsuites>' > maestro-android-empty.xml
fi

