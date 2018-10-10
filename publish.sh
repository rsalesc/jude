#!/bin/bash

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [[ "$CURRENT_BRANCH" != *latest* ]]; then
  echo "Not in latest branch!"
  exit 1
fi

git merge master -m "PUBLISH/MERGE: generated files ($1)" -X theirs
git add -f build/ public/js/bulma/ public/js/admin/bundle.js

git commit -m "PUBLISH: generated files ($1)" --no-verify
