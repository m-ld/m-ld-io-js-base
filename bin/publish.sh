#!/bin/bash

VERSION=${1?:Version argument required}
BRANCH=$(git branch --no-color --show-current)

# Check the `ver` npm script exists
if ! npm run ver > /dev/null; then
  echo publish.sh requires \"ver\": \"echo \$npm_package_version\"
  exit $?
fi

# Check that non-pre-releases are on master or main
! [[ $BRANCH == 'master' || $BRANCH == 'main' ]]
NOT_MAIN=$?
! [[ $VERSION == pre* ]]
NOT_PRE=$?

if [[ $NOT_MAIN -eq $NOT_PRE ]]; then
  echo Prerelease on main or non-prerelease on non-main!
  exit 1
fi

TAG=latest
if [[ $NOT_MAIN -eq 0 ]]; then
  TAG="$BRANCH"
  PRE_ID="$BRANCH"
fi

if npm run build; then
  read -r -p "Version: $VERSION, dist-tag: $TAG, preid: ${PRE_ID:-<none>} OK? [Enter]"

  echo Bumping version
  npm version "$VERSION" --preid "$PRE_ID" --force &&
    npm publish --tag "$TAG" &&
    git push origin "v$(npm run ver -s)" &&
    git push
fi
