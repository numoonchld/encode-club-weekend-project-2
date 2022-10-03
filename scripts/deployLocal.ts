// import { ethers } from 'ethers'
import { ethers as hardhatEthers } from 'hardhat'
import localNetworkConnect from '../scripts/connects/localNetworkConnect'

import PROPOSALS from './data/ballotProposals'

async function main() {
  console.log('\n')
  /* LOCAL DEPLOYMENT OF BALLOT CONTRACT */

  // deploy contracts
  console.log('\n')
  console.log('Deploy Contract: ===============================')

  const localBallotContract = await localNetworkConnect(PROPOSALS)

  console.log('\n')
  console.log('Contract deployed at address:')
  console.log(localBallotContract.address)
  console.log('\n')

  // accounts
  console.log('Extracting network accounts: ===============================')

  const accounts = await hardhatEthers.getSigners()
  const chairPersonAccount = accounts[0]

  console.log('Chairperson account address:', chairPersonAccount.address)

  const teamMemberAccountA = accounts[1]
  const teamMemberAccountB = accounts[2]
  const teamMemberAccountC = accounts[3]

  console.log('Team member A account address:', teamMemberAccountA.address)
  console.log('Team member B account address:', teamMemberAccountB.address)
  console.log('Team member C account address:', teamMemberAccountC.address)

  // give voting rights
  console.log('\n')
  console.log(
    'Giving voter rights to accounts: ===============================',
  )

  await localBallotContract
    .connect(chairPersonAccount)
    .giveRightToVote(teamMemberAccountA.address)
  console.log(
    'Account with address: ',
    teamMemberAccountA.address,
    'has voter weight: \n',
    (await localBallotContract.voters(teamMemberAccountA.address)).weight,
    '\n\n',
    'Voter object for this address: ',
    await localBallotContract.voters(teamMemberAccountA.address),
  )

  await localBallotContract
    .connect(chairPersonAccount)
    .giveRightToVote(teamMemberAccountB.address)
  console.log(
    'Account with address: ',
    teamMemberAccountB.address,
    'has voter weight: \n',
    (await localBallotContract.voters(teamMemberAccountB.address)).weight,
    '\n\n',
    'Voter object for this address: ',
    await localBallotContract.voters(teamMemberAccountB.address),
  )

  await localBallotContract
    .connect(chairPersonAccount)
    .giveRightToVote(teamMemberAccountC.address)
  console.log(
    'Account with address: ',
    teamMemberAccountC.address,
    'has voter weight: \n',
    (await localBallotContract.voters(teamMemberAccountC.address)).weight,
    '\n\n',
    'Voter object for this address: ',
    await localBallotContract.voters(teamMemberAccountC.address),
  )

  // casting votes
  console.log('\n')
  console.log('Casting votes: ===============================')

  // await localBallotContract.connect(chairPersonAccount).vote(0)
  await localBallotContract.connect(teamMemberAccountA).vote(1)
  await localBallotContract.connect(teamMemberAccountB).vote(1)

  console.log(
    'Proposal 1 votes: ',
    (await localBallotContract.proposals(0)).voteCount,
  )
  console.log(
    'Proposal 2 votes: ',
    (await localBallotContract.proposals(1)).voteCount,
  )
  console.log(
    'Proposal 3 votes: ',
    (await localBallotContract.proposals(2)).voteCount,
  )

  // delegating votes
  console.log('\n')
  console.log('Delegating votes: ===============================')

  await localBallotContract
    .connect(teamMemberAccountC)
    .delegate(chairPersonAccount.address)
  await localBallotContract.connect(chairPersonAccount).vote(1)

  console.log(
    'Proposal 1 votes: ',
    (await localBallotContract.proposals(0)).voteCount,
  )
  console.log(
    'Proposal 2 votes: ',
    (await localBallotContract.proposals(1)).voteCount,
  )
  console.log(
    'Proposal 3 votes: ',
    (await localBallotContract.proposals(2)).voteCount,
  )

  // querying results
  console.log('\n')
  console.log('Querying results: ===============================')

  console.log(
    'Index of winning proposal:',
    await localBallotContract.winningProposal(),
  )

  console.log(
    'Name of winning proposal:',
    hardhatEthers.utils.parseBytes32String(
      await localBallotContract.winnerName(),
    ),
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
