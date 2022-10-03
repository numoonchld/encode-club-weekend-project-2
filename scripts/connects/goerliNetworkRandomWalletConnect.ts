import { ethers } from 'ethers'
import { Ballot__factory } from '../../typechain-types'
import convertStringArrayToBytes32 from '../helpers/convertStringArrayToBytes32'

export default async function goerliNetworkRandomWalletConnect(
  PROPOSALS: string[],
) {
  console.log('Running Goerli Network Connect and Deploy with a random wallet!')
  console.log('Ballot proposals array:', PROPOSALS)

  // setup provider
  const providerWithSharedAPIKey = ethers.getDefaultProvider('goerli')

  // setup wallet and connect to provider as signer
  const wallet = ethers.Wallet.createRandom()
  const signer = wallet.connect(providerWithSharedAPIKey)

  // verify balance for deployment
  const balanceBN = await signer.getBalance()
  const balance = Number(ethers.utils.formatEther(balanceBN))
  console.log(balanceBN, balance)

  if (balance < 0.01) {
    throw new Error('Not enough balance')
  } else {
    // perform deployment
    const ballotFactory = new Ballot__factory(signer)
    const ballotContract = await ballotFactory.deploy(
      convertStringArrayToBytes32(PROPOSALS),
    )
    await ballotContract.deployed()

    return ballotContract
  }
}
