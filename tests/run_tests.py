#!/usr/bin/env python3
"""
Test Runner for Claim Connectors CRM
This script runs all tests and provides a summary of results
"""

import unittest
import sys
import os
import yaml
import importlib.util
from termcolor import colored

def load_project_rules():
    """Load the project rules from YAML file"""
    try:
        with open('project_rules.yaml', 'r') as file:
            return yaml.safe_load(file)
    except Exception as e:
        print(f"Error loading project rules: {e}")
        return {}

def discover_and_run_tests():
    """Discover and run all tests in the tests directory"""
    loader = unittest.TestLoader()
    start_dir = os.path.dirname(os.path.abspath(__file__))
    suite = loader.discover(start_dir, pattern="test_*.py")
    
    # Run tests with detailed output
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    return result

def check_implementation_status(rules):
    """Check implementation status against project rules"""
    print("\n" + "="*80)
    print(colored("IMPLEMENTATION STATUS CHECK", "cyan", attrs=["bold"]))
    print("="*80)
    
    # Check backend API endpoints
    print("\nBackend API Implementation:")
    api_modules = {
        "Lead Management": ["get_lead", "create_lead", "update_lead", "delete_lead"],
        "Document Management": ["upload_document", "get_document", "list_documents"],
        "Connect Integration": ["save_call_metadata", "get_call_recording"]
    }
    
    for module, functions in api_modules.items():
        print(f"\n{module}:")
        for func in functions:
            # Try to import the function
            try:
                # This is a simplified check - in a real project you'd have proper imports
                if func in globals():
                    status = colored("✓ Implemented", "green")
                else:
                    # Try to find the module that might contain this function
                    found = False
                    for root, dirs, files in os.walk("backend/api"):
                        for file in files:
                            if file.endswith(".py"):
                                module_path = os.path.join(root, file)
                                module_name = os.path.splitext(os.path.basename(module_path))[0]
                                spec = importlib.util.spec_from_file_location(module_name, module_path)
                                if spec:
                                    module = importlib.util.module_from_spec(spec)
                                    spec.loader.exec_module(module)
                                    if hasattr(module, func):
                                        found = True
                                        break
                    
                    status = colored("✓ Implemented", "green") if found else colored("✗ Not implemented", "red")
            except:
                status = colored("✗ Not implemented", "red")
            
            print(f"  - {func}: {status}")

def print_summary(test_result):
    """Print a summary of test results"""
    print("\n" + "="*80)
    print(colored("TEST SUMMARY", "yellow", attrs=["bold"]))
    print("="*80)
    
    total = test_result.testsRun
    failures = len(test_result.failures)
    errors = len(test_result.errors)
    skipped = len(test_result.skipped)
    passed = total - failures - errors - skipped
    
    print(f"\nTotal tests: {total}")
    print(f"Passed: {colored(passed, 'green')}")
    print(f"Failed: {colored(failures, 'red')}")
    print(f"Errors: {colored(errors, 'red')}")
    print(f"Skipped: {colored(skipped, 'yellow')} (Not implemented yet)")
    
    # Calculate implementation percentage
    if total > 0:
        implemented_pct = (passed + failures + errors) / total * 100
        print(f"\nImplementation progress: {implemented_pct:.1f}%")
    
    # Print next steps
    print("\n" + "="*80)
    print(colored("NEXT STEPS", "cyan", attrs=["bold"]))
    print("="*80)
    
    if failures > 0 or errors > 0:
        print("\n1. Fix failing tests before proceeding")
        print("2. Implement skipped functionality")
    elif skipped > 0:
        print("\n1. Implement missing functionality")
        print("2. Run tests again to verify implementation")
    else:
        print("\nAll tests passing! You can proceed to the next development phase.")

if __name__ == "__main__":
    # Load project rules
    rules = load_project_rules()
    
    # Run all tests
    print("\n" + "="*80)
    print(colored("RUNNING TESTS", "green", attrs=["bold"]))
    print("="*80 + "\n")
    
    result = discover_and_run_tests()
    
    # Check implementation status
    check_implementation_status(rules)
    
    # Print summary
    print_summary(result)
    
    # Return appropriate exit code
    sys.exit(len(result.failures) + len(result.errors)) 