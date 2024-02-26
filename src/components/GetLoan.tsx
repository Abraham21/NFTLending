import { useAccount } from "@metamask/sdk-react-ui";
import { fetchNFTs } from "../utils/Data";
import { useEffect, useState } from "react";

const GetLoan = () => {

    const { isConnected, address } = useAccount();
    const [nfts, setNfts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getNFTs = async () => {
          setIsLoading(true);
          try {
            const fetchedNFTs = await fetchNFTs(address!);
            console.log('fetchedNFTs', fetchNFTs);
          } catch (error) {
            console.error("Failed to fetch NFTs:", error);
            // Handle errors, e.g., show an error message
          } finally {
            setIsLoading(false);
          }
        };
    
        if (address) {
          getNFTs();
        }
      }, [address]);

    return (

        <div>
            {isConnected ? <p>{address}</p> : <p>Please connect your wallet!</p>}
        </div>
    );
}

export default GetLoan;