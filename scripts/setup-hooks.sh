#!/bin/bash

# Create pre-commit hook to run error checking and tests
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

echo "🔍 Running error correction check before commit..."
node scripts/error_check.js

# Check if there were any errors
if [ $? -ne 0 ]; then
  echo "❌ Error check failed. Please fix issues before committing."
  exit 1
fi

echo "🧪 Running tests before commit..."
python tests/run_tests.py

# Check if tests passed
if [ $? -ne 0 ]; then
  echo "❌ Tests failed. Please fix failing tests before committing."
  exit 1
fi

# Continue with commit
echo "✅ All checks passed. Proceeding with commit."
exit 0
EOF

# Make the hook executable
chmod +x .git/hooks/pre-commit

echo "✅ Git hooks installed successfully!" 