// import { ethers as hardhatEthers } from 'hardhat'
import goerliNetworkMetamaskConnect from './connects/goerliNetworkMetamaskConnect'

import PROPOSALS from './data/ballotProposals'

async function main() {
  console.log('\n')

  /* GOERLI DEPLOYMENT OF BALLOT CONTRACT */
  try {
    // deploy contracts
    console.log('\n')
    console.log('Deploy Contract: ===============================')

    const [
      goerliBallotContract,
      signer,
      wallet,
      provider,
    ] = await goerliNetworkMetamaskConnect(PROPOSALS)

    console.log({
      goerliBallotContract,
      signer,
      wallet,
      provider,
    })
  } catch (error) {
    console.log(error)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
