# AI Prompts for Error Checking and Self-Correction

Use these standardized prompts when working with AI tools on this project to ensure consistency and adherence to project rules.

## Error Correction Loop Prompt

```
Before proceeding with any new code changes, please:

1. Review the project_rules.yaml file to understand our development standards
2. Check if the current implementation is consistent with these rules
3. Identify any missing components or inconsistencies
4. Suggest specific fixes for any issues found

Specifically check:
- API endpoints for lead management (CRUD operations)
- S3 document upload functionality
- UI components for lead tracking and document management
- AWS service integrations
- Coding standards compliance
```

## Phase Transition Prompt

```
We're about to transition from [CURRENT_PHASE] to [NEXT_PHASE] in our project_rules.yaml.

Before proceeding:
1. Verify all tasks in the current phase are complete
2. Check that all "check_and_fix" items have been addressed
3. Confirm we've met all coding standards for this phase
4. Identify any potential issues that might affect the next phase
```

## Regular Checkpoint Prompt

```
We've completed approximately 3 coding iterations. Let's pause and:

1. Reload and review project_rules.yaml
2. Check our current implementation against the rules
3. Verify we're still on the correct development path
4. Identify and fix any inconsistencies before continuing
```

## Test-Driven Development Prompt

```
I need to implement [FUNCTION_NAME]. Before writing the code:

1. Review the test case in tests/[TEST_FILE].py
2. Understand the expected inputs and outputs
3. Implement the function to pass all test cases
4. Run the tests to verify the implementation works correctly

The function should follow our coding standards in project_rules.yaml.
```

## Self-Correction Prompt

```
The tests for [FUNCTION_NAME] are failing. Here's the test output:

[PASTE_TEST_OUTPUT]

Please:
1. Analyze the test failures
2. Identify what's wrong with the current implementation
3. Provide a corrected version that will pass the tests
4. Explain what was fixed and why

Remember to follow our coding standards from project_rules.yaml.
``` 