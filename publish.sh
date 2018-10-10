#!/bin/bash

git checkout -b latest

git merge master -m "Merge before generating files ($1)" -X theirs
git add -f build/ public/js/bulma/ public/js/admin/bundle.js

echo "Commiting generated files..."
git commit -m "Publish generated files ($1)" --no-verify
