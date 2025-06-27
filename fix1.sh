#!/bin/bash

# Fix CalHeader import
sed -i 's/@\/components\/CalHeader/@\/components\/cal-header/g' src/components/schedule/MainComponent.jsx

# Fix CalFooter import
sed -i 's/@\/components\/CalFooter/@\/components\/cal-footer/g' src/components/schedule/MainComponent.jsx

# Verify the files exist
echo "Checking if component files exist:"
ls -la src/components/cal-header.jsx src/components/cal-footer.jsx

echo "Imports fixed successfully!"