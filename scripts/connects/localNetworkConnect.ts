import { ethers } from 'hardhat'
import convertStringArrayToBytes32 from '../helpers/convertStringArrayToBytes32'

export default async function localNetworkConnect(PROPOSALS: string[]) {
  console.log('Running Local Network Connect and Deploy!')
  console.log(
    'Ballot proposals array received for Contract Deployment:',
    PROPOSALS,
  )

  const ballotFactory = await ethers.getContractFactory('Ballot')
  const ballotContract = await ballotFactory.deploy(
    convertStringArrayToBytes32(PROPOSALS),
  )
  await ballotContract.deployed()

  return ballotContract
}
