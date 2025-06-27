#!/bin/bash

# Check component connections
echo "Checking component imports..."
grep -r "import.*from '@/components" src/

# Check data flow
echo -e "\nChecking props:"
grep -r "initialData=" src/
grep -r "initialOperators=" src/

# Check build errors
echo -e "\nBuilding project..."
npm run build 2>&1 | grep -i error

echo -e "\nVerification complete!"
