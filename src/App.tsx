import {
  MetaMaskButton,
  useAccount,
  useSDK,
  useSignMessage,
} from "@metamask/sdk-react-ui";
import "./App.css";

function AppReady() {
  const {
      data: signData,
      isError: isSignError,
      isLoading: isSignLoading,
      isSuccess: isSignSuccess,
      signMessage,
  } = useSignMessage({
      message: "gm wagmi frens",
  });

  const { isConnected } = useAccount();

  return (
      <div className="App">
          <header className="App-header">
              <MetaMaskButton theme={"light"} color="white"></MetaMaskButton>
              <nav className="crumbs">
                <ol>
                  <li className="crumb"><a href="#">Bikes</a></li>
                  <li className="crumb"><a href="#">BMX</a></li>
                  <li className="crumb">Jump Bike 3000</li>
                </ol>
              </nav>
              {isConnected && (
                  <>
                      <div style={{ marginTop: 20 }}>
                          <button
                              disabled={isSignLoading}
                              onClick={() => signMessage()}
                          >
                              Sign message
                          </button>
                          {isSignSuccess && <div>Signature: {signData}</div>}
                          {isSignError && <div>Error signing message</div>}
                      </div>
                  </>
              )}
          </header>
      </div>
  );
}

function App() {
  const { ready } = useSDK();

  if (!ready) {
      return <div>Loading...</div>;
  }

  return <AppReady />;
}

export default App;