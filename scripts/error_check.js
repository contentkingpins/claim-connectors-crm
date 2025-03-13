/**
 * Error Correction Loop for Claim Connectors CRM
 * 
 * This script performs automated checks against project_rules.yaml
 * to ensure code consistency and completeness.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Load project rules
function loadProjectRules() {
  try {
    const rulesFile = fs.readFileSync(path.join(__dirname, '../project_rules.yaml'), 'utf8');
    return yaml.load(rulesFile);
  } catch (e) {
    console.error('Error loading project rules:', e);
    process.exit(1);
  }
}

// Check API endpoints against rules
function checkAPIEndpoints(rules) {
  console.log('\n🔍 CHECKING API ENDPOINTS');
  console.log('------------------------');
  
  // Get all API endpoint files
  const apiDir = path.join(__dirname, '../backend/api');
  if (!fs.existsSync(apiDir)) {
    console.log('❌ API directory not found. Backend implementation may be incomplete.');
    return false;
  }
  
  // Check for CRUD operations on leads
  const requiredEndpoints = ['create', 'read', 'update', 'delete'];
  const leadEndpoints = requiredEndpoints.filter(op => 
    fs.existsSync(path.join(apiDir, `lead-${op}.js`)) || 
    fs.existsSync(path.join(apiDir, `lead-${op}.ts`))
  );
  
  if (leadEndpoints.length < requiredEndpoints.length) {
    console.log('❌ Missing lead management endpoints:');
    requiredEndpoints.filter(ep => !leadEndpoints.includes(ep))
      .forEach(ep => console.log(`   - lead-${ep}.js/ts`));
  } else {
    console.log('✅ All lead management endpoints implemented');
  }
  
  // Check for S3 document upload endpoints
  if (!fs.existsSync(path.join(apiDir, 'document-upload.js')) && 
      !fs.existsSync(path.join(apiDir, 'document-upload.ts'))) {
    console.log('❌ Missing document upload endpoint');
  } else {
    console.log('✅ Document upload endpoint implemented');
  }
  
  return leadEndpoints.length === requiredEndpoints.length;
}

// Check UI components against rules
function checkUIComponents(rules) {
  console.log('\n🔍 CHECKING UI COMPONENTS');
  console.log('------------------------');
  
  const componentsDir = path.join(__dirname, '../frontend/src/components');
  if (!fs.existsSync(componentsDir)) {
    console.log('❌ Components directory not found. Frontend implementation may be incomplete.');
    return false;
  }
  
  // Required components based on project rules
  const requiredComponents = [
    { name: 'LeadTracking', path: 'leads' },
    { name: 'DocumentManagement', path: 'documents' },
    { name: 'Authentication', path: 'auth' }
  ];
  
  let allComponentsFound = true;
  
  for (const component of requiredComponents) {
    const componentPath = path.join(componentsDir, component.path);
    if (!fs.existsSync(componentPath)) {
      console.log(`❌ Missing ${component.name} component`);
      allComponentsFound = false;
    } else {
      console.log(`✅ ${component.name} component implemented`);
    }
  }
  
  return allComponentsFound;
}

// Check AWS service integrations
function checkAWSIntegrations(rules) {
  console.log('\n🔍 CHECKING AWS INTEGRATIONS');
  console.log('---------------------------');
  
  const configDir = path.join(__dirname, '../backend/config');
  if (!fs.existsSync(configDir)) {
    console.log('❌ Config directory not found. AWS integration may be incomplete.');
    return false;
  }
  
  // Required AWS services based on project rules
  const requiredServices = ['s3', 'dynamodb', 'lambda', 'connect'];
  
  let allServicesConfigured = true;
  
  for (const service of requiredServices) {
    const configFile = path.join(configDir, `${service}-config.js`);
    if (!fs.existsSync(configFile)) {
      console.log(`❌ Missing ${service} configuration`);
      allServicesConfigured = false;
    } else {
      console.log(`✅ ${service} configuration found`);
    }
  }
  
  return allServicesConfigured;
}

// Check coding standards
function checkCodingStandards(rules) {
  console.log('\n🔍 CHECKING CODING STANDARDS');
  console.log('---------------------------');
  
  // Check TypeScript usage in Lambda functions
  const lambdaDir = path.join(__dirname, '../backend/lambda');
  if (fs.existsSync(lambdaDir)) {
    const lambdaFiles = fs.readdirSync(lambdaDir);
    const tsFiles = lambdaFiles.filter(file => file.endsWith('.ts'));
    const jsFiles = lambdaFiles.filter(file => file.endsWith('.js'));
    
    if (jsFiles.length > 0 && tsFiles.length === 0) {
      console.log('❌ Lambda functions should use TypeScript according to coding standards');
    } else if (tsFiles.length > 0) {
      console.log('✅ Lambda functions use TypeScript as required');
    }
  }
  
  // Check React components
  const reactComponentsDir = path.join(__dirname, '../frontend/src/components');
  if (fs.existsSync(reactComponentsDir)) {
    // Recursively get all component files
    const getAllFiles = (dir) => {
      let files = [];
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const itemPath = path.join(dir, item);
        if (fs.statSync(itemPath).isDirectory()) {
          files = files.concat(getAllFiles(itemPath));
        } else if (item.endsWith('.jsx') || item.endsWith('.tsx')) {
          files.push(itemPath);
        }
      }
      
      return files;
    };
    
    const componentFiles = getAllFiles(reactComponentsDir);
    
    // Sample check for functional components (basic heuristic)
    let classComponentCount = 0;
    let functionalComponentCount = 0;
    
    for (const file of componentFiles) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('extends React.Component') || content.includes('extends Component')) {
        classComponentCount++;
      } else if (content.includes('function') && content.includes('return (')) {
        functionalComponentCount++;
      }
    }
    
    if (classComponentCount > functionalComponentCount) {
      console.log('❌ Prefer functional components with hooks over class components');
    } else if (functionalComponentCount > 0) {
      console.log('✅ React functional components are being used as required');
    }
  }
}

// Main function to run all checks
function runErrorCorrectionLoop() {
  console.log('🔄 STARTING ERROR CORRECTION LOOP');
  console.log('=================================');
  
  const rules = loadProjectRules();
  
  const apiCheck = checkAPIEndpoints(rules);
  const uiCheck = checkUIComponents(rules);
  const awsCheck = checkAWSIntegrations(rules);
  checkCodingStandards(rules);
  
  console.log('\n📊 SUMMARY');
  console.log('----------');
  console.log(`API Endpoints: ${apiCheck ? '✅ PASS' : '❌ NEEDS ATTENTION'}`);
  console.log(`UI Components: ${uiCheck ? '✅ PASS' : '❌ NEEDS ATTENTION'}`);
  console.log(`AWS Integrations: ${awsCheck ? '✅ PASS' : '❌ NEEDS ATTENTION'}`);
  
  console.log('\n💡 NEXT STEPS');
  console.log('------------');
  if (!apiCheck || !uiCheck || !awsCheck) {
    console.log('1. Address the issues highlighted above');
    console.log('2. Run this check again after making changes');
    console.log('3. Proceed to the next development phase only when all checks pass');
  } else {
    console.log('All checks passed! You can proceed to the next development phase.');
  }
}

// Run the error correction loop
runErrorCorrectionLoop(); 