import { expect } from 'chai'
import { ethers } from 'hardhat'
import { HelloWorld } from '../typechain-types'

describe('HelloWorld', function () {
  let helloWorldContract: HelloWorld

  beforeEach(async function () {
    const helloWorldFactory = await ethers.getContractFactory('HelloWorld')
    helloWorldContract = (await helloWorldFactory.deploy()) as HelloWorld
    await helloWorldContract.deployed()
    // first account that is displayed in the Hardhats accounts is the default option for deploying address
  })

  it('Should give a Hello World', async function () {
    const helloWorldText = await helloWorldContract.helloWorld()
    expect(helloWorldText).to.equal('Hello World')
  })

  it('Should set owner to deployer account', async function () {
    const accounts = await ethers.getSigners()
    const contractOwner = await helloWorldContract.owner()
    expect(contractOwner).to.equal(accounts[0].address)
  })

  it('Should not allow anyone other than owner to call transferOwnership', async function () {
    const accounts = await ethers.getSigners()
    await expect(
      helloWorldContract
        .connect(accounts[1])
        .transferOwnership(accounts[1].address),
    ).to.be.revertedWith('Caller is not the owner')
  })

  it('Should execute transferOwnership correctly', async function () {
    const accounts = await ethers.getSigners()

    const ownerAccount = accounts[0]
    const newOwnerAccount = accounts[1]

    await helloWorldContract
      .connect(ownerAccount)
      .transferOwnership(newOwnerAccount.address)

    const contractOwner = await helloWorldContract.owner()

    expect(contractOwner).to.equal(accounts[1].address)
  })

  it('Should not allow anyone other than owner to change text', async function () {
    const accounts = await ethers.getSigners()

    await expect(
      helloWorldContract.connect(accounts[1]).setText(accounts[1].address),
    ).to.be.revertedWith('Caller is not the owner')
  })

  it('Should change text correctly', async function () {
    const accounts = await ethers.getSigners()

    const currentText = await helloWorldContract.helloWorld()

    const ownerAccount = accounts[0]

    await helloWorldContract.connect(ownerAccount).setText('Hardhat: Test text')

    expect(currentText).to.not.eq('Hardhat: Test text')

    const newText = await helloWorldContract.helloWorld()
    expect(newText).to.eq('Hardhat: Test text')
  })
})
