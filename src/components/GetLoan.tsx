import { useAccount } from "@metamask/sdk-react-ui";

const GetLoan = () => {

    const { isConnected } = useAccount();

    return (

        <div>
            {isConnected ? 'NFTs here': <p>Please connect your wallet!</p>}
        </div>
    );
}

export default GetLoan;