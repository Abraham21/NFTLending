// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Importing OpenZeppelin's ERC721 interface and SafeMath library for safe arithmetic operations
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract NFTLending {
    using SafeMath for uint256;

    // Loan struct to hold loan details
    struct Loan {
        address lender;
        address borrower;
        uint256 tokenId;
        address nftAddress;
        uint256 loanAmount;
        uint256 dueDate;
        bool isRepaid;
    }

    // State variables
    uint256 public totalLoanVolume;
    uint256 public activeLoansCount;
    Loan[] public loans;

    // Mapping from loan ID to owner address to keep track of loan ownership
    mapping(uint256 => address) public loanToOwner;

    // Event declarations
    event LoanCreated(uint256 indexed loanId, address indexed borrower, uint256 loanAmount);
    event LoanRepaid(uint256 indexed loanId);
    event LoanDefaulted(uint256 indexed loanId);

    // Modifier to check if the caller is the borrower of the loan
    modifier onlyBorrower(uint256 loanId) {
        require(msg.sender == loans[loanId].borrower, "Caller is not the borrower");
        _;
    }

    // Modifier to check if the loan is due and not repaid
    modifier loanIsDue(uint256 loanId) {
        require(block.timestamp > loans[loanId].dueDate, "Loan is not due yet");
        require(!loans[loanId].isRepaid, "Loan is already repaid");
        _;
    }

    // Function to create a new loan
    function createLoan(address _nftAddress, uint256 _tokenId, uint256 _loanAmount, uint256 _loanDuration) external {
        uint256 loanId = loans.length;
        loans.push(Loan({
            lender: address(0),
            borrower: msg.sender,
            tokenId: _tokenId,
            nftAddress: _nftAddress,
            loanAmount: _loanAmount,
            dueDate: block.timestamp.add(_loanDuration),
            isRepaid: false
        }));
        loanToOwner[loanId] = msg.sender;
        activeLoansCount = activeLoansCount.add(1);
        totalLoanVolume = totalLoanVolume.add(_loanAmount);

        // Transfer the NFT to this contract for escrow
        IERC721(_nftAddress).transferFrom(msg.sender, address(this), _tokenId);

        emit LoanCreated(loanId, msg.sender, _loanAmount);
    }

    // Function for lenders to fund a loan
    function fundLoan(uint256 loanId) external payable {
        Loan storage loan = loans[loanId];
        require(loan.lender == address(0), "Loan is already funded");
        require(msg.value == loan.loanAmount, "Incorrect loan amount");

        loan.lender = msg.sender;

        // Transfer loan amount to borrower
        payable(loan.borrower).transfer(msg.value);
    }

    // Function for borrowers to repay a loan
    function repayLoan(uint256 loanId) external payable onlyBorrower(loanId) {
        Loan storage loan = loans[loanId];
        require(msg.value == loan.loanAmount, "Incorrect repayment amount");
        require(!loan.isRepaid, "Loan is already repaid");
        require(block.timestamp <= loan.dueDate, "Cannot repay, loan is overdue");

        loan.isRepaid = true;
        activeLoansCount = activeLoansCount.sub(1);

        // Return the NFT to the borrower
        IERC721(loan.nftAddress).transferFrom(address(this), loan.borrower, loan.tokenId);

        // Transfer the repayment to the lender
        payable(loan.lender).transfer(msg.value);

        emit LoanRepaid(loanId);
    }

    // Function for lenders to claim the NFT if the loan is not repaid in time
    function claimCollateral(uint256 loanId) external loanIsDue(loanId) {
        Loan storage loan = loans[loanId];
        require(loan.lender == msg.sender, "Caller is not the lender");

        activeLoansCount = activeLoansCount.sub(1);

        // Transfer the NFT to the lender
        IERC721(loan.nftAddress).transferFrom(address(this), loan.lender, loan.tokenId);

        emit LoanDefaulted(loanId);
    }

    // Function to view loan details
    function viewLoan(uint256 loanId) external view returns (Loan memory) {
        return loans[loanId];
    }
}
