import { expect } from 'chai'
import { ethers } from 'hardhat'
import { Ballot } from '../typechain-types'

const PROPOSALS = ['Proposal 1', 'Proposal 2', 'Proposal 3']

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = []
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]))
  }
  return bytes32Array
}

describe('Ballot', function () {
  let ballotContract: Ballot

  beforeEach(async function () {
    const ballotFactory = await ethers.getContractFactory('Ballot')
    ballotContract = await ballotFactory.deploy(
      convertStringArrayToBytes32(PROPOSALS),
    )
    await ballotContract.deployed()
  })

  describe('when the contract is deployed', function () {
    it('has the provided proposals', async function () {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index)
        expect(ethers.utils.parseBytes32String(proposal.name)).to.eq(
          PROPOSALS[index],
        )
      }
    })
    it('has zero votes for all proposals', async function () {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index)
        expect(proposal.voteCount).to.eq(0)
      }
    })
    it('sets the deployer address as chairperson', async function () {
      const accounts = await ethers.getSigners()
      const contractDeployer = accounts[0].address

      const chairPerson = await ballotContract.chairperson()

      expect(chairPerson).to.eq(contractDeployer)
    })
    it('sets the voting weight for the chairperson as 1', async function () {
      const accounts = await ethers.getSigners()
      const contractDeployer = accounts[0].address

      const voterDetails = await ballotContract.voters(contractDeployer)
      expect(voterDetails.weight).to.eq(1)
    })
  })

  describe('when the chairperson interacts with the giveRightToVote function in the contract', function () {
    it('gives right to vote for another address', async function () {
      const accounts = await ethers.getSigners()
      const anotherAddress = accounts[1].address

      await ballotContract.connect(accounts[0]).giveRightToVote(anotherAddress)

      const voterDetails = await ballotContract.voters(anotherAddress)
      expect(voterDetails.weight).to.eq(1)
    })
    it('can not give right to vote for someone that has voted', async function () {
      const accounts = await ethers.getSigners()
      const accountVoting = accounts[1]

      await ballotContract
        .connect(accounts[0])
        .giveRightToVote(accountVoting.address)

      await ballotContract.connect(accountVoting).vote(0)

      await expect(
        ballotContract
          .connect(accounts[0])
          .giveRightToVote(accountVoting.address),
      ).to.be.revertedWith('The voter already voted.')
    })
    it('can not give right to vote for someone that has already voting rights', async function () {
      const accounts = await ethers.getSigners()
      const accountVoting = accounts[1]

      await ballotContract
        .connect(accounts[0])
        .giveRightToVote(accountVoting.address)

      await ballotContract.connect(accountVoting).vote(0)

      await expect(
        ballotContract
          .connect(accounts[0])
          .giveRightToVote(accountVoting.address),
      ).to.be.revertedWith('The voter already voted.')
    })
  })

  describe('when the voter interact with the vote function in the contract', function () {
    it('should register the vote', async () => {
      const accounts = await ethers.getSigners()
      const accountVoting = accounts[1]

      await ballotContract
        .connect(accounts[0])
        .giveRightToVote(accountVoting.address)

      await ballotContract.connect(accountVoting).vote(0)

      const voterDetails = await ballotContract.voters(accountVoting.address)
      expect(voterDetails.weight).to.eq(1)
    })
  })

  describe('when the voter interact with the delegate function in the contract', function () {
    it('should transfer voting power', async () => {
      const accounts = await ethers.getSigners()
      const accountSendingVotingPower = accounts[1]
      const accountReceivingVotingPower = accounts[2]

      await ballotContract
        .connect(accounts[0])
        .giveRightToVote(accountSendingVotingPower.address)

      await ballotContract
        .connect(accounts[0])
        .giveRightToVote(accountReceivingVotingPower.address)

      await ballotContract
        .connect(accountSendingVotingPower)
        .delegate(accountReceivingVotingPower.address)

      expect(
        (await ballotContract.voters(accountSendingVotingPower.address))
          .delegate,
      ).to.eq(accountReceivingVotingPower.address)
    })
  })

  describe('when the an attacker interact with the giveRightToVote function in the contract', function () {
    it('should revert', async () => {
      const accounts = await ethers.getSigners()
      const attackerAccount = accounts[9]
      const randomAccount = accounts[8]

      await expect(
        ballotContract
          .connect(attackerAccount)
          .giveRightToVote(randomAccount.address),
      ).to.be.revertedWith('Only chairperson can give right to vote.')
    })
  })

  describe('when the an attacker interact with the vote function in the contract', function () {
    it('should revert', async () => {
      const accounts = await ethers.getSigners()
      const attackerAccount = accounts[9]

      await expect(
        ballotContract.connect(attackerAccount).vote(1),
      ).to.be.revertedWith('Has no right to vote')
    })
  })

  describe('when the an attacker interact with the delegate function in the contract', function () {
    it('should revert', async () => {
      const accounts = await ethers.getSigners()
      const attackerAccount = accounts[9]
      const randomAccount = accounts[9]

      await expect(
        ballotContract.connect(attackerAccount).delegate(randomAccount.address),
      ).to.be.revertedWith('You have no right to vote')
    })
  })

  describe('when someone interact with the winningProposal function before any votes are cast', function () {
    it('should return 0', async () => {
      expect(await ballotContract.winningProposal()).to.eq(0)
    })
  })

  describe('when someone interact with the winningProposal function after one vote is cast for the first proposal', function () {
    // TODO
    it('should return 0', async () => {
      const accounts = await ethers.getSigners()
      const votingAccount = accounts[3]

      await ballotContract
        .connect(accounts[0])
        .giveRightToVote(votingAccount.address)
      await ballotContract.connect(votingAccount).vote(0)

      expect(await ballotContract.winningProposal()).to.eq(0)
    })
  })

  describe('when someone interact with the winnerName function before any votes are cast', function () {
    it('should return name of proposal 0', async () => {
      // console.log(await ballotContract.winnerName())
      expect(await ballotContract.winnerName()).to.eq(
        ethers.utils.formatBytes32String(PROPOSALS[0]),
      )
    })
  })

  describe('when someone interact with the winnerName function after one vote is cast for the first proposal', function () {
    it('should return name of proposal 0', async () => {
      const accounts = await ethers.getSigners()
      const votingAccount = accounts[3]

      await ballotContract
        .connect(accounts[0])
        .giveRightToVote(votingAccount.address)
      await ballotContract.connect(votingAccount).vote(0)

      expect(await ballotContract.winnerName()).to.eq(
        ethers.utils.formatBytes32String(PROPOSALS[0]),
      )
    })
  })

  describe('when someone interact with the winningProposal function and winnerName after 5 random votes are cast for the proposals', function () {
    it('should return the name of the winner proposal', async () => {
      // const newBallotFactory = await ethers.getContractFactory('Ballot')
      // const newBallotContract = await newBallotFactory.deploy(
      //   convertStringArrayToBytes32(PROPOSALS),
      // )
      // await newBallotContract.deployed()

      const accounts = await ethers.getSigners()

      const accountA = accounts[4]
      const accountB = accounts[5]
      const accountC = accounts[6]
      const accountD = accounts[7]
      const accountE = accounts[8]

      await ballotContract
        .connect(accounts[0])
        .giveRightToVote(accountA.address)

      await ballotContract.connect(accountA).vote(0)

      await ballotContract
        .connect(accounts[0])
        .giveRightToVote(accountB.address)

      await ballotContract.connect(accountB).vote(1)

      await ballotContract
        .connect(accounts[0])
        .giveRightToVote(accountC.address)

      await ballotContract.connect(accountC).vote(0)

      await ballotContract
        .connect(accounts[0])
        .giveRightToVote(accountD.address)

      await ballotContract.connect(accountD).vote(2)

      await ballotContract
        .connect(accounts[0])
        .giveRightToVote(accountE.address)

      await ballotContract.connect(accountE).vote(0)

      const winnerProposalName = await ballotContract.winnerName()

      expect(ethers.utils.formatBytes32String(PROPOSALS[0])).to.include(
        winnerProposalName,
      )
    })
  })
})
