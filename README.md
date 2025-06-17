async createRole(roleName, adminRoleName) // to create a new role
async grantRole(roleName, addr) // add a user to a role
async revokeRole(roleName, addr) // remove user from role
async assignFunctionRolesFor(roleName, fnSig) // assign function to a role
async removeFunctionRoleFor(roleName, fnSig)  // de-assign function to a role

async createUser(aadhaarHash, dataJson)
async createDefaultAdmin(aadhaarHash, dataJson)
async updateUser(aadhaarHash, newDataJson)
async getUser(aadhaarHash) 
async getAllUsers()

async getAllFilesForUser(aadhaarHash)
async uploadFile(buf, aadhaarHash, fileType, metadata) 
async readFile(cid, userAddr = this.address) 

async createLoan(loanIdHash, userAadhaarHash, loanDetailsJson) 
async updateLoan(loanIdHash, newDataJson)
async getLoanByLoanId(loanIdHash)
async getAllLoansByUser(userAadhaarHash)
