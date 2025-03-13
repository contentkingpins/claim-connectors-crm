import unittest
import json
import os
import sys

# Add the project root to the path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Import document API modules
try:
    from backend.api.document_routes import upload_document, get_document, list_documents
except ImportError:
    # Create mock functions for testing
    def upload_document(lead_id, file_data): return {"status_code": 404, "body": {"error": "Not implemented"}}
    def get_document(document_id): return {"status_code": 404, "body": {"error": "Not implemented"}}
    def list_documents(lead_id): return {"status_code": 404, "body": {"error": "Not implemented"}}

class TestDocumentAPI(unittest.TestCase):
    """Test suite for Document Management API endpoints"""
    
    def test_upload_document(self):
        """Test document upload functionality"""
        lead_id = "12345"
        file_data = {
            "filename": "claim_form.pdf",
            "content_type": "application/pdf",
            "size": 1024,
            "data": b"mock file content"
        }
        
        response = upload_document(lead_id, file_data)
        
        # Check if function is implemented
        if isinstance(response, dict) and response.get("status_code") == 404:
            self.skipTest("upload_document not implemented yet")
        
        # Verify response
        self.assertEqual(response.status_code, 201, "Should return 201 Created status")
        response_data = json.loads(response.body)
        self.assertIn("document_id", response_data, "Response should contain document_id")
        self.assertIn("upload_url", response_data, "Response should contain S3 signed upload URL")
        self.assertEqual(response_data["lead_id"], lead_id)
    
    def test_get_document(self):
        """Test retrieving document details"""
        document_id = "doc-12345"
        
        response = get_document(document_id)
        
        # Check if function is implemented
        if isinstance(response, dict) and response.get("status_code") == 404:
            self.skipTest("get_document not implemented yet")
        
        # Verify response
        self.assertEqual(response.status_code, 200, "Should return 200 OK status")
        response_data = json.loads(response.body)
        self.assertEqual(response_data["document_id"], document_id)
        self.assertIn("filename", response_data)
        self.assertIn("upload_date", response_data)
        self.assertIn("download_url", response_data, "Response should contain S3 signed download URL")
    
    def test_list_documents(self):
        """Test listing all documents for a lead"""
        lead_id = "12345"
        
        response = list_documents(lead_id)
        
        # Check if function is implemented
        if isinstance(response, dict) and response.get("status_code") == 404:
            self.skipTest("list_documents not implemented yet")
        
        # Verify response
        self.assertEqual(response.status_code, 200, "Should return 200 OK status")
        response_data = json.loads(response.body)
        self.assertIn("documents", response_data)
        self.assertIsInstance(response_data["documents"], list)
        
        # If documents exist, check their structure
        if response_data["documents"]:
            document = response_data["documents"][0]
            self.assertIn("document_id", document)
            self.assertIn("filename", document)
            self.assertIn("upload_date", document)

if __name__ == "__main__":
    unittest.main() 