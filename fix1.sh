#!/bin/bash

# Fix CalHeader case sensitivity issue
echo "Fixing CalHeader component..."
mv src/components/cal-header.jsx src/components/CalHeader.jsx

# Update imports in all files (case-insensitive search)
find src -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.tsx" \) \
  -exec sed -i 's/cal-header/CalHeader/gI' {} \;
find src -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.tsx" \) \
  -exec sed -i 's/from ".\?\/components\/cal-header/from "@\/components\/CalHeader/gI' {} \;

# Create a standard CalHeader component if it doesn't exist
if [ ! -f "src/components/CalHeader.jsx" ]; then
  echo "Creating standard CalHeader component..."
  cat > src/components/CalHeader.jsx << 'EOL'
import React from 'react';

const CalHeader = () => {
  return (
    <header className="cal-header">
      {/* Your header content here */}
      <h1>Calendar Header</h1>
    </header>
  );
};

export default CalHeader;
EOL
fi

# Organize bin-bin components into subfolder
echo "Organizing bin-bin components..."
mkdir -p src/components/bin-bin
mv src/components/bin-bin-*.jsx src/components/bin-bin/

# Update imports for moved bin-bin components
find src -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.tsx" \) \
  -exec sed -i 's/from ".\?\/components\/bin-bin-/from "@\/components\/bin-bin\//g' {} \;

# Clear Next.js cache
echo "Clearing Next.js cache..."
rm -rf .next

# Rebuild the project
echo "Rebuilding project..."
npm run build

echo "All fixes applied successfully!"
