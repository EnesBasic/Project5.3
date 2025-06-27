#!/bin/bash

# 1. Clean up exports
echo "export { default as MainComponent } from './MainComponent';" > src/components/schedule/index.js

# 2. Remove StoryComponent references
find src/ -type f \( -name "*.js" -o -name "*.jsx" \) -exec sed -i '/StoryComponent/d' {} \;

# 3. Verify page.jsx
echo "Current page.jsx imports:"
grep "import" src/app/page.jsx

# 4. Clear Next.js cache
rm -rf .next

echo "Cleanup complete! Try running 'npm run dev' again."