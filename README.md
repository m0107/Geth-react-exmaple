## 🔐 Role Management

- `async createRole(roleName, adminRoleName)`  
  Create a new role with an associated admin role.

- `async grantRole(roleName, addr)`  
  Add a user to a role.

- `async revokeRole(roleName, addr)`  
  Remove a user from a role.

- `async assignFunctionRolesFor(roleName, fnSig)`  
  Assign a function (by signature) to a role.

- `async removeFunctionRoleFor(roleName, fnSig)`  
  De-assign a function from a role.

---

## 👤 User Management

- `async createUser(aadhaarHash, dataJson)`  
  Create a user with Aadhaar hash and additional data.

- `async createDefaultAdmin(aadhaarHash, dataJson)`  
  Create the default admin user.

- `async updateUser(aadhaarHash, newDataJson)`  
  Update user details on-chain.

- `async getUser(aadhaarHash)`  
  Retrieve user details by Aadhaar hash.

- `async getAllUsers()`  
  List all registered users.

---

## 📁 File Handling

- `async getAllFilesForUser(aadhaarHash)`  
  Retrieve all files uploaded by the user.

- `async uploadFile(buf, aadhaarHash, fileType, metadata)`  
  Upload a file buffer to IPFS and register it on-chain.

- `async readFile(cid, userAddr = this.address)`  
  Decrypt and read a file from IPFS by CID.

---

## 💸 Loan Management

- `async createLoan(loanIdHash, userAadhaarHash, loanDetailsJson)`  
  Create a new loan record.

- `async updateLoan(loanIdHash, newDataJson)`  
  Update details of an existing loan.

- `async getLoanByLoanId(loanIdHash)`  
  Fetch loan information by ID.

- `async getAllLoansByUser(userAadhaarHash)`  
  List all loans taken by a user.
