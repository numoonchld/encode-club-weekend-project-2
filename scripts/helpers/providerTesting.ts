import { ethers } from 'hardhat'

import dotenv from 'dotenv'
dotenv.config()

async function main() {
  console.log('Using shared ethers API Key ---------------------------------')
  const providerWithSharedAPIKey = ethers.getDefaultProvider('goerli')
  const lastBlockSharedAPIKey = await providerWithSharedAPIKey.getBlock(
    'latest',
  )
  console.log({ lastBlockSharedAPIKey })

  console.log('Using custom API Key ---------------------------------')
  const providerOptions = { alchemy: `${process.env.ALCHEMY_API_KEY}` }
  console.log('default provider method: -------------')
  const providerWithCustomAPIKey = ethers.getDefaultProvider(
    'goerli',
    providerOptions,
  )
  const lastBlockCustomAPIKey = await providerWithCustomAPIKey.getBlock(
    'latest',
  )
  console.log({ lastBlockCustomAPIKey })

  console.log('alchemy provider method: ----------------')
  const alchemyProvider = new ethers.providers.AlchemyProvider(
    'goerli',
    `${process.env.ALCHEMY_API_KEY}`,
  )
  const lastBlockAlchemyProvider = await alchemyProvider.getBlock('latest')
  console.log({ lastBlockAlchemyProvider })
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
