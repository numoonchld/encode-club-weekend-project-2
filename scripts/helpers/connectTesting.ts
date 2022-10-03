import { validateGoerliMetaMaskBalance } from '../connects/goerliNetworkMetamaskConnect'

async function main() {
  /* GOERLI NETWORK METAMASK WALLET BALaNCE TESTING */
  if (await validateGoerliMetaMaskBalance()) {
    console.log('Sufficient Metamask wallet balance found!')
  } else {
    console.log('Metamask wallet balance: No bueno!')
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
