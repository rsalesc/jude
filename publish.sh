#!/bin/bash

git checkout -b tmp/publish

git merge master -m "Merge before generating files ($1)" -X theirs

git add -f build/ public/js/bulma/ public/js/admin/bundle.js

echo "Commiting generated files..."
git commit -m "Publish generated files ($1)" --no-verify

if git ls-remote origin | grep -sw "tmp/publish" 2>&1>/dev/null; then
  git checkout -b latest
  git pull origin latest
else
  git checkout -b latest
  git push origin latest
fi

git merge tmp/publish -m "Merge generated files into latest ($!)" -X theirs
git push origin latest -f

git checkout master
git branch -D tmp/publish
