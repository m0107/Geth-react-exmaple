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
      console.log("SDK instance:", process.env);
      console.log("process.BLC_FUND_API_BASE", process.env.REACT_APP_BLC_FUND_API_BASE, process.env.REACT_APP_RPC_URL);
    }
  }, []);
  const sdk = sdkRef.current;

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
  const [showDataManagerSection, setShowDataManagerSection] = useState(false);

  // DataManager states
  const [recordId, setRecordId] = useState("");
  const [recordOwner, setRecordOwner] = useState("");
  const [recordCollection, setRecordCollection] = useState("users");
  const [recordData, setRecordData] = useState('{"name":"John","age":30}');
  const [records, setRecords] = useState([]);
  const [recordMetadata, setRecordMetadata] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [recordExists, setRecordExists] = useState(null);
  const [updateRecordId, setUpdateRecordId] = useState("");
  const [updateRecordData, setUpdateRecordData] = useState("");
  const [showUpdateRecordForm, setShowUpdateRecordForm] = useState(false);
  const [searchCollection, setSearchCollection] = useState("users");
  const [searchOwner, setSearchOwner] = useState("");

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
  
  // FileData download states
  const [downloadFileData, setDownloadFileData] = useState("");
  const [downloadingFileData, setDownloadingFileData] = useState(false);

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
    { name: "Create Default Admin", signature: "createDefaultAdmin(bytes32,string,string)" },
    { name: "Create Record", signature: "createRecord(bytes32,bytes32,string,string)" },
    { name: "Update Record", signature: "updateRecord(bytes32,string)" },
    { name: "Delete Record", signature: "deleteRecord(bytes32)" },
    { name: "Get Record", signature: "getRecord(bytes32)" },
    { name: "Get Records By Owner", signature: "getRecordsByOwner(bytes32)" },
    { name: "Get Records By Collection", signature: "getRecordsByCollection(string)" },
    { name: "Get All Records", signature: "getAllRecords()" },
    { name: "Batch Create Records", signature: "batchCreateRecords(bytes32[],bytes32[],string[],string[])" }
  ];

  // Note: These are example roles - actual roles should be fetched from your smart contract
  const availableRoles = [
    "ADMIN_ROLE", // Only predefined role
    "DATA_MANAGER", // Example custom role for DataManager functions
    "USER_MANAGER", // Example custom role for user management
    "LOAN_OFFICER", // Example custom role for loan operations
    "OPERATOR", // Example custom role for operations
    "VIEWER", // Example custom role for read-only access
    "AUDITOR", // Example custom role for audit functions
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
      setShowDataManagerSection(true);
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

  const handleDownloadByFileData = async () => {
    const fileDataInput = downloadFileData.trim();
    
    if (!fileDataInput) {
      showStatus("error", "Please enter valid fileData");
      return;
    }
    
    let fileData;
    try {
      // Parse fileData if it's a JSON string, otherwise assume it's already an array
      fileData = typeof fileDataInput === 'string' && fileDataInput.startsWith('[') 
        ? JSON.parse(fileDataInput) 
        : fileDataInput;
      
      // Validate fileData structure
      if (!Array.isArray(fileData) || fileData.length < 1) {
        throw new Error("FileData must be an array with at least CID");
      }
    } catch (parseError) {
      showStatus("error", "Invalid fileData format. Expected: [cid, aadhaarHash, fileType, metadata]");
      return;
    }
    
    setDownloadingFileData(true);
    
    try {
      // Extract CID and filename from fileData
      const [cid, , , filename] = fileData;
      
      if (!cid) {
        throw new Error("CID not found in fileData");
      }
      
      showStatus("info", `Downloading ${filename || 'file'} with CID: ${cid.slice(0, 20)}...`);
      
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
      
      showStatus("success", `File downloaded successfully: ${filename || cid.slice(0, 20) + '...'}`);
      setDownloadFileData(""); // Clear the input after successful download
    } catch (e) {
      console.error(e);
      showStatus("error", `Download failed: ${e.message}`);
    } finally {
      setDownloadingFileData(false);
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

  // DataManager Handler Functions
  const handleCreateRecord = async () => {
    if (!recordId.trim() || !recordData.trim()) {
      return showStatus("error", "Record ID and Data are required");
    }
    
    try {
      const ownerHash = recordOwner.trim() ? 
        sdk.web3.utils.keccak256(recordOwner.trim()) : 
        sdk.web3.utils.keccak256(aadhaar);
      const recId = sdk.web3.utils.keccak256(recordId.trim());
      
      await sdk.createRecord(recId, ownerHash, recordCollection, recordData.trim());
      showStatus("success", `Record created with ID: ${recordId}`);
      setRecordId("");
      setRecordData('{"name":"John","age":30}');
    } catch (e) {
      console.error(e);
      showStatus("error", "Create record failed: " + e.message);
    }
  };

  const handleGetRecord = async () => {
    if (!recordId.trim()) {
      return showStatus("error", "Record ID is required");
    }
    
    try {
      const recId = sdk.web3.utils.keccak256(recordId.trim());
      const record = await sdk.getRecord(recId);
      setRecords([record]);
      showStatus("success", "Record retrieved");
    } catch (e) {
      console.error(e);
      showStatus("error", "Get record failed: " + e.message);
    }
  };

  const handleGetAllRecords = async () => {
    try {
      showStatus("info", "Fetching all records...");
      const allRecords = await sdk.getAllRecords();
      setRecords(allRecords);
      showStatus("success", `Retrieved ${allRecords.length} records`);
    } catch (e) {
      console.error(e);
      showStatus("error", "Get all records failed: " + e.message);
    }
  };

  const handleGetRecordsByCollection = async () => {
    try {
      showStatus("info", `Fetching records from ${searchCollection}...`);
      const collectionRecords = await sdk.getRecordsByCollection(searchCollection);
      setRecords(collectionRecords);
      showStatus("success", `Retrieved ${collectionRecords.length} records from ${searchCollection}`);
    } catch (e) {
      console.error(e);
      showStatus("error", "Get records by collection failed: " + e.message);
    }
  };

  const handleGetRecordsByOwner = async () => {
    try {
      const ownerHash = searchOwner.trim() ? 
        sdk.web3.utils.keccak256(searchOwner.trim()) : 
        sdk.web3.utils.keccak256(aadhaar);
      
      showStatus("info", "Fetching records by owner...");
      const ownerRecords = await sdk.getRecordsByOwner(ownerHash);
      setRecords(ownerRecords);
      showStatus("success", `Retrieved ${ownerRecords.length} records for owner`);
    } catch (e) {
      console.error(e);
      showStatus("error", "Get records by owner failed: " + e.message);
    }
  };

  const handleGetRecordsByCollectionAndOwner = async () => {
    try {
      const ownerHash = searchOwner.trim() ? 
        sdk.web3.utils.keccak256(searchOwner.trim()) : 
        sdk.web3.utils.keccak256(aadhaar);
      
      showStatus("info", `Fetching records from ${searchCollection} by owner...`);
      const records = await sdk.getRecordsByCollectionAndOwner(searchCollection, ownerHash);
      setRecords(records);
      showStatus("success", `Retrieved ${records.length} records`);
    } catch (e) {
      console.error(e);
      showStatus("error", "Get records by collection and owner failed: " + e.message);
    }
  };

  const handleUpdateRecord = async () => {
    if (!updateRecordId.trim() || !updateRecordData.trim()) {
      return showStatus("error", "Record ID and new data are required");
    }
    
    try {
      const recId = sdk.web3.utils.keccak256(updateRecordId.trim());
      await sdk.updateRecord(recId, updateRecordData.trim());
      showStatus("success", "Record updated successfully");
      setShowUpdateRecordForm(false);
      setUpdateRecordId("");
      setUpdateRecordData("");
    } catch (e) {
      console.error(e);
      showStatus("error", "Update record failed: " + e.message);
    }
  };

  const handleDeleteRecord = async (recordIdToDelete) => {
    if (!recordIdToDelete) {
      return showStatus("error", "Record ID is required");
    }
    
    try {
      if (confirm(`Are you sure you want to delete record: ${recordIdToDelete}?`)) {
        const recId = sdk.web3.utils.keccak256(recordIdToDelete);
        await sdk.deleteRecord(recId);
        showStatus("success", "Record deleted successfully");
        // Refresh records list
        handleGetAllRecords();
      }
    } catch (e) {
      console.error(e);
      showStatus("error", "Delete record failed: " + e.message);
    }
  };

  const handleGetTotalRecords = async () => {
    try {
      const total = await sdk.getTotalRecords();
      setTotalRecords(total);
      showStatus("success", `Total records: ${total}`);
    } catch (e) {
      console.error(e);
      showStatus("error", "Get total records failed: " + e.message);
    }
  };

  const handleCheckRecordExists = async () => {
    if (!recordId.trim()) {
      return showStatus("error", "Record ID is required");
    }
    
    try {
      const recId = sdk.web3.utils.keccak256(recordId.trim());
      const exists = await sdk.recordExists(recId);
      setRecordExists(exists);
      showStatus("success", `Record ${exists ? 'exists' : 'does not exist'}`);
    } catch (e) {
      console.error(e);
      showStatus("error", "Check record exists failed: " + e.message);
    }
  };

  const handleGetRecordMetadata = async () => {
    if (!recordId.trim()) {
      return showStatus("error", "Record ID is required");
    }
    
    try {
      const recId = sdk.web3.utils.keccak256(recordId.trim());
      const metadata = await sdk.getRecordMetadata(recId);
      setRecordMetadata(metadata);
      showStatus("success", "Record metadata retrieved");
    } catch (e) {
      console.error(e);
      showStatus("error", "Get record metadata failed: " + e.message);
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
        <h2>📚 Complete SDK Functions & RBAC Requirements</h2>
        <details>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '1rem' }}>
            Click to view all SDK functions with detailed RBAC requirements and usage
          </summary>
          
          <div style={{ marginTop: '1rem' }}>
            
            {/* RBAC Overview */}
            <div style={{ marginBottom: '2rem', border: '2px solid #dc3545', borderRadius: '8px', padding: '1.5rem', backgroundColor: '#fff5f5' }}>
              <h3 style={{ color: '#dc3545', marginTop: 0 }}>🔐 IMPORTANT: RBAC System Overview</h3>
              
              <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>Actual Role Structure:</h4>
                <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                  <li><strong>ADMIN_ROLE:</strong> Only predefined role (keccak256("ADMIN_ROLE"))</li>
                  <li><strong>Custom Roles:</strong> Must be created using RBACManager.createRole(roleName)</li>
                  <li><strong>No Predefined USER_ROLE:</strong> All roles except ADMIN_ROLE must be created manually</li>
                </ul>
              </div>

              <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#fff3cd', borderRadius: '6px' }}>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>Function Access Control:</h4>
                <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                  <li><strong>DataManager:</strong> ALL functions require role assignment via assignFunctionRole()</li>
                  <li><strong>UserManagement:</strong> Some functions allow owner access OR role-based access</li>
                  <li><strong>KeyRegistry:</strong> NO RBAC - all functions are public</li>
                  <li><strong>FileRegistry:</strong> NO RBAC - all functions are public</li>
                  <li><strong>RBACManager:</strong> Admin functions require ADMIN_ROLE</li>
                </ul>
              </div>

              <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#d1ecf1', borderRadius: '6px' }}>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>Required Setup Steps:</h4>
                <ol style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                  <li>Admin creates roles: <code>rbac.createRole("DATA_MANAGER")</code></li>
                  <li>Admin assigns function permissions: <code>rbac.assignFunctionRole("DATA_MANAGER", createRecordSelector)</code></li>
                  <li>Admin grants role to users: <code>rbac.grantRoleByName("DATA_MANAGER", userAddress)</code></li>
                  <li>Users can then call functions they have permissions for</li>
                </ol>
              </div>

              <div style={{ padding: '1rem', backgroundColor: '#f8d7da', borderRadius: '6px' }}>
                <strong>⚠️ Current Status:</strong> Most DataManager functions will fail until proper role setup is completed via RBACManager.
              </div>
            </div>
            
            {/* Authentication & Core Functions */}
            <div style={{ marginBottom: '2rem', border: '1px solid #dee2e6', borderRadius: '6px', padding: '1rem', backgroundColor: 'white' }}>
              <h3 style={{ color: '#0066cc', marginTop: 0 }}>🔐 Authentication & Core Functions</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#495057' }}>init(aadhaar, isNewUser, userData)</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>Initialize SDK with Aadhaar validation</div>
                <div style={{ padding: '0.5rem', backgroundColor: '#d4edda', borderRadius: '3px', fontSize: '0.85rem' }}>
                  <strong>RBAC:</strong> ✅ No restrictions (Public function)
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#495057' }}>requestOtp(aadhaar)</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>Request OTP for new user registration</div>
                <div style={{ padding: '0.5rem', backgroundColor: '#d4edda', borderRadius: '3px', fontSize: '0.85rem' }}>
                  <strong>RBAC:</strong> ✅ No restrictions (Public function)
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#495057' }}>submitOtp(requestId, otp, userAddress)</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>Verify OTP and complete registration</div>
                <div style={{ padding: '0.5rem', backgroundColor: '#d4edda', borderRadius: '3px', fontSize: '0.85rem' }}>
                  <strong>RBAC:</strong> ✅ No restrictions (Public function)
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#495057' }}>fundAccount(address, amount)</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>Add test funds to account (test network only)</div>
                <div style={{ padding: '0.5rem', backgroundColor: '#d4edda', borderRadius: '3px', fontSize: '0.85rem' }}>
                  <strong>RBAC:</strong> ✅ No restrictions (Public function)
                </div>
              </div>
            </div>

            {/* User Management Functions */}
            <div style={{ marginBottom: '2rem', border: '1px solid #dee2e6', borderRadius: '6px', padding: '1rem', backgroundColor: 'white' }}>
              <h3 style={{ color: '#28a745', marginTop: 0 }}>👤 User Management Functions</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#495057' }}>createUser(aadhaarHash, dataJson)</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>Create new user on blockchain</div>
                <div style={{ padding: '0.5rem', backgroundColor: '#fff3cd', borderRadius: '3px', fontSize: '0.85rem' }}>
                  <strong>RBAC:</strong> ⚠️ USER_ROLE or higher required
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#495057' }}>updateUser(aadhaarHash, newDataJson)</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>Update existing user data</div>
                <div style={{ padding: '0.5rem', backgroundColor: '#fff3cd', borderRadius: '3px', fontSize: '0.85rem' }}>
                  <strong>RBAC:</strong> ⚠️ Owner OR user with assigned role for function
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#495057' }}>getUser(aadhaarHash)</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>Retrieve user information</div>
                <div style={{ padding: '0.5rem', backgroundColor: '#d4edda', borderRadius: '3px', fontSize: '0.85rem' }}>
                  <strong>RBAC:</strong> ✅ No restrictions (Public view function)
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#495057' }}>getAllUsers()</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>Get list of all users</div>
                <div style={{ padding: '0.5rem', backgroundColor: '#d4edda', borderRadius: '3px', fontSize: '0.85rem' }}>
                  <strong>RBAC:</strong> ✅ No restrictions (Public view function)
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#495057' }}>createDefaultAdmin(aadhaarHash, dataJson)</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>Create the first admin user</div>
                <div style={{ padding: '0.5rem', backgroundColor: '#f8d7da', borderRadius: '3px', fontSize: '0.85rem' }}>
                  <strong>RBAC:</strong> 🔒 DEFAULT_ADMIN_ROLE required
                </div>
              </div>
            </div>

            {/* Data Management Functions */}
            <div style={{ marginBottom: '2rem', border: '1px solid #dee2e6', borderRadius: '6px', padding: '1rem', backgroundColor: 'white' }}>
              <h3 style={{ color: '#e83e8c', marginTop: 0 }}>📊 Data Management Functions</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#495057' }}>createRecord(recordId, ownerId, collection, dataJson)</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>Create new data record in collection</div>
                <div style={{ padding: '0.5rem', backgroundColor: '#fff3cd', borderRadius: '3px', fontSize: '0.85rem' }}>
                  <strong>RBAC:</strong> ⚠️ USER_ROLE or higher required
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#495057' }}>updateRecord(recordId, newDataJson)</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>Update existing record data</div>
                <div style={{ padding: '0.5rem', backgroundColor: '#f8d7da', borderRadius: '3px', fontSize: '0.85rem' }}>
                  <strong>RBAC:</strong> 🔒 Role must be assigned to function via assignFunctionRole()
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#495057' }}>deleteRecord(recordId)</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>Soft delete a record</div>
                <div style={{ padding: '0.5rem', backgroundColor: '#f8d7da', borderRadius: '3px', fontSize: '0.85rem' }}>
                  <strong>RBAC:</strong> 🔒 Role must be assigned to function via assignFunctionRole()
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#495057' }}>getRecord(recordId)</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>Retrieve single record by ID</div>
                <div style={{ padding: '0.5rem', backgroundColor: '#f8d7da', borderRadius: '3px', fontSize: '0.85rem' }}>
                  <strong>RBAC:</strong> 🔒 Role must be assigned to function via assignFunctionRole()
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#495057' }}>getRecordsByOwner(ownerId)</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>List all records belonging to specific owner</div>
                <div style={{ padding: '0.5rem', backgroundColor: '#fff3cd', borderRadius: '3px', fontSize: '0.85rem' }}>
                  <strong>RBAC:</strong> ⚠️ Own records or ADMIN_ROLE for others
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#495057' }}>getRecordsByCollection(collection)</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>List all records in specific collection</div>
                <div style={{ padding: '0.5rem', backgroundColor: '#f8d7da', borderRadius: '3px', fontSize: '0.85rem' }}>
                  <strong>RBAC:</strong> 🔒 ADMIN_ROLE or collection access required
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#495057' }}>getAllRecords()</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>Get all records in the system</div>
                <div style={{ padding: '0.5rem', backgroundColor: '#f8d7da', borderRadius: '3px', fontSize: '0.85rem' }}>
                  <strong>RBAC:</strong> 🔒 ADMIN_ROLE required
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#495057' }}>batchCreateRecords(recordIds, ownerIds, collections, dataJsons)</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>Create multiple records in single transaction</div>
                <div style={{ padding: '0.5rem', backgroundColor: '#f8d7da', borderRadius: '3px', fontSize: '0.85rem' }}>
                  <strong>RBAC:</strong> 🔒 ADMIN_ROLE or MANAGER_ROLE required
                </div>
              </div>
            </div>

            {/* File Management Functions */}
            <div style={{ marginBottom: '2rem', border: '1px solid #dee2e6', borderRadius: '6px', padding: '1rem', backgroundColor: 'white' }}>
              <h3 style={{ color: '#fd7e14', marginTop: 0 }}>📁 File Management Functions</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#495057' }}>uploadFile(buffer, aadhaarHash, fileType, metadata)</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>Upload file to IPFS with encryption</div>
                <div style={{ padding: '0.5rem', backgroundColor: '#fff3cd', borderRadius: '3px', fontSize: '0.85rem' }}>
                  <strong>RBAC:</strong> ⚠️ USER_ROLE or higher required
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#495057' }}>readFile(cid, userAddr)</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>Download and decrypt file from IPFS</div>
                <div style={{ padding: '0.5rem', backgroundColor: '#fff3cd', borderRadius: '3px', fontSize: '0.85rem' }}>
                  <strong>RBAC:</strong> ⚠️ File owner or granted access required
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#495057' }}>getAllFilesForUser(aadhaarHash)</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>List all files for specific user</div>
                <div style={{ padding: '0.5rem', backgroundColor: '#fff3cd', borderRadius: '3px', fontSize: '0.85rem' }}>
                  <strong>RBAC:</strong> ⚠️ Own files or ADMIN_ROLE for others
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#495057' }}>getAllFilesByType(fileType)</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>Get all files of specific type</div>
                <div style={{ padding: '0.5rem', backgroundColor: '#f8d7da', borderRadius: '3px', fontSize: '0.85rem' }}>
                  <strong>RBAC:</strong> 🔒 ADMIN_ROLE required
                </div>
              </div>
            </div>

            {/* Loan Management Functions */}
            <div style={{ marginBottom: '2rem', border: '1px solid #dee2e6', borderRadius: '6px', padding: '1rem', backgroundColor: 'white' }}>
              <h3 style={{ color: '#dc3545', marginTop: 0 }}>💰 Loan Management Functions</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#495057' }}>createLoan(loanIdHash, userAadhaarHash, loanDetailsJson)</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>Create new loan record</div>
                <div style={{ padding: '0.5rem', backgroundColor: '#fff3cd', borderRadius: '3px', fontSize: '0.85rem' }}>
                  <strong>RBAC:</strong> ⚠️ LOAN_OFFICER_ROLE or ADMIN_ROLE required
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#495057' }}>updateLoan(loanIdHash, newDataJson)</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>Update loan information</div>
                <div style={{ padding: '0.5rem', backgroundColor: '#fff3cd', borderRadius: '3px', fontSize: '0.85rem' }}>
                  <strong>RBAC:</strong> ⚠️ LOAN_OFFICER_ROLE or ADMIN_ROLE required
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#495057' }}>getLoanByLoanId(loanIdHash)</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>Retrieve specific loan details</div>
                <div style={{ padding: '0.5rem', backgroundColor: '#fff3cd', borderRadius: '3px', fontSize: '0.85rem' }}>
                  <strong>RBAC:</strong> ⚠️ Loan borrower, LOAN_OFFICER_ROLE, or ADMIN_ROLE
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#495057' }}>getAllLoansByUser(userAadhaarHash)</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>Get all loans for a user</div>
                <div style={{ padding: '0.5rem', backgroundColor: '#fff3cd', borderRadius: '3px', fontSize: '0.85rem' }}>
                  <strong>RBAC:</strong> ⚠️ Own loans, LOAN_OFFICER_ROLE, or ADMIN_ROLE
                </div>
              </div>
            </div>

            {/* Role & Access Management Functions */}
            <div style={{ marginBottom: '2rem', border: '1px solid #dee2e6', borderRadius: '6px', padding: '1rem', backgroundColor: 'white' }}>
              <h3 style={{ color: '#6f42c1', marginTop: 0 }}>🔒 Role & Access Management Functions</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#495057' }}>createRole(roleName, adminRoleName)</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>Create new role in system</div>
                <div style={{ padding: '0.5rem', backgroundColor: '#f8d7da', borderRadius: '3px', fontSize: '0.85rem' }}>
                  <strong>RBAC:</strong> 🔒 DEFAULT_ADMIN_ROLE required
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#495057' }}>grantRole(roleName, address)</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>Assign role to user address</div>
                <div style={{ padding: '0.5rem', backgroundColor: '#f8d7da', borderRadius: '3px', fontSize: '0.85rem' }}>
                  <strong>RBAC:</strong> 🔒 Role admin or DEFAULT_ADMIN_ROLE required
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#495057' }}>revokeRole(roleName, address)</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>Remove role from user</div>
                <div style={{ padding: '0.5rem', backgroundColor: '#f8d7da', borderRadius: '3px', fontSize: '0.85rem' }}>
                  <strong>RBAC:</strong> 🔒 Role admin or DEFAULT_ADMIN_ROLE required
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#495057' }}>assignFunctionRolesFor(roleName, functionSignature)</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>Assign function permissions to role</div>
                <div style={{ padding: '0.5rem', backgroundColor: '#f8d7da', borderRadius: '3px', fontSize: '0.85rem' }}>
                  <strong>RBAC:</strong> 🔒 DEFAULT_ADMIN_ROLE required
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#495057' }}>hasRole(roleName, address)</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>Check if user has specific role</div>
                <div style={{ padding: '0.5rem', backgroundColor: '#d4edda', borderRadius: '3px', fontSize: '0.85rem' }}>
                  <strong>RBAC:</strong> ✅ No restrictions (Read-only function)
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#495057' }}>getRoleMembers(roleHash)</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>Get all members of a role</div>
                <div style={{ padding: '0.5rem', backgroundColor: '#fff3cd', borderRadius: '3px', fontSize: '0.85rem' }}>
                  <strong>RBAC:</strong> ⚠️ ADMIN_ROLE or AUDITOR_ROLE required
                </div>
              </div>
            </div>

            {/* Key Management Functions */}
            <div style={{ marginBottom: '2rem', border: '1px solid #dee2e6', borderRadius: '6px', padding: '1rem', backgroundColor: 'white' }}>
              <h3 style={{ color: '#17a2b8', marginTop: 0 }}>🔑 Key Management Functions</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#495057' }}>registerPublicKey(userAddress, pubHex)</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>Register user's public key on-chain</div>
                <div style={{ padding: '0.5rem', backgroundColor: '#fff3cd', borderRadius: '3px', fontSize: '0.85rem' }}>
                  <strong>RBAC:</strong> ⚠️ USER_ROLE or self-registration
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#495057' }}>getUserPublicKey(aadhaarHash)</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>Retrieve user's public key</div>
                <div style={{ padding: '0.5rem', backgroundColor: '#d4edda', borderRadius: '3px', fontSize: '0.85rem' }}>
                  <strong>RBAC:</strong> ✅ No restrictions (Public key is public)
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#495057' }}>storeEncryptedKey(fileId, userAddress, encryptedKey)</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>Store encrypted file access key</div>
                <div style={{ padding: '0.5rem', backgroundColor: '#fff3cd', borderRadius: '3px', fontSize: '0.85rem' }}>
                  <strong>RBAC:</strong> ⚠️ File owner or ADMIN_ROLE required
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#495057' }}>getEncryptedKey(fileId, userAddress)</div>
                <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>Retrieve encrypted file access key</div>
                <div style={{ padding: '0.5rem', backgroundColor: '#fff3cd', borderRadius: '3px', fontSize: '0.85rem' }}>
                  <strong>RBAC:</strong> ⚠️ Authorized user or file owner required
                </div>
              </div>
            </div>

            {/* RBAC Legend */}
            <div style={{ padding: '1rem', backgroundColor: '#e9ecef', borderRadius: '6px' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: '#495057' }}>🛡️ RBAC Access Levels Legend</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0.5rem', fontSize: '0.9rem' }}>
                <div><span style={{ color: '#28a745' }}>✅ Public</span> - No authentication required</div>
                <div><span style={{ color: '#ffc107' }}>⚠️ Restricted</span> - Role-based access required</div>
                <div><span style={{ color: '#dc3545' }}>🔒 Admin Only</span> - Admin or higher privileges required</div>
              </div>
              
              <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
                <strong>Note:</strong> RBAC enforcement depends on smart contract implementation. 
                Some functions may have additional business logic restrictions beyond role requirements.
              </div>
            </div>

          </div>
        </details>
      </section>

      {/* SDK Functions Documentation */}
      <section style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h2>📚 Available SDK Functions</h2>
        <details>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '1rem' }}>
            Click to view all SDK functions with detailed examples and usage
          </summary>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
            
            {/* Authentication & Initialization */}
            <div style={{ border: '1px solid #dee2e6', borderRadius: '6px', padding: '1rem', backgroundColor: 'white' }}>
              <h3 style={{ color: '#0066cc', marginTop: 0 }}>🔐 Authentication & Initialization</h3>
              
              <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
                <strong>init(aadhaar, isNewUser, userData)</strong>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>Purpose:</strong> Initialize SDK with Aadhaar validation
                  <br /><strong>Examples:</strong> 
                  <br /><code>await sdk.init("123412341234", true, {`{name: "John", email: "john@test.com"}`})</code>
                  <br /><code>await sdk.init("987698769876", false, null) // Existing user</code>
                  <br /><code>const result = await sdk.init(aadhaar, isNew, {`{department: "Finance", role: "Manager"}`})</code>
                </p>
              </div>

              <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
                <strong>requestOtp(aadhaar)</strong>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>Purpose:</strong> Request OTP for new user registration
                  <br /><strong>Examples:</strong> 
                  <br /><code>const reqId = await sdk.requestOtp("123412341234")</code>
                  <br /><code>const requestId = await sdk.requestOtp(aadhaarHash)</code>
                  <br /><code>console.log("OTP Request ID:", await sdk.requestOtp("987698769876"))</code>
                </p>
              </div>

              <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
                <strong>submitOtp(requestId, otp, userAddress)</strong>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>Purpose:</strong> Verify OTP and complete registration
                  <br /><strong>Examples:</strong> 
                  <br /><code>await sdk.submitOtp(requestId, "123456", userAddress)</code>
                  <br /><code>await sdk.submitOtp(reqId, otpCode, "0x742d35Cc6551C5e5e8f6B4c47e6", userAddress)</code>
                  <br /><code>const success = await sdk.submitOtp(requestId, "987654", currentUserAddress)</code>
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
                  <br /><strong>Examples:</strong> 
                  <br /><code>await sdk.createUser(aadhaarHash, JSON.stringify({`{name: "John"}`}), publicKey)</code>
                  <br /><code>const userData = {`{name: "Jane", dept: "HR", phone: "+91987654321"}`}</code>
                  <br /><code>await sdk.createUser(hash, JSON.stringify(userData), "04a1b2c3...")</code>
                </p>
              </div>

              <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
                <strong>getUser(aadhaarHash)</strong>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>Purpose:</strong> Retrieve user information
                  <br /><strong>Examples:</strong> 
                  <br /><code>const user = await sdk.getUser(aadhaarHash)</code>
                  <br /><code>{`const {dataJson, publicKey} = await sdk.getUser("0xa1b2c3...")`}</code>
                  <br /><code>console.log(await sdk.getUser(userHash))</code>
                </p>
              </div>

              <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
                <strong>updateUser(aadhaarHash, newDataJson)</strong>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>Purpose:</strong> Update existing user data
                  <br /><strong>Examples:</strong> 
                  <br /><code>await sdk.updateUser(hash, JSON.stringify({`{name: "John Updated"}`}))</code>
                  <br /><code>const newData = {`{dept: "Sales", phone: "+91123456789"}`}</code>
                  <br /><code>await sdk.updateUser(aadhaarHash, JSON.stringify(newData))</code>
                </p>
              </div>

              <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#f8d7da', borderRadius: '4px' }}>
                <strong>getAllUsers()</strong>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>Purpose:</strong> Get list of all users
                  <br /><strong>Examples:</strong> 
                  <br /><code>const users = await sdk.getAllUsers()</code>
                  <br /><code>const userList = await sdk.getAllUsers()</code>
                  <br /><code>console.log("Total users:", (await sdk.getAllUsers()).length)</code>
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
                  <br /><strong>Examples:</strong> 
                  <br /><code>await sdk.uploadFile(buffer, hash, "User", "profile.pdf")</code>
                  <br /><code>const cid = await sdk.uploadFile(fileBuffer, aadhaarHash, "Loan", "agreement.doc")</code>
                  <br /><code>await sdk.uploadFile(docBuffer, userHash, "User", JSON.stringify({`{name: "kyc.pdf"}`}))</code>
                </p>
              </div>

              <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
                <strong>readFile(cid, userAddr)</strong>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>Purpose:</strong> Download and decrypt file from IPFS
                  <br /><strong>Examples:</strong> 
                  <br /><code>const fileBuffer = await sdk.readFile("QmXyz123...", userAddress)</code>
                  <br /><code>const docData = await sdk.readFile(cid)</code>
                  <br /><code>const blob = new Blob([await sdk.readFile(fileCid)])</code>
                </p>
              </div>

              <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
                <strong>getAllFilesForUser(aadhaarHash)</strong>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>Purpose:</strong> List all files for a specific user
                  <br /><strong>Examples:</strong> 
                  <br /><code>const files = await sdk.getAllFilesForUser(aadhaarHash)</code>
                  <br /><code>const userFiles = await sdk.getAllFilesForUser("0xa1b2c3...")</code>
                  <br /><code>console.log("User files:", await sdk.getAllFilesForUser(userHash))</code>
                </p>
              </div>

              <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#f8d7da', borderRadius: '4px' }}>
                <strong>getAllFilesByType(fileType)</strong>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>Purpose:</strong> Get all files of specific type
                  <br /><strong>Examples:</strong> 
                  <br /><code>const userFiles = await sdk.getAllFilesByType("User")</code>
                  <br /><code>const loanFiles = await sdk.getAllFilesByType("Loan")</code>
                  <br /><code>const allDocs = await sdk.getAllFilesByType("Document")</code>
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

            {/* DataManager Functions */}
            <div style={{ border: '1px solid #dee2e6', borderRadius: '6px', padding: '1rem', backgroundColor: 'white' }}>
              <h3 style={{ color: '#e83e8c', marginTop: 0 }}>📊 Data Management</h3>
              
              <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
                <strong>createRecord(recordId, ownerId, collection, dataJson)</strong>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>Purpose:</strong> Create new data record in collection
                  <br /><strong>Limitations:</strong> Unique record ID required, gas fees
                  <br /><strong>Sample:</strong> <code>await sdk.createRecord(recordId, ownerId, "users", JSON.stringify(data))</code>
                </p>
              </div>

              <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
                <strong>getRecord(recordId)</strong>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>Purpose:</strong> Retrieve single record by ID
                  <br /><strong>Limitations:</strong> Requires proper access permissions
                  <br /><strong>Sample:</strong> <code>const record = await sdk.getRecord(recordId)</code>
                </p>
              </div>

              <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
                <strong>getRecordsByCollection(collection)</strong>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>Purpose:</strong> Get all records in a collection
                  <br /><strong>Limitations:</strong> Admin access may be required
                  <br /><strong>Sample:</strong> <code>const records = await sdk.getRecordsByCollection("users")</code>
                </p>
              </div>

              <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#f8d7da', borderRadius: '4px' }}>
                <strong>updateRecord(recordId, newDataJson)</strong>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>Purpose:</strong> Update existing record data
                  <br /><strong>Limitations:</strong> Only record owner or admin
                  <br /><strong>Sample:</strong> <code>await sdk.updateRecord(recordId, JSON.stringify(newData))</code>
                </p>
              </div>

              <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#d4edda', borderRadius: '4px' }}>
                <strong>deleteRecord(recordId)</strong>
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                  <strong>Purpose:</strong> Soft delete a record
                  <br /><strong>Limitations:</strong> Admin or owner privileges required
                  <br /><strong>Sample:</strong> <code>await sdk.deleteRecord(recordId)</code>
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
                            navigator.clipboard.writeText(JSON.stringify(file));
                            showStatus("info", "FileData copied to clipboard");
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
                          📋 Copy FileData
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
          
          {/* CID Download Section */}
          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            border: '2px solid #007bff',
            borderRadius: '8px',
            backgroundColor: '#f0f7ff'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#007bff' }}>
              📥 Download File by CID
            </h3>
            <p style={{ margin: '0 0 1rem 0', color: '#6c757d', fontSize: '0.9rem' }}>
              Enter any IPFS CID to download and decrypt the file (requires access permissions)
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input
                type="text"
                value={downloadFileData}
                onChange={(e) => setDownloadFileData(e.target.value)}
                placeholder='Enter fileData (e.g., ["QmXoY...", "0xAadhaar...", "User", "filename.pdf"])'
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  fontFamily: 'monospace'
                }}
                disabled={downloadingFileData}
              />
              <button
                onClick={handleDownloadByFileData}
                disabled={!downloadFileData.trim() || downloadingFileData}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: downloadingFileData ? '#6c757d' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: downloadingFileData ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  alignSelf: 'flex-start'
                }}
              >
                {downloadingFileData ? '📥 Downloading...' : '📥 Download'}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 5. DataManager Operations */}
      {showDataManagerSection && (
        <section id="dataManagerSection">
          <h2>5. Data Management System</h2>
          <p style={{ color: '#e83e8c', fontWeight: 'bold' }}>
            📊 Create, Read, Update, Delete records in collections
          </p>
          
          {/* Record Creation */}
          <div style={{ marginBottom: '2rem', border: '1px solid #dee2e6', borderRadius: '6px', padding: '1.5rem', backgroundColor: '#f8f9fa' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#495057' }}>Create New Record</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label htmlFor="recordId">Record ID:</label>
                <input
                  type="text"
                  id="recordId"
                  value={recordId}
                  onChange={(e) => setRecordId(e.target.value)}
                  placeholder="unique-record-id"
                />
              </div>

              <div className="form-group">
                <label htmlFor="recordOwner">Owner (Aadhaar):</label>
                <input
                  type="text"
                  id="recordOwner"
                  value={recordOwner}
                  onChange={(e) => setRecordOwner(e.target.value)}
                  placeholder="Leave empty to use current user"
                />
              </div>

              <div className="form-group">
                <label htmlFor="recordCollection">Collection:</label>
                <select
                  id="recordCollection"
                  value={recordCollection}
                  onChange={(e) => setRecordCollection(e.target.value)}
                >
                  <option value="users">Users</option>
                  <option value="products">Products</option>
                  <option value="orders">Orders</option>
                  <option value="documents">Documents</option>
                  <option value="transactions">Transactions</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="recordData">Record Data (JSON):</label>
              <textarea
                id="recordData"
                rows="4"
                value={recordData}
                onChange={(e) => setRecordData(e.target.value)}
                placeholder='{"name":"John","age":30,"status":"active"}'
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={handleCreateRecord} style={{ backgroundColor: '#e83e8c', color: 'white' }}>
                Create Record
              </button>
              <button onClick={handleCheckRecordExists} style={{ backgroundColor: '#17a2b8', color: 'white' }}>
                Check Exists
              </button>
              <button onClick={handleGetRecordMetadata} style={{ backgroundColor: '#6c757d', color: 'white' }}>
                Get Metadata
              </button>
            </div>

            {recordExists !== null && (
              <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: recordExists ? '#d4edda' : '#f8d7da', borderRadius: '4px' }}>
                <strong>Record Status:</strong> {recordExists ? '✅ Exists' : '❌ Not Found'}
              </div>
            )}

            {recordMetadata && (
              <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#e2e3e5', borderRadius: '4px' }}>
                <strong>Record Metadata:</strong>
                <pre style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
                  {JSON.stringify(recordMetadata, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Record Operations */}
          <div style={{ marginBottom: '2rem', border: '1px solid #dee2e6', borderRadius: '6px', padding: '1.5rem', backgroundColor: '#fff' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#495057' }}>Record Operations</h3>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <button onClick={handleGetRecord} style={{ backgroundColor: '#28a745', color: 'white' }}>
                Get Single Record
              </button>
              <button onClick={handleGetAllRecords} style={{ backgroundColor: '#007bff', color: 'white' }}>
                Get All Records
              </button>
              <button onClick={handleGetTotalRecords} style={{ backgroundColor: '#6f42c1', color: 'white' }}>
                Get Total Count
              </button>
              <button
                onClick={() => {
                  setShowUpdateRecordForm(!showUpdateRecordForm);
                  if (!showUpdateRecordForm) {
                    setUpdateRecordId(recordId);
                  }
                }}
                style={{ backgroundColor: '#fd7e14', color: 'white' }}
              >
                {showUpdateRecordForm ? "Cancel Update" : "Update Record"}
              </button>
            </div>

            {totalRecords > 0 && (
              <div style={{ padding: '0.75rem', backgroundColor: '#d1ecf1', borderRadius: '4px', marginBottom: '1rem' }}>
                <strong>Total Records in System:</strong> {totalRecords}
              </div>
            )}

            {/* Update Record Form */}
            {showUpdateRecordForm && (
              <div style={{ background: "#fff3cd", padding: "1rem", borderRadius: "4px", marginBottom: "1rem" }}>
                <h4 style={{ margin: '0 0 1rem 0' }}>Update Record</h4>
                <div className="form-group">
                  <label htmlFor="updateRecordId">Record ID to Update:</label>
                  <input
                    type="text"
                    id="updateRecordId"
                    value={updateRecordId}
                    onChange={(e) => setUpdateRecordId(e.target.value)}
                    placeholder="record-id-to-update"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="updateRecordData">New Data (JSON):</label>
                  <textarea
                    id="updateRecordData"
                    rows="3"
                    value={updateRecordData}
                    onChange={(e) => setUpdateRecordData(e.target.value)}
                    placeholder='{"name":"Jane","age":25,"status":"updated"}'
                  />
                </div>
                <button onClick={handleUpdateRecord} style={{ backgroundColor: '#28a745', color: 'white' }}>
                  Submit Update
                </button>
              </div>
            )}
          </div>

          {/* Search Records */}
          <div style={{ marginBottom: '2rem', border: '1px solid #dee2e6', borderRadius: '6px', padding: '1.5rem', backgroundColor: '#f8f9fa' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#495057' }}>Search Records</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label htmlFor="searchCollection">Collection Filter:</label>
                <select
                  id="searchCollection"
                  value={searchCollection}
                  onChange={(e) => setSearchCollection(e.target.value)}
                >
                  <option value="users">Users</option>
                  <option value="products">Products</option>
                  <option value="orders">Orders</option>
                  <option value="documents">Documents</option>
                  <option value="transactions">Transactions</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="searchOwner">Owner Filter (Aadhaar):</label>
                <input
                  type="text"
                  id="searchOwner"
                  value={searchOwner}
                  onChange={(e) => setSearchOwner(e.target.value)}
                  placeholder="Leave empty for current user"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={handleGetRecordsByCollection} style={{ backgroundColor: '#17a2b8', color: 'white' }}>
                Get by Collection
              </button>
              <button onClick={handleGetRecordsByOwner} style={{ backgroundColor: '#6c757d', color: 'white' }}>
                Get by Owner
              </button>
              <button onClick={handleGetRecordsByCollectionAndOwner} style={{ backgroundColor: '#e83e8c', color: 'white' }}>
                Get by Both
              </button>
              <button
                onClick={() => {
                  setRecords([]);
                  setRecordExists(null);
                  setRecordMetadata(null);
                  setTotalRecords(0);
                }}
                style={{ backgroundColor: '#6c757d', color: 'white' }}
              >
                Clear Results
              </button>
            </div>
          </div>

          {/* Records Display */}
          {records.length > 0 && (
            <div style={{ 
              marginBottom: '2rem', 
              border: '1px solid #dee2e6', 
              borderRadius: '6px', 
              padding: '1.5rem',
              backgroundColor: '#fff'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#495057' }}>
                Records ({records.length})
              </h3>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                {records.map((record, index) => (
                  <div key={index} style={{
                    border: '1px solid #e9ecef',
                    borderRadius: '4px',
                    padding: '1rem',
                    backgroundColor: '#f8f9fa'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '0.5rem'
                    }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#495057' }}>
                        Record #{index + 1}
                      </div>
                      <button
                        onClick={() => handleDeleteRecord(record.recordId || `record-${index}`)}
                        style={{
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                    <pre style={{
                      margin: 0,
                      fontSize: '0.85rem',
                      background: '#fff',
                      padding: '0.75rem',
                      borderRadius: '3px',
                      overflow: 'auto',
                      maxHeight: '200px',
                      border: '1px solid #dee2e6'
                    }}>
                      {JSON.stringify(record, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}

          {records.length === 0 && (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '6px',
              color: '#6c757d'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>No Records Found</h4>
              <p style={{ margin: 0 }}>Create some records or use the search functions to load existing data.</p>
            </div>
          )}

          {/* Raw Data Debug */}
          <details style={{ marginTop: '1rem' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: '#6c757d' }}>
              Show Raw Record Data (Debug)
            </summary>
            <pre style={{ 
              background: '#f8f9fa', 
              padding: '1rem', 
              borderRadius: '4px', 
              fontSize: '0.8rem',
              overflow: 'auto',
              border: '1px solid #dee2e6'
            }}>
              {JSON.stringify({
                records,
                totalRecords,
                recordExists,
                recordMetadata
              }, null, 2)}
            </pre>
          </details>
        </section>
      )}

      {/* 6. Admin Create User Flow */}
      {showAdminSection && (
        <section id="adminSection">
          <h2>6. Admin Create User Flow</h2>
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
          <h2>7. Function Role Assignment</h2>
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
          <h2>8. Role Members Management</h2>
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
          <h2>9. Role Functions Management</h2>
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