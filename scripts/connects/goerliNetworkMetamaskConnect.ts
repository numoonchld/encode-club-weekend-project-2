import { ethers } from 'ethers'
import { Ballot__factory } from '../../typechain-types'
import convertStringArrayToBytes32 from '../helpers/convertStringArrayToBytes32'

import dotenv from 'dotenv'
dotenv.config()

export default async function goerliNetworkMetamaskConnect(
  PROPOSALS: string[],
) {
  console.log('Running Goerli Network Connect and Deploy with API Key!')
  console.log('Ballot proposals array:', PROPOSALS)

  // setup provider
  const provider = new ethers.providers.AlchemyProvider(
    'goerli',
    `${process.env.ALCHEMY_API_KEY}`,
  )

  // setup wallet and connect to provider as signer
  const wallet = new ethers.Wallet(`${process.env.GOERLI_PRIVATE_KEY}`)
  const signer = wallet.connect(provider)

  // verify balance for deployment
  const balanceBN = await signer.getBalance()
  const balance = Number(ethers.utils.formatEther(balanceBN))
  console.log(balanceBN, balance)

  if (balance < 0.01) {
    throw new Error('Not enough balance')
  } else {
    const ballotFactory = new Ballot__factory(signer)
    const ballotContract = await ballotFactory.deploy(
      convertStringArrayToBytes32(PROPOSALS),
    )
    await ballotContract.deployed()

    return [ballotContract, signer, wallet, provider]
  }
}

export async function validateGoerliMetaMaskBalance() {
  console.log(
    'Validating Metamask wallet balance for Goerli transactions! ==================',
  )
  // setup provider
  const provider = new ethers.providers.AlchemyProvider(
    'goerli',
    `${process.env.ALCHEMY_API_KEY}`,
  )
  // const wallet = ethers.Wallet.createRandom()
  const wallet = new ethers.Wallet(`${process.env.GOERLI_PRIVATE_KEY}`)
  const signer = wallet.connect(provider)

  // verify balance for deployment
  const balanceBN = await signer.getBalance()
  const balance = Number(ethers.utils.formatEther(balanceBN))
  console.log(balanceBN, balance)

  if (balance < 0.01) return false
  return true
}
