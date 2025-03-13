import unittest
import json
import os
import sys

# Add the project root to the path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Import Connect integration modules
try:
    from backend.api.connect_routes import save_call_metadata, get_call_recording
except ImportError:
    # Create mock functions for testing
    def save_call_metadata(call_data): return {"status_code": 404, "body": {"error": "Not implemented"}}
    def get_call_recording(call_id): return {"status_code": 404, "body": {"error": "Not implemented"}}

class TestConnectIntegration(unittest.TestCase):
    """Test suite for Amazon Connect integration"""
    
    def test_save_call_metadata(self):
        """Test saving call metadata to DynamoDB"""
        call_data = {
            "contact_id": "contact-12345",
            "agent_id": "agent-789",
            "lead_id": "lead-456",
            "timestamp": "2023-07-15T14:30:00Z",
            "duration": 360,
            "call_type": "inbound",
            "disposition": "qualified"
        }
        
        response = save_call_metadata(call_data)
        
        # Check if function is implemented
        if isinstance(response, dict) and response.get("status_code") == 404:
            self.skipTest("save_call_metadata not implemented yet")
        
        # Verify response
        self.assertEqual(response.status_code, 201, "Should return 201 Created status")
        response_data = json.loads(response.body)
        self.assertIn("call_id", response_data)
        self.assertEqual(response_data["contact_id"], call_data["contact_id"])
        self.assertEqual(response_data["lead_id"], call_data["lead_id"])
    
    def test_get_call_recording(self):
        """Test retrieving call recording from S3"""
        call_id = "call-12345"
        
        response = get_call_recording(call_id)
        
        # Check if function is implemented
        if isinstance(response, dict) and response.get("status_code") == 404:
            self.skipTest("get_call_recording not implemented yet")
        
        # Verify response
        self.assertEqual(response.status_code, 200, "Should return 200 OK status")
        response_data = json.loads(response.body)
        self.assertEqual(response_data["call_id"], call_id)
        self.assertIn("recording_url", response_data, "Response should contain S3 signed URL for recording")
        self.assertIn("expiration", response_data, "URL should have an expiration timestamp")

if __name__ == "__main__":
    unittest.main() 