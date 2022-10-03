import { ethers } from 'ethers'
// import localNetworkConnect from '../scripts/connects/localNetworkConnect'
// import goerliNetworkRandomWalletConnect from '../scripts/connects/goerliNetworkRandomWalletConnect'
import goerliNetworkMetamaskConnect from './connects/goerliNetworkMetamaskConnect'

import PROPOSALS from './data/ballotProposals'

async function main() {
  /* GOERLI NETWORK DEPLOYMENT OF BALLOT CONTRACT (METAMASK WALLET)
   */
  // const goerliMetamaskDeployContract = await goerliNetworkMetamaskConnect(
  //   PROPOSALS,
  // )
  // console.log(
  //   'Contract deployed to address: ',
  //   goerliMetamaskDeployContract.address,
  // )
  // for (let count = 0; count < PROPOSALS.length; count++) {
  //   const proposal = await goerliMetamaskDeployContract.proposals(count)
  //   const name = ethers.utils.parseBytes32String(proposal.name)
  //   console.log({ count, name, proposal })
  // }
  /* GOERLI NETWORK DEPLOYMENT OF BALLOT CONTRACT (RANDOMLY GENERATED WALLET) 
    this approach fails as randomly created wallet will not have sufficient balance to deploy contract
    console error: 
      Error: Not enough balance
  */
  // const goerliRandomWalletDeployContract = await goerliNetworkRandomWalletConnect(
  //   PROPOSALS,
  // )
  // for (let count = 0; count < PROPOSALS.length; count++) {
  //   const proposal = await goerliRandomWalletDeployContract.proposals(count)
  //   const name = ethers.utils.parseBytes32String(proposal.name)
  //   console.log({ count, name, proposal })
  // }
  /* LOCAL DEPLOYMENT OF BALLOT CONTRACT */
  // const localBallotContract = await localNetworkConnect(PROPOSALS)
  // for (let count = 0; count < PROPOSALS.length; count++) {
  //   const proposal = await localBallotContract.proposals(count)
  //   const name = ethers.utils.parseBytes32String(proposal.name)
  //   console.log({ count, name, proposal })
  // }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
