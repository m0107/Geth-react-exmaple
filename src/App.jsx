/* eslint-disable */
import React, { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const sdkRef = useRef(null);
  useEffect(() => {
    console.log("process.env.REACT_APP_RPC_URL", process.env);
    console.log("window.BlockchainSDK:", window.BlockchainSDK);
    if (!sdkRef.current) {
      sdkRef.current = new window.BlockchainSDK.default(
        process.env.REACT_APP_RPC_URL,
        process.env.REACT_APP_OTP_ORACLE_PUBLIC_KEY,
        process.env.REACT_APP_IPFS_URL,
        process.env.REACT_APP_BLC_API_BASE,
        process.env.REACT_APP_BLC_FUND_API_BASE,
        process.env.REACT_APP_ENT_API_BASE,
        process.env.REACT_APP_ENT_USERNAME,
        process.env.REACT_APP_ENT_PASSWORD,
        process.env.REACT_APP_DIGILOCKER_API_BASE
      );
      console.log("SDK initialized:", sdkRef.current);
    }
  }, []);
  const sdk = sdkRef.current;
  console.log("SDK instance:", process.env);
  console.log("process.BLC_FUND_API_BASE", process.env.REACT_APP_BLC_FUND_API_BASE, process.env.REACT_APP_RPC_URL)

  const [mainStatus, setMainStatus] = useState({
    type: "info",
    text: "Environment: Geth PoA on localhost, IPFS at remote node",
  });
  function showStatus(type, text) {
    setMainStatus({ type, text });
    alert(text.replace(/<[^>]+>/g, ""));
  }

  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [showUserSection, setShowUserSection] = useState(false);
  const [showUpdateUserForm, setShowUpdateUserForm] = useState(false);
  const [showLoanSection, setShowLoanSection] = useState(false);
  const [showFileSection, setShowFileSection] = useState(false);
  const [showAdminSection, setShowAdminSection] = useState(false);

  const [aadhaar, setAadhaar] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newData, setNewData] = useState('{"department":"Finance"}');

  const [userInfo, setUserInfo] = useState(null);
  const [updData, setUpdData] = useState("");
  const [allUsers, setAllUsers] = useState([]);

  const [loanId, setLoanId] = useState("");
  const [loanDetails, setLoanDetails] = useState(
    '{"amount":1000,"term":"12 months"}'
  );
  const [loanList, setLoanList] = useState([]);
  const [updLoanId, setUpdLoanId] = useState("");
  const [updLoanData, setUpdLoanData] = useState("");
  const [showUpdateLoanForm, setShowUpdateLoanForm] = useState(false);

  const fileInputRef = useRef(null);
  const [fileMeta, setFileMeta] = useState("report.pdf");
  const [fileList, setFileList] = useState([]);

  const [adminAadhaar, setAdminAadhaar] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [adminData, setAdminData] = useState('{"department":"Admin"}');
  // const [adminPrivateKey, setAdminPrivateKey] = useState("");

  // Function Role Assignment states
  const [selectedRole, setSelectedRole] = useState("ADMIN_ROLE");
  const [selectedFunction, setSelectedFunction] = useState("");
  const [showFunctionRoleSection, setShowFunctionRoleSection] = useState(false);
  
  // Role Members states
  const [roleMembers, setRoleMembers] = useState({});
  const [showRoleMembersSection, setShowRoleMembersSection] = useState(false);
  
  // Role Functions states
  const [roleFunctions, setRoleFunctions] = useState({});
  const [showRoleFunctionsSection, setShowRoleFunctionsSection] = useState(false);

  const [initialized, setInitialized] = useState(false);

  // Available functions with their signatures (Blockchain Contract Functions)
  const availableFunctions = [
    { name: "Create User", signature: "createUser(bytes32,string,string)" },
    { name: "Update User", signature: "updateUser(bytes32,string)" },
    { name: "Get User", signature: "getUser(bytes32)" },
    { name: "Get All Users", signature: "getAllUsers()" },
    { name: "Create Loan", signature: "createLoan(bytes32,bytes32,string)" },
    { name: "Update Loan", signature: "updateLoan(bytes32,string)" },
    { name: "Get Loan By ID", signature: "getLoanByLoanId(bytes32)" },
    { name: "Get All Loans By User", signature: "getAllLoansByUser(bytes32)" },
    { name: "Upload File", signature: "uploadFile(bytes,bytes32,string,string)" },
    { name: "Read File", signature: "readFile(string,address)" },
    { name: "Get All Files For User", signature: "getAllFilesForUser(bytes32)" },
    { name: "Get All Files By Type", signature: "getAllFilesByType(string)" },
    { name: "Create Role", signature: "createRole(bytes32,bytes32)" },
    { name: "Grant Role", signature: "grantRole(bytes32,address)" },
    { name: "Revoke Role", signature: "revokeRole(bytes32,address)" },
    { name: "Has Role", signature: "hasRole(bytes32,address)" },
    { name: "Get Role Members", signature: "getRoleMembers(bytes32)" },
    { name: "Get Functions By Role", signature: "getFunctionsByRole(bytes32)" },
    { name: "Register Public Key", signature: "registerPublicKey(address,string)" },
    { name: "Get User Public Key", signature: "getUserPublicKey(bytes32)" },
    { name: "Request OTP", signature: "requestOtp(bytes32)" },
    { name: "Submit OTP", signature: "submitOtp(bytes32,string,address)" },
    { name: "Fund Account", signature: "fundAccount(address,uint256)" },
    { name: "Create Default Admin", signature: "createDefaultAdmin(bytes32,string,string)" }
  ];

  // Note: These are example roles - actual roles should be fetched from your smart contract
  const availableRoles = [
    "DEFAULT_ADMIN_ROLE",
    "ADMIN_ROLE",
    "USER_ROLE", 
    "LOAN_OFFICER_ROLE",
    "AUDITOR_ROLE",
    "MANAGER_ROLE"
  ];

  const handleInit = async () => {
    if (!/^\d{12}$/.test(aadhaar)) {
      return alert("Enter 12-digit Aadhaar");
    }
    let userData = null;
    if (isNewUser) {
      try {
        userData = {
          name: newName.trim(),
          email: newEmail.trim(),
          phone: newPhone.trim(),
          additionalData: JSON.parse(newData),
        };
      } catch (err) {
        return showStatus("error", "Invalid JSON in Additional Data");
      }
    }
    // showStatus("info", "Initializing SDK...");
    try {
      await sdk.init(aadhaar, isNewUser, userData);
      showStatus("success", `SDK ready for Aadhaar ${aadhaar}`);
      setInitialized(true);
      setShowUserSection(true);
      setShowLoanSection(true);
      setShowFileSection(true);
      setShowAdminSection(true);
      setShowFunctionRoleSection(true);
      setShowRoleMembersSection(true);
      setShowRoleFunctionsSection(true);
      await loadUser();
    } catch (e) {
      console.error(e);
      showStatus("error", "Init failed: " + e.message);
    }
  };

  const loadUser = async () => {
    const hash = sdk.web3.utils.keccak256(aadhaar);
    try {
      const user = await sdk.getUser(hash);
      setUserInfo(user);
      showStatus("success", "User loaded");
    } catch (e) {
      console.error(e);
      showStatus("error", "getUser failed: " + e.message);
    }
  };

  const handleGetAllUsers = async () => {
    try {
      showStatus("info", "Fetching all users...");
      const users = await sdk.getAllUsers();
      setAllUsers(users);
      showStatus("success", `Retrieved ${users.length} users`);
    } catch (e) {
      console.error(e);
      showStatus("error", "Failed to get all users: " + e.message);
    }
  };

  const handleUpdateUser = async () => {
    const hash = sdk.web3.utils.keccak256(aadhaar);
    try {
      await sdk.updateUser(hash, updData.trim());
      showStatus("success", "User updated");
      setShowUpdateUserForm(false);
      await loadUser();
    } catch (e) {
      console.error(e);
      showStatus("error", "updateUser failed: " + e.message);
    }
  };

  const handleCreateLoan = async () => {
    const ah = sdk.web3.utils.keccak256(aadhaar);
    const lid = sdk.web3.utils.keccak256(loanId.trim());
    try {
      await sdk.createLoan(lid, ah, loanDetails.trim());
      showStatus("success", "Loan created");
    } catch (e) {
      console.error(e);
      showStatus("error", "createLoan failed: " + e.message);
    }
  };

  const handleListLoans = async () => {
    const ah = sdk.web3.utils.keccak256(aadhaar);
    try {
      const loans = await sdk.getAllLoansByUser(ah);
      setLoanList(loans);
      showStatus("success", "Loans listed");
    } catch (e) {
      console.error(e);
      showStatus("error", "getAllLoans failed: " + e.message);
    }
  };

  const handleUpdateLoan = async () => {
    const lid = sdk.web3.utils.keccak256(updLoanId.trim());
    try {
      await sdk.updateLoan(lid, updLoanData.trim());
      showStatus("success", "Loan updated");
      setShowUpdateLoanForm(false);
      await handleListLoans();
    } catch (e) {
      console.error(e);
      showStatus("error", "updateLoan failed: " + e.message);
    }
  };

  const handleUploadFile = async () => {
    const ah = sdk.web3.utils.keccak256(aadhaar);
    const file = fileInputRef.current.files[0];
    if (!file) return alert("Pick a file");
    try {
      const buf = new Uint8Array(await file.arrayBuffer());
      if (buf.length > 1000000) return alert("File too large, max 1MB");
      if (buf.length === 0) return alert("File is empty");
      if (!fileMeta.trim()) return alert("Enter file metadata");

      showStatus("info", "Uploading file to IPFS...");
      const { cid } = await sdk.uploadFile(buf, ah, "User", fileMeta.trim());
      showStatus("success", `Uploaded: ${cid}`);
    } catch (e) {
      console.error(e);
      showStatus("error", "uploadFile failed: " + e.message);
    }
  };

  const handleListFiles = async () => {
    const ah = sdk.web3.utils.keccak256(aadhaar);
    try {
      const files = await sdk.getAllFilesForUser(ah);
      setFileList(files);
      showStatus("success", "Files listed");
    } catch (e) {
      console.error(e);
      showStatus("error", "getAllFiles failed: " + e.message);
    }
  };

  const handleDownloadFile = async (fileData) => {
    try {
      // fileData structure: [cid, aadhaarHash, fileType, metadata]
      const [cid, , , filename] = fileData;
      
      showStatus("info", `Downloading ${filename}...`);
      
      // Use SDK's readFile method to download and decrypt the file
      const fileBuffer = await sdk.readFile(cid);
      
      // Create a blob and download link
      const blob = new Blob([fileBuffer]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `file_${cid.slice(0, 8)}.bin`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showStatus("success", `Downloaded ${filename} successfully`);
    } catch (e) {
      console.error(e);
      showStatus("error", "Download failed: " + e.message);
    }
  };

  const handleAdminCreateUser = async () => {
    if (!/^\d{12}$/.test(adminAadhaar)) {
      return showStatus("error", "Enter valid 12-digit Aadhaar");
    }
    
    try {
      const userData = {
        name: adminName.trim(),
        email: adminEmail.trim(),
        phone: adminPhone.trim(),
        additionalData: JSON.parse(adminData),
      };
      
      const result = await sdk.createNewUser(
        adminAadhaar,
        JSON.stringify(userData)
      );
      
      showStatus("success", "Admin user created successfully");
    } catch (e) {
      console.error(e);
      if (e.message.includes("JSON")) {
        showStatus("error", "Invalid JSON in Additional Data");
      } else {
        showStatus("error", "Admin user creation failed: " + e.message);
      }
    }
  };

  const handleAssignFunctionRole = async () => {
    if (!selectedRole || !selectedFunction) {
      return showStatus("error", "Please select both role and function");
    }
    
    try {
      showStatus("info", `Assigning ${selectedRole} to function ${selectedFunction}...`);
      await sdk.assignFunctionRolesFor(selectedRole, selectedFunction);
      showStatus("success", `Successfully assigned ${selectedRole} to ${selectedFunction}`);
    } catch (e) {
      console.error(e);
      showStatus("error", "Function role assignment failed: " + e.message);
    }
  };

  const handleGetRoleMembers = async (role) => {
    try {
      showStatus("info", `Fetching members for ${role}...`);
      // Convert role name to hash as the contract expects bytes32
      const roleHash = sdk.web3.utils.keccak256(role);
      const members = await sdk._call("RBACManager", "getRoleMembers", [roleHash]);
      setRoleMembers(prev => ({ ...prev, [role]: members }));
      showStatus("success", `Retrieved ${members.length} members for ${role}`);
    } catch (e) {
      console.error(e);
      showStatus("error", `Failed to get members for ${role}: ` + e.message);
    }
  };

  const handleGetAllRoleMembers = async () => {
    try {
      showStatus("info", "Fetching members for all roles...");
      const allMembers = {};
      
      for (const role of availableRoles) {
        try {
          // Convert role name to hash as the contract expects bytes32
          const roleHash = sdk.web3.utils.keccak256(role);
          const members = await sdk._call("RBACManager", "getRoleMembers", [roleHash]);
          allMembers[role] = members;
        } catch (e) {
          console.warn(`Failed to get members for ${role}:`, e.message);
          allMembers[role] = { error: e.message };
        }
      }
      
      setRoleMembers(allMembers);
      showStatus("success", "Retrieved role members for all roles");
    } catch (e) {
      console.error(e);
      showStatus("error", "Failed to get role members: " + e.message);
    }
  };

  const handleGetRoleFunctions = async (role) => {
    try {
      showStatus("info", `Fetching functions for ${role}...`);
      // Convert role name to hash as the contract expects bytes32
      const roleHash = sdk.web3.utils.keccak256(role);
      const functionSelectors = await sdk._call("RBACManager", "getFunctionsByRole", [roleHash]);
      
      // Convert function selectors back to readable function signatures
      const functions = functionSelectors.map(selector => {
        // Find matching function from our available functions list
        const matchingFunc = availableFunctions.find(func => {
          const computedSelector = sdk.web3.utils.keccak256(func.signature).slice(0, 10);
          return computedSelector.toLowerCase() === selector.toLowerCase();
        });
        return matchingFunc ? matchingFunc : { name: "Unknown", signature: selector };
      });
      
      setRoleFunctions(prev => ({ ...prev, [role]: functions }));
      showStatus("success", `Retrieved ${functions.length} functions for ${role}`);
    } catch (e) {
      console.error(e);
      showStatus("error", `Failed to get functions for ${role}: ` + e.message);
    }
  };

  const handleGetAllRoleFunctions = async () => {
    try {
      showStatus("info", "Fetching functions for all roles...");
      const allFunctions = {};
      
      for (const role of availableRoles) {
        try {
          // Convert role name to hash as the contract expects bytes32
          const roleHash = sdk.web3.utils.keccak256(role);
          const functionSelectors = await sdk._call("RBACManager", "getFunctionsByRole", [roleHash]);
          
          // Convert function selectors back to readable function signatures
          const functions = functionSelectors.map(selector => {
            const matchingFunc = availableFunctions.find(func => {
              const computedSelector = sdk.web3.utils.keccak256(func.signature).slice(0, 10);
              return computedSelector.toLowerCase() === selector.toLowerCase();
            });
            return matchingFunc ? matchingFunc : { name: "Unknown", signature: selector };
          });
          
          allFunctions[role] = functions;
        } catch (e) {
          console.warn(`Failed to get functions for ${role}:`, e.message);
          allFunctions[role] = { error: e.message };
        }
      }
      
      setRoleFunctions(allFunctions);
      showStatus("success", "Retrieved functions for all roles");
    } catch (e) {
      console.error(e);
      showStatus("error", "Failed to get role functions: " + e.message);
    }
  };

  return (
    <div className="container">
      <h1>🔐 BlockchainSDK Full Test Suite</h1>

      <div className={`status ${mainStatus.type}`}>
        <strong>Environment:</strong> {mainStatus.text}
      </div>

      {/* SDK Functions Documentation */}
      <section style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h2>📚 Available SDK Functions</h2>
        <details>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '1rem' }}>
            Click to view all SDK functions, limitations, and sample usage
          </summary>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
            
            {/* Authentication & Initialization */}
            <div style={{ border: '1px solid #dee2e6', borderRadius: '6px', padding: '1rem', backgroundColor: 'white' }}>
              <h3 style={{ color: '#0066cc', marginTop: 0 }}>🔐 Authentication & Initialization</h3>
              
              <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
                <strong>init(aadhaar, isNewUser, userData)</strong>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>Purpose:</strong> Initialize SDK with Aadhaar validation
                  <br /><strong>Limitations:</strong> Requires 12-digit Aadhaar, network connectivity
                  <br /><strong>Sample:</strong> <code>await sdk.init("123412341234", false)</code>
                </p>
              </div>

              <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
                <strong>requestOtp(aadhaar)</strong>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>Purpose:</strong> Request OTP for new user registration
                  <br /><strong>Limitations:</strong> Requires on-chain gas fees
                  <br /><strong>Sample:</strong> <code>const requestId = await sdk.requestOtp("123412341234")</code>
                </p>
              </div>

              <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
                <strong>submitOtp(requestId, otp, userAddress)</strong>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>Purpose:</strong> Verify OTP and complete registration
                  <br /><strong>Limitations:</strong> OTP expires, one-time use
                  <br /><strong>Sample:</strong> <code>await sdk.submitOtp(requestId, "123456", userAddress)</code>
                </p>
              </div>
            </div>

            {/* User Management */}
            <div style={{ border: '1px solid #dee2e6', borderRadius: '6px', padding: '1rem', backgroundColor: 'white' }}>
              <h3 style={{ color: '#28a745', marginTop: 0 }}>👤 User Management</h3>
              
              <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
                <strong>createUser(aadhaarHash, dataJson)</strong>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>Purpose:</strong> Create new user on blockchain
                  <br /><strong>Limitations:</strong> Must call init() first, gas fees required
                  <br /><strong>Sample:</strong> <code>await sdk.createUser(hash, JSON.stringify(userData))</code>
                </p>
              </div>

              <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
                <strong>getUser(aadhaarHash)</strong>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>Purpose:</strong> Retrieve user information
                  <br /><strong>Limitations:</strong> Requires proper access permissions
                  <br /><strong>Sample:</strong> <code>const user = await sdk.getUser(aadhaarHash)</code>
                </p>
              </div>

              <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
                <strong>updateUser(aadhaarHash, newDataJson)</strong>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>Purpose:</strong> Update existing user data
                  <br /><strong>Limitations:</strong> Only user or admin can update
                  <br /><strong>Sample:</strong> <code>await sdk.updateUser(hash, JSON.stringify(newData))</code>
                </p>
              </div>

              <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#f8d7da', borderRadius: '4px' }}>
                <strong>getAllUsers()</strong>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>Purpose:</strong> Get list of all users
                  <br /><strong>Limitations:</strong> Admin access only
                  <br /><strong>Sample:</strong> <code>const users = await sdk.getAllUsers()</code>
                </p>
              </div>
            </div>

            {/* File Management */}
            <div style={{ border: '1px solid #dee2e6', borderRadius: '6px', padding: '1rem', backgroundColor: 'white' }}>
              <h3 style={{ color: '#fd7e14', marginTop: 0 }}>📁 File Management</h3>
              
              <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
                <strong>uploadFile(buffer, aadhaarHash, fileType, metadata)</strong>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>Purpose:</strong> Upload file to IPFS with encryption
                  <br /><strong>Limitations:</strong> Max 1MB, fileType must be "User" or "Loan"
                  <br /><strong>Sample:</strong> <code>await sdk.uploadFile(buffer, hash, "User", "report.pdf")</code>
                </p>
              </div>

              <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
                <strong>readFile(cid, userAddr)</strong>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>Purpose:</strong> Download and decrypt file from IPFS
                  <br /><strong>Limitations:</strong> Requires file access permissions
                  <br /><strong>Sample:</strong> <code>const fileBuffer = await sdk.readFile(cid)</code>
                </p>
              </div>

              <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
                <strong>getAllFilesForUser(aadhaarHash)</strong>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>Purpose:</strong> List all files for a specific user
                  <br /><strong>Limitations:</strong> User must have access rights
                  <br /><strong>Sample:</strong> <code>const files = await sdk.getAllFilesForUser(hash)</code>
                </p>
              </div>

              <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#f8d7da', borderRadius: '4px' }}>
                <strong>getAllFilesByType(fileType)</strong>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>Purpose:</strong> Get all files of specific type
                  <br /><strong>Limitations:</strong> Admin access only
                  <br /><strong>Sample:</strong> <code>const files = await sdk.getAllFilesByType("User")</code>
                </p>
              </div>
            </div>

            {/* Loan Management */}
            <div style={{ border: '1px solid #dee2e6', borderRadius: '6px', padding: '1rem', backgroundColor: 'white' }}>
              <h3 style={{ color: '#dc3545', marginTop: 0 }}>💰 Loan Management</h3>
              
              <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
                <strong>createLoan(loanIdHash, userAadhaarHash, loanDetailsJson)</strong>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>Purpose:</strong> Create new loan record
                  <br /><strong>Limitations:</strong> Unique loan ID required, gas fees
                  <br /><strong>Sample:</strong> <code>await sdk.createLoan(loanHash, userHash, JSON.stringify(details))</code>
                </p>
              </div>

              <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
                <strong>getLoanByLoanId(loanIdHash)</strong>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>Purpose:</strong> Retrieve specific loan details
                  <br /><strong>Limitations:</strong> Requires loan access permissions
                  <br /><strong>Sample:</strong> <code>const loan = await sdk.getLoanByLoanId(loanHash)</code>
                </p>
              </div>

              <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
                <strong>updateLoan(loanIdHash, newDataJson)</strong>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>Purpose:</strong> Update loan information
                  <br /><strong>Limitations:</strong> Only authorized users can update
                  <br /><strong>Sample:</strong> <code>await sdk.updateLoan(loanHash, JSON.stringify(newData))</code>
                </p>
              </div>

              <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#f8d7da', borderRadius: '4px' }}>
                <strong>getAllLoansByUser(userAadhaarHash)</strong>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>Purpose:</strong> Get all loans for a user
                  <br /><strong>Limitations:</strong> User or authorized personnel only
                  <br /><strong>Sample:</strong> <code>const loans = await sdk.getAllLoansByUser(userHash)</code>
                </p>
              </div>
            </div>

            {/* Role-Based Access Control */}
            <div style={{ border: '1px solid #dee2e6', borderRadius: '6px', padding: '1rem', backgroundColor: 'white' }}>
              <h3 style={{ color: '#6f42c1', marginTop: 0 }}>🔒 Role & Access Management</h3>
              
              <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
                <strong>createRole(roleName, adminRoleName)</strong>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>Purpose:</strong> Create new role in system
                  <br /><strong>Limitations:</strong> Admin privileges required
                  <br /><strong>Sample:</strong> <code>await sdk.createRole("LOAN_OFFICER", "ADMIN")</code>
                </p>
              </div>

              <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
                <strong>grantRole(roleName, address)</strong>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>Purpose:</strong> Assign role to user address
                  <br /><strong>Limitations:</strong> Role admin or system admin only
                  <br /><strong>Sample:</strong> <code>await sdk.grantRole("USER_ROLE", userAddress)</code>
                </p>
              </div>

              <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
                <strong>revokeRole(roleName, address)</strong>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>Purpose:</strong> Remove role from user
                  <br /><strong>Limitations:</strong> Admin access required
                  <br /><strong>Sample:</strong> <code>await sdk.revokeRole("USER_ROLE", userAddress)</code>
                </p>
              </div>
            </div>

            {/* Utility Functions */}
            <div style={{ border: '1px solid #dee2e6', borderRadius: '6px', padding: '1rem', backgroundColor: 'white' }}>
              <h3 style={{ color: '#17a2b8', marginTop: 0 }}>🛠️ Utility Functions</h3>
              
              <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
                <strong>fundAccount(address, amount)</strong>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>Purpose:</strong> Add test funds to account
                  <br /><strong>Limitations:</strong> Test network only, rate limited
                  <br /><strong>Sample:</strong> <code>await sdk.fundAccount(userAddress, "1.0")</code>
                </p>
              </div>

              <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
                <strong>registerPublicKey(userAddress, pubHex)</strong>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>Purpose:</strong> Register user's public key on-chain
                  <br /><strong>Limitations:</strong> Valid key format required
                  <br /><strong>Sample:</strong> <code>await sdk.registerPublicKey(address, publicKey)</code>
                </p>
              </div>

              <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
                <strong>getUserPublicKey(aadhaarHash)</strong>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>Purpose:</strong> Retrieve user's public key
                  <br /><strong>Limitations:</strong> User must be registered
                  <br /><strong>Sample:</strong> <code>const pubKey = await sdk.getUserPublicKey(hash)</code>
                </p>
              </div>
            </div>

          </div>

          {/* Global Limitations */}
          <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f8d7da', borderRadius: '6px' }}>
            <h3 style={{ color: '#721c24', marginTop: 0 }}>⚠️ General Limitations & Requirements</h3>
            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
              <li><strong>Network Dependency:</strong> All functions require active blockchain connection</li>
              <li><strong>Gas Fees:</strong> Write operations (create, update, delete) require ETH for gas</li>
              <li><strong>Authentication:</strong> Most functions require prior initialization with init()</li>
              <li><strong>Role Permissions:</strong> Many operations are restricted by role-based access control</li>
              <li><strong>File Size Limits:</strong> IPFS uploads limited to 1MB per file</li>
              <li><strong>Aadhaar Format:</strong> Must be exactly 12 digits</li>
              <li><strong>JSON Validation:</strong> All JSON data must be properly formatted</li>
              <li><strong>Wallet Security:</strong> Private keys stored locally with PIN encryption</li>
              <li><strong>OTP Expiry:</strong> OTP codes have time limits and are single-use</li>
              <li><strong>IPFS Dependency:</strong> File operations require IPFS node availability</li>
            </ul>
          </div>

        </details>
      </section>

      {/* 1. Initialize / Login */}
      <section>
        <h2>1. Initialize / Login</h2>

        <div className="form-group">
          <label htmlFor="aadhaarInput">Aadhaar Number:</label>
          <input
            type="text"
            id="aadhaarInput"
            value={aadhaar}
            onChange={(e) => setAadhaar(e.target.value)}
            placeholder="123412341234"
            maxLength={12}
          />
        </div>

        <div className="form-group" style={{ backgroundColor: "#e8f0fe", padding: "0.75rem", borderRadius: "6px" }}>
          <label style={{ fontWeight: "bold" }}>
            <input
              type="checkbox"
              id="newUserCheckbox"
              checked={isNewUser}
              onChange={(e) => {
                setIsNewUser(e.target.checked);
                setShowNewUserForm(e.target.checked);
              }}
              style={{ marginRight: "0.5rem" }}
            />
            Register as a New User
          </label>
        </div>

        {showNewUserForm && (
          <div style={{ background: "#f8f9fa", padding: "1rem", borderRadius: "4px" }}>
            <div className="form-group">
              <label htmlFor="newName">Name:</label>
              <input type="text" id="newName" value={newName} onChange={(e) => setNewName(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="newEmail">Email:</label>
              <input type="email" id="newEmail" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="newPhone">Phone:</label>
              <input type="text" id="newPhone" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="newData">Additional Data (JSON):</label>
              <textarea id="newData" rows="3" value={newData} onChange={(e) => setNewData(e.target.value)} />
            </div>
          </div>
        )}

        <button onClick={handleInit}>Initialize SDK</button>
      </section>

      {/* 2. User Info */}
      {showUserSection && (
        <section id="userSection">
          <h2>2. User Profile</h2>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3>Current User</h3>
            <pre id="userInfo">{JSON.stringify(userInfo, null, 2)}</pre>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <button onClick={loadUser}>Refresh User</button>
              <button
                onClick={() => {
                  setShowUpdateUserForm(!showUpdateUserForm);
                  if (!showUpdateUserForm && userInfo) {
                    setUpdData(JSON.stringify(userInfo, null, 2));
                  }
                }}
              >
                {showUpdateUserForm ? "Cancel Update" : "Update User"}
              </button>
            </div>
          </div>

          {showUpdateUserForm && (
            <div style={{ background: "#fff3cd", padding: "1rem", borderRadius: "4px", marginTop: "1rem" }}>
              <div className="form-group">
                <label htmlFor="updData">New Data JSON:</label>
                <textarea id="updData" rows="3" value={updData} onChange={(e) => setUpdData(e.target.value)} />
              </div>
              <button onClick={handleUpdateUser}>Submit Update</button>
            </div>
          )}

          <div style={{ marginTop: '2rem', borderTop: '1px solid #dee2e6', paddingTop: '1.5rem' }}>
            <h3>All Users Management</h3>
            <p style={{ color: '#dc3545', fontSize: '0.9rem', marginBottom: '1rem' }}>
              ⚠️ Admin Only - Requires admin privileges to view all users
            </p>
            
            <div style={{ marginBottom: '1rem' }}>
              <button 
                onClick={handleGetAllUsers}
                style={{ 
                  backgroundColor: '#6f42c1',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  marginRight: '1rem'
                }}
              >
                Get All Users
              </button>
              
              <button
                onClick={() => setAllUsers([])}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Clear Results
              </button>
            </div>

            {allUsers.length > 0 && (
              <div style={{
                background: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '6px',
                padding: '1rem',
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                <h4 style={{ margin: '0 0 1rem 0' }}>Users ({allUsers.length}):</h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '1rem'
                }}>
                  {allUsers.map((user, index) => (
                    <div key={index} style={{
                      background: 'white',
                      border: '1px solid #dee2e6',
                      borderRadius: '4px',
                      padding: '1rem'
                    }}>
                      <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'bold', color: '#495057' }}>
                        User #{index + 1}
                      </div>
                      <pre style={{
                        margin: 0,
                        fontSize: '0.8rem',
                        background: '#f8f9fa',
                        padding: '0.5rem',
                        borderRadius: '3px',
                        overflow: 'auto',
                        maxHeight: '150px'
                      }}>
                        {JSON.stringify(user, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {allUsers.length === 0 && (
              <div style={{
                background: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                padding: '1rem',
                textAlign: 'center',
                color: '#6c757d'
              }}>
                No users loaded. Click "Get All Users" to fetch from blockchain.
              </div>
            )}
          </div>
        </section>
      )}

      {/* 3. Loan Management */}
      {showLoanSection && (
        <section id="loanSection">
          <h2>3. Loan Management</h2>
          <div className="form-group">
            <label htmlFor="loanId">Loan ID (string):</label>
            <input type="text" id="loanId" value={loanId} onChange={(e) => setLoanId(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="loanDetails">Loan Details JSON:</label>
            <textarea id="loanDetails" rows="3" value={loanDetails} onChange={(e) => setLoanDetails(e.target.value)} />
          </div>
          <button onClick={handleCreateLoan}>Create Loan</button>
          <button onClick={handleListLoans}>List Loans</button>
          <button
            onClick={() => {
              setShowUpdateLoanForm(!showUpdateLoanForm);
              if (!showUpdateLoanForm && loanList.length > 0) {
                const first = loanList[0];
                setUpdLoanId(first.loanId || "");
                setUpdLoanData(JSON.stringify(first, null, 2));
              }
            }}
          >
            {showUpdateLoanForm ? "Cancel Update" : "Update Loan"}
          </button>

          {showUpdateLoanForm && (
            <div style={{ background: "#fff3cd", padding: "1rem", borderRadius: "4px", marginTop: "1rem" }}>
              <div className="form-group">
                <label htmlFor="updLoanId">Loan ID (string):</label>
                <input type="text" id="updLoanId" value={updLoanId} onChange={(e) => setUpdLoanId(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="updLoanData">Updated Loan JSON:</label>
                <textarea id="updLoanData" rows="3" value={updLoanData} onChange={(e) => setUpdLoanData(e.target.value)} />
              </div>
              <button onClick={handleUpdateLoan}>Submit Loan Update</button>
            </div>
          )}

          <pre id="loanList">{JSON.stringify(loanList, null, 2)}</pre>
        </section>
      )}

      {/* 4. File Upload & Listing */}
      {showFileSection && (
        <section id="fileSection">
          <h2>4. File Upload & Listing</h2>
          <div className="form-group">
            <label htmlFor="fileInput">Choose File:</label>
            <input type="file" id="fileInput" ref={fileInputRef} />
          </div>
          <div className="form-group">
            <label htmlFor="fileMeta">Metadata:</label>
            <input
              type="text"
              id="fileMeta"
              value={fileMeta}
              onChange={(e) => setFileMeta(e.target.value)}
              placeholder="e.g. report.pdf"
            />
          </div>
          <button onClick={handleUploadFile}>Upload to IPFS</button>
          <button onClick={handleListFiles}>List Files</button>
          
          {/* File List Display with Download Buttons */}
          {fileList.length > 0 && (
            <div style={{ 
              marginTop: '1.5rem', 
              border: '1px solid #dee2e6', 
              borderRadius: '6px', 
              padding: '1rem',
              backgroundColor: '#f8f9fa'
            }}>
              <h4 style={{ margin: '0 0 1rem 0', color: '#495057' }}>
                Your Files ({fileList.length})
              </h4>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {fileList.map((file, index) => {
                  const [cid, aadhaarHash, fileType, filename] = file;
                  return (
                    <div key={index} style={{
                      background: 'white',
                      border: '1px solid #dee2e6',
                      borderRadius: '4px',
                      padding: '1rem',
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      gap: '1rem',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontWeight: 'bold', marginBottom: '0.25rem', color: '#495057' }}>
                          📄 {filename || 'Untitled File'}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: '0.25rem' }}>
                          Type: {fileType} | CID: {cid.slice(0, 20)}...
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#868e96', fontFamily: 'monospace' }}>
                          Hash: {aadhaarHash.slice(0, 20)}...
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                        <button
                          onClick={() => handleDownloadFile(file)}
                          style={{
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '0.5rem 1rem',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          ⬇️ Download
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(cid);
                            showStatus("info", "CID copied to clipboard");
                          }}
                          style={{
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '0.25rem 0.5rem',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          📋 Copy CID
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {fileList.length === 0 && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              textAlign: 'center',
              color: '#6c757d'
            }}>
              No files found. Upload some files or click "List Files" to refresh.
            </div>
          )}
          
          {/* Raw JSON Display (for debugging) */}
          <details style={{ marginTop: '1rem' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: '#6c757d' }}>
              Show Raw File Data (Debug)
            </summary>
            <pre style={{ 
              background: '#f8f9fa', 
              padding: '1rem', 
              borderRadius: '4px', 
              fontSize: '0.8rem',
              overflow: 'auto'
            }}>
              {JSON.stringify(fileList, null, 2)}
            </pre>
          </details>
        </section>
      )}

      {/* 5. Admin Create User Flow */}
      {showAdminSection && (
        <section id="adminSection">
          <h2>5. Admin Create User Flow</h2>
          <p style={{ color: '#dc3545', fontWeight: 'bold' }}>
            ⚠️ Admin Only - Create users with administrative privileges
          </p>
          
          <div className="form-group">
            <label htmlFor="adminAadhaar">Admin Aadhaar Number:</label>
            <input
              type="text"
              id="adminAadhaar"
              value={adminAadhaar}
              onChange={(e) => setAdminAadhaar(e.target.value)}
              placeholder="123412341234"
              maxLength={12}
            />
          </div>

          {/* <div className="form-group">
            <label htmlFor="adminPrivateKey">Admin Private Key:</label>
            <input
              type="password"
              id="adminPrivateKey"
              value={adminPrivateKey}
              onChange={(e) => setAdminPrivateKey(e.target.value)}
              placeholder="0x..."
            />
          </div> */}

          <div style={{ background: "#f8f9fa", padding: "1rem", borderRadius: "4px", marginBottom: "1rem" }}>
            <h4>Admin User Details</h4>
            <div className="form-group">
              <label htmlFor="adminName">Name:</label>
              <input
                type="text"
                id="adminName"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="Admin Name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="adminEmail">Email:</label>
              <input
                type="email"
                id="adminEmail"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="adminPhone">Phone:</label>
              <input
                type="text"
                id="adminPhone"
                value={adminPhone}
                onChange={(e) => setAdminPhone(e.target.value)}
                placeholder="Phone number"
              />
            </div>
            <div className="form-group">
              <label htmlFor="adminData">Additional Data (JSON):</label>
              <textarea
                id="adminData"
                rows="3"
                value={adminData}
                onChange={(e) => setAdminData(e.target.value)}
                placeholder='{"department":"Admin","role":"administrator"}'
              />
            </div>
          </div>

          <button onClick={handleAdminCreateUser} style={{ backgroundColor: '#dc3545', color: 'white' }}>
            Create Admin User
          </button>
        </section>
      )}

      {/* 6. Function Role Assignment */}
      {showFunctionRoleSection && (
        <section id="functionRoleSection">
          <h2>6. Function Role Assignment</h2>
          <p style={{ color: '#6f42c1', fontWeight: 'bold' }}>
            🔒 Assign roles to specific contract functions
          </p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div className="form-group">
              <label htmlFor="roleSelect">Select Role:</label>
              <select
                id="roleSelect"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              >
                <option value="">-- Select Role --</option>
                {availableRoles.map((role) => (
                  <option key={role} value={role}>
                    {role.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="functionSelect">Select Function:</label>
              <select
                id="functionSelect"
                value={selectedFunction}
                onChange={(e) => setSelectedFunction(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              >
                <option value="">-- Select Function --</option>
                {availableFunctions.map((func) => (
                  <option key={func.signature} value={func.signature}>
                    {func.name} - {func.signature}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedRole && selectedFunction && (
            <div style={{
              background: '#e8f5e8',
              border: '1px solid #28a745',
              borderRadius: '6px',
              padding: '1rem',
              marginBottom: '1rem'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#155724' }}>Assignment Preview</h4>
              <p style={{ margin: '0', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                <strong>Role:</strong> {selectedRole}<br/>
                <strong>Function:</strong> {selectedFunction}
              </p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              onClick={handleAssignFunctionRole}
              disabled={!selectedRole || !selectedFunction}
              style={{ 
                backgroundColor: selectedRole && selectedFunction ? '#6f42c1' : '#6c757d',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '4px',
                cursor: selectedRole && selectedFunction ? 'pointer' : 'not-allowed',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              Assign Function Role
            </button>
            
            <button
              onClick={() => {
                setSelectedRole("");
                setSelectedFunction("");
              }}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Clear Selection
            </button>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h4>Available Functions Reference:</h4>
            <div style={{
              background: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              padding: '1rem',
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#e9ecef' }}>
                    <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Function Name</th>
                    <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Signature</th>
                  </tr>
                </thead>
                <tbody>
                  {availableFunctions.map((func) => (
                    <tr key={func.signature}>
                      <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{func.name}</td>
                      <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee', fontFamily: 'monospace' }}>
                        {func.signature}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* 7. Role Members Management */}
      {showRoleMembersSection && (
        <section id="roleMembersSection">
          <h2>7. Role Members Management</h2>
          <p style={{ color: '#17a2b8', fontWeight: 'bold' }}>
            👥 View members assigned to each role
          </p>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <button 
              onClick={handleGetAllRoleMembers}
              style={{ 
                backgroundColor: '#17a2b8',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                marginRight: '1rem'
              }}
            >
              Get All Role Members
            </button>
            
            <button
              onClick={() => setRoleMembers({})}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Clear Results
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {availableRoles.map((role) => (
              <div key={role} style={{
                border: '1px solid #dee2e6',
                borderRadius: '6px',
                padding: '1rem',
                backgroundColor: 'white'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <h4 style={{ margin: 0, color: '#495057' }}>
                    {role.replace(/_/g, ' ')}
                  </h4>
                  <button
                    onClick={() => handleGetRoleMembers(role)}
                    style={{
                      backgroundColor: '#28a745',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    Refresh
                  </button>
                </div>
                
                <div style={{
                  background: '#f8f9fa',
                  border: '1px solid #e9ecef',
                  borderRadius: '4px',
                  padding: '0.75rem',
                  minHeight: '100px',
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  {roleMembers[role] ? (
                    roleMembers[role].error ? (
                      <div style={{ color: '#dc3545', fontSize: '0.9rem' }}>
                        Error: {roleMembers[role].error}
                      </div>
                    ) : Array.isArray(roleMembers[role]) && roleMembers[role].length > 0 ? (
                      <div>
                        <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                          {roleMembers[role].length} member(s):
                        </div>
                        {roleMembers[role].map((member, index) => (
                          <div key={index} style={{
                            background: 'white',
                            border: '1px solid #dee2e6',
                            borderRadius: '3px',
                            padding: '0.5rem',
                            marginBottom: '0.25rem',
                            fontSize: '0.85rem',
                            fontFamily: 'monospace',
                            wordBreak: 'break-all'
                          }}>
                            {typeof member === 'string' ? member : JSON.stringify(member)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                        No members found
                      </div>
                    )
                  ) : (
                    <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                      Click refresh to load members
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            background: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '6px',
            padding: '1rem'
          }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#856404' }}>📝 Note about Roles</h4>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              The roles shown above are examples. Your smart contract may have different roles. 
              To get the actual roles from your contract, you would need to:
            </p>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem', fontSize: '0.9rem' }}>
              <li>Add a function to your contract to list all existing roles</li>
              <li>Query role creation events from the blockchain</li>
              <li>Or manually add the specific roles used in your contract</li>
            </ul>
          </div>
        </section>
      )}

      {/* 8. Role Functions Management */}
      {showRoleFunctionsSection && (
        <section id="roleFunctionsSection">
          <h2>8. Role Functions Management</h2>
          <p style={{ color: '#28a745', fontWeight: 'bold' }}>
            🔧 View functions assigned to each role
          </p>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <button 
              onClick={handleGetAllRoleFunctions}
              style={{ 
                backgroundColor: '#28a745',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                marginRight: '1rem'
              }}
            >
              Get All Role Functions
            </button>
            
            <button
              onClick={() => setRoleFunctions({})}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Clear Results
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {availableRoles.map((role) => (
              <div key={role} style={{
                border: '1px solid #dee2e6',
                borderRadius: '6px',
                padding: '1rem',
                backgroundColor: 'white'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <h4 style={{ margin: 0, color: '#495057' }}>
                    {role.replace(/_/g, ' ')}
                  </h4>
                  <button
                    onClick={() => handleGetRoleFunctions(role)}
                    style={{
                      backgroundColor: '#28a745',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    Refresh
                  </button>
                </div>
                
                <div style={{
                  background: '#f8f9fa',
                  border: '1px solid #e9ecef',
                  borderRadius: '4px',
                  padding: '0.75rem',
                  minHeight: '120px',
                  maxHeight: '250px',
                  overflowY: 'auto'
                }}>
                  {roleFunctions[role] ? (
                    roleFunctions[role].error ? (
                      <div style={{ color: '#dc3545', fontSize: '0.9rem' }}>
                        Error: {roleFunctions[role].error}
                      </div>
                    ) : Array.isArray(roleFunctions[role]) && roleFunctions[role].length > 0 ? (
                      <div>
                        <div style={{ fontSize: '0.9rem', marginBottom: '0.75rem', fontWeight: 'bold' }}>
                          {roleFunctions[role].length} function(s):
                        </div>
                        {roleFunctions[role].map((func, index) => (
                          <div key={index} style={{
                            background: 'white',
                            border: '1px solid #dee2e6',
                            borderRadius: '3px',
                            padding: '0.5rem',
                            marginBottom: '0.5rem'
                          }}>
                            <div style={{
                              fontSize: '0.9rem',
                              fontWeight: 'bold',
                              color: '#495057',
                              marginBottom: '0.25rem'
                            }}>
                              {func.name}
                            </div>
                            <div style={{
                              fontSize: '0.8rem',
                              fontFamily: 'monospace',
                              color: '#6c757d',
                              wordBreak: 'break-all'
                            }}>
                              {func.signature}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                        No functions assigned
                      </div>
                    )
                  ) : (
                    <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                      Click refresh to load functions
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            background: '#d1ecf1',
            border: '1px solid #bee5eb',
            borderRadius: '6px',
            padding: '1rem'
          }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#0c5460' }}>ℹ️ About Function Assignment</h4>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              This shows which functions each role can execute. Functions are assigned using the 
              "Function Role Assignment" section above. The display shows both the function name 
              and its contract signature for clarity.
            </p>
          </div>
        </section>
      )}

    </div>
  );
}

export default App;