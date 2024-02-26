import { ethers } from 'ethers';

// Initialize ethers with Infura using environment variables
const provider = new ethers.JsonRpcProvider(process.env.INFURA_URL);

const erc721ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
];

// Function to fetch ERC-721 tokens for a given address
export async function fetchNFTs(ownerAddress: string) {
    const approvedNFTCollectionForPlatform = process.env.PLATFORM_NFT_CONTRACT_ADDRESS;
    const contract = new ethers.Contract(approvedNFTCollectionForPlatform!, erc721ABI, provider);
    const balance = await contract.balanceOf(ownerAddress);

    const tokenIds = [];
    for (let i = 0; i < balance.toNumber(); i++) {
        const tokenId = await contract.tokenOfOwnerByIndex(ownerAddress, i);
        tokenIds.push(tokenId.toString());
    }

    return tokenIds; // Returns an array of token IDs
}
