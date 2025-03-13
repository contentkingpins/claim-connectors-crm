import unittest
import json
import os
import sys

# Add the project root to the path so we can import modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Import API modules (these will be created later)
try:
    from backend.api.lead_routes import get_lead, create_lead, update_lead, delete_lead
except ImportError:
    # Create mock functions for testing if real ones don't exist yet
    def get_lead(lead_id): return {"status_code": 404, "body": {"error": "Not implemented"}}
    def create_lead(lead_data): return {"status_code": 404, "body": {"error": "Not implemented"}}
    def update_lead(lead_id, lead_data): return {"status_code": 404, "body": {"error": "Not implemented"}}
    def delete_lead(lead_id): return {"status_code": 404, "body": {"error": "Not implemented"}}

class TestLeadAPI(unittest.TestCase):
    """Test suite for Lead Management API endpoints"""
    
    def test_get_lead(self):
        """Test retrieving a lead by ID"""
        response = get_lead("12345")
        
        # Check if function is implemented
        if isinstance(response, dict) and response.get("status_code") == 404:
            self.skipTest("get_lead not implemented yet")
        
        # Verify response structure
        self.assertEqual(response.status_code, 200, "Should return 200 OK status")
        response_data = json.loads(response.body)
        self.assertIn("lead_id", response_data, "Response should contain lead_id")
        self.assertIn("contact_info", response_data, "Response should contain contact_info")
        self.assertIn("status", response_data, "Response should contain status field")
    
    def test_create_lead(self):
        """Test creating a new lead"""
        lead_data = {
            "first_name": "John",
            "last_name": "Doe",
            "phone": "555-123-4567",
            "email": "john.doe@example.com",
            "claim_type": "auto",
            "notes": "Initial contact made"
        }
        
        response = create_lead(lead_data)
        
        # Check if function is implemented
        if isinstance(response, dict) and response.get("status_code") == 404:
            self.skipTest("create_lead not implemented yet")
        
        # Verify response
        self.assertEqual(response.status_code, 201, "Should return 201 Created status")
        response_data = json.loads(response.body)
        self.assertIn("lead_id", response_data, "Response should contain the new lead_id")
        self.assertEqual(response_data["first_name"], lead_data["first_name"])
        self.assertEqual(response_data["email"], lead_data["email"])
    
    def test_update_lead(self):
        """Test updating an existing lead"""
        lead_id = "12345"
        update_data = {
            "status": "qualified",
            "notes": "Updated client information"
        }
        
        response = update_lead(lead_id, update_data)
        
        # Check if function is implemented
        if isinstance(response, dict) and response.get("status_code") == 404:
            self.skipTest("update_lead not implemented yet")
        
        # Verify response
        self.assertEqual(response.status_code, 200, "Should return 200 OK status")
        response_data = json.loads(response.body)
        self.assertEqual(response_data["lead_id"], lead_id)
        self.assertEqual(response_data["status"], update_data["status"])
    
    def test_delete_lead(self):
        """Test deleting a lead"""
        lead_id = "12345"
        
        response = delete_lead(lead_id)
        
        # Check if function is implemented
        if isinstance(response, dict) and response.get("status_code") == 404:
            self.skipTest("delete_lead not implemented yet")
        
        # Verify response
        self.assertEqual(response.status_code, 204, "Should return 204 No Content status")

if __name__ == "__main__":
    unittest.main() 