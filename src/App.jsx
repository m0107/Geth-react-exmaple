/* eslint-disable */
import React, { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  // ——— SDK Instance (singleton) ———
  const sdkRef = useRef(null);
  useEffect(() => {
    // Once the UMD script has loaded, window.BlockchainSDK should be a constructor
    console.log("process.env.REACT_APP_RPC_URL", process.env.REACT_APP_RPC_URL);
   console.log("window.BlockchainSDK:", window.BlockchainSDK);
   if (!sdkRef.current) {
     sdkRef.current = new window.BlockchainSDK.default(
       process.env.REACT_APP_RPC_URL,
       process.env.REACT_APP_OTP_ORACLE_PUBLIC_KEY,
       process.env.REACT_APP_IPFS_URL,
       process.env.REACT_APP_BLC_API_BASE,
       process.env.REACT_APP_ENT_API_BASE,
       process.env.REACT_APP_ENT_USERNAME,
       process.env.REACT_APP_ENT_PASSWORD
     );
     console.log("SDK initialized:", sdkRef.current);
   }
  }, []);
   const sdk = sdkRef.current;
      console.log("SDK instance:", sdk);

  // convenience getter
 
  // ——— Status Banner ———
  const [mainStatus, setMainStatus] = useState({
    type: "info",
    text: "Environment: Geth PoA on localhost, IPFS at remote node",
  });
  function showStatus(type, text) {
    setMainStatus({ type, text });
    alert(text.replace(/<[^>]+>/g, ""));
  }

  // ——— Section Visibility States ———
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [showUserSection, setShowUserSection] = useState(false);
  const [showUpdateUserForm, setShowUpdateUserForm] = useState(false);
  const [showLoanSection, setShowLoanSection] = useState(false);
  const [showFileSection, setShowFileSection] = useState(false);

  // ——— “Initialize / Login” Inputs ———
  const [aadhaar, setAadhaar] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newData, setNewData] = useState('{"department":"Finance"}');

  // ——— “User Info” Values ———
  const [userInfo, setUserInfo] = useState(null);
  const [updData, setUpdData] = useState("");

  // ——— “Loan Management” Inputs ———
  const [loanId, setLoanId] = useState("");
  const [loanDetails, setLoanDetails] = useState(
    '{"amount":1000,"term":"12 months"}'
  );
  const [loanList, setLoanList] = useState([]);

  // ——— “File Upload” Inputs ———
  const fileInputRef = useRef(null);
  const [fileMeta, setFileMeta] = useState("report.pdf");
  const [fileList, setFileList] = useState([]);

  const [initialized, setInitialized] = useState(false);

  // ——— Handlers ———

  // 1) Initialize SDK
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
    showStatus("info", "Initializing SDK...");
    try {
      await sdk.init(aadhaar, isNewUser, userData);
      showStatus("success", `SDK ready for Aadhaar ${aadhaar}`);
      setInitialized(true);
      setShowUserSection(true);
      setShowLoanSection(true);
      setShowFileSection(true);
      await loadUser();
    } catch (e) {
      console.error(e);
      showStatus("error", "Init failed: " + e.message);
    }
  };

  // 2) Load User from chain
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

  // 2b) Update User
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

  // 3a) Create Loan
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

  // 3b) List Loans
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

  // 4a) Upload File
  const handleUploadFile = async () => {
    const ah = sdk.web3.utils.keccak256(aadhaar);
    const file = fileInputRef.current.files[0];
    if (!file) return alert("Pick a file");
    try {
      const buf = new Uint8Array(await file.arrayBuffer());
      console.log("File buffer size:", buf.length);
      console.log(sdk, "Uploading file:", file.name, "to IPFS");
      if (buf.length > 1000000) {
        return alert("File too large, max 1MB");
      }
      console.log(typeof(buf), "Buffer type:", buf instanceof Uint8Array ? "Uint8Array" : "Other");
      if (buf.length === 0) {
        return alert("File is empty");
      }
      if (!fileMeta.trim()) {
        return alert("Enter file metadata (name, description, etc.)");
      }
      console.log("File metadata:", fileMeta.trim());
      // Upload to IPFS
      showStatus("info", "Uploading file to IPFS...");
      const { cid } = await sdk.uploadFile(buf, ah, "User", fileMeta.trim());
      showStatus("success", `Uploaded: ${cid}`);
    } catch (e) {
      console.error(e);
      showStatus("error", "uploadFile failed: " + e.message);
    }
  };

  // 4b) List Files
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

  // ——— JSX ———
  return (
    <div className="container">
      <h1>🔐 BlockchainSDK Full Test Suite</h1>

      <div className={`status ${mainStatus.type}`}>
        <strong>Environment:</strong> {mainStatus.text}
      </div>

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

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              id="newUserCheckbox"
              checked={isNewUser}
              onChange={(e) => {
                setIsNewUser(e.target.checked);
                setShowNewUserForm(e.target.checked);
              }}
            />{" "}
            New User Registration
          </label>
        </div>

        {showNewUserForm && (
          <div style={{ background: "#f8f9fa", padding: "1rem", borderRadius: "4px" }}>
            <div className="form-group">
              <label htmlFor="newName">Name:</label>
              <input
                type="text"
                id="newName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="form-group">
              <label htmlFor="newEmail">Email:</label>
              <input
                type="email"
                id="newEmail"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPhone">Phone:</label>
              <input
                type="text"
                id="newPhone"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="+1234567890"
              />
            </div>
            <div className="form-group">
              <label htmlFor="newData">Additional Data (JSON):</label>
              <textarea
                id="newData"
                rows="3"
                value={newData}
                onChange={(e) => setNewData(e.target.value)}
              />
            </div>
          </div>
        )}

        <button onClick={handleInit}>Initialize SDK</button>
      </section>

      {/* 2. User Info */}
      {showUserSection && (
        <section id="userSection">
          <h2>2. User Profile</h2>
          <pre id="userInfo">{JSON.stringify(userInfo, null, 2)}</pre>
          <button onClick={loadUser}>Refresh User</button>
          <button
            onClick={() => {
              setShowUpdateUserForm(!showUpdateUserForm);
              if (!showUpdateUserForm && userInfo) {
                // preload existing info
                setUpdData(JSON.stringify(userInfo, null, 2));
              }
            }}
          >
            {showUpdateUserForm ? "Cancel Update" : "Update User"}
          </button>

          {showUpdateUserForm && (
            <div
              id="updateUserForm"
              style={{ background: "#fff3cd", padding: "1rem", borderRadius: "4px", marginTop: "1rem" }}
            >
              <div className="form-group">
                <label htmlFor="updData">New Data JSON:</label>
                <textarea
                  id="updData"
                  rows="3"
                  value={updData}
                  onChange={(e) => setUpdData(e.target.value)}
                />
              </div>
              <button onClick={handleUpdateUser}>Submit Update</button>
            </div>
          )}
        </section>
      )}

      {/* 3. Loan Management */}
      {showLoanSection && (
        <section id="loanSection">
          <h2>3. Loan Management</h2>
          <div className="form-group">
            <label htmlFor="loanId">Loan ID (string):</label>
            <input
              type="text"
              id="loanId"
              value={loanId}
              onChange={(e) => setLoanId(e.target.value)}
              placeholder="LOAN123"
            />
          </div>
          <div className="form-group">
            <label htmlFor="loanDetails">Loan Details JSON:</label>
            <textarea
              id="loanDetails"
              rows="3"
              value={loanDetails}
              onChange={(e) => setLoanDetails(e.target.value)}
            />
          </div>
          <button onClick={handleCreateLoan}>Create Loan</button>
          <button onClick={handleListLoans}>List Loans</button>
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
          <pre id="fileList">{JSON.stringify(fileList, null, 2)}</pre>
        </section>
      )}
    </div>
  );
}

export default App;