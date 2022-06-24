// server/index.js
import app from "./app.js";
const HTTP_PORT = process.env.HTTP_PORT || 3001;
import * as IPFS from 'ipfs';
import http from "http"
import OrbitDB from 'orbit-db';
import { s } from "./doichain/sharedState.js";
import { createOrReadSeed } from "./doichain/createOrReadSeed.js";
import { network, createNewWallet } from "doichainjs-lib"
import ElectrumClient from "@codewarriorr/electrum-client-js"
import bootstrapers from './config/bootstrapers.js'


async function main() {

  var id = {
    "id": "QmWbwLZ2LvQaTQkq7XgByzSW8NY9tQaS3cnJkhHnfoSTEi",
    "privKey": "CAAS4QQwggJdAgEAAoGBAL0RYzn+t3xJphz3dO9psZq7lKH1iMYL9tHifIkeRFFCJTi6I0hFeULMPLT+rMzcbrJN3B6BCU/1Y756ZHlZB0U4q88jQY/y68xMLhZ+XePrqKd0nUGW3+VE1XbRNsAOAb95tsuOS4KAo2+c9Cq0rO+/kJ0DUSn2WMfC79KrHDBlAgMBAAECgYASIbG/ZRMZo0J/8qdPMnaq3SRi59YnEAyqkirZR4LLvCkvqIIrsyXu5wFHZkkSGG2xQdBDSKKo/WKEaN5r2MLekV9A/aYSRKZv03Rso63kPv9SW0Pwa8TJlAWEKV65sVrh2GPVMGZ3m4zPUnqMbbvziEpvgcdb4Iz0+CESOVHSHQJBANwK6NcQeTKIEYJfv0yQaGEgEs135nUUMWnEYid9YsjimUxySyu6NykS6fi6I5pZDmR1+7KGQBF9zhGh7OX+jGsCQQDb9rT5qph0B35D3oxOAhx6N7aj4BVznhwD1ePKEd9IcDKMWVUos5caSWjKpGHsaEav3lB+qYcKlHJ/+e9JC2pvAkEAkf7fDErOzzs+us0CZS9vQfoA37kM/GOAgZeeNGtaDsViRzmSLJoqHSOCf9go5TDvfrJVZNb0TWa2Qja4ssUYrwJAdgB1ufJw8t4KOLKtJjQvvskgq+1M1MefU9ds6jyIQj4ef/h0nO8rQqjbFMr21XJjaXmkSS79CQn2Gv2kBtWe9QJBAIdid+7UDsVOmxzAAXsSKRY1x4yIQ/GLaw0c2Ns2zfJQaBcb6c3QPq+IoI2p58j6nVyMUmGd2VcrUluHNkBW3/k=",
    "pubKey": "CAASogEwgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBAL0RYzn+t3xJphz3dO9psZq7lKH1iMYL9tHifIkeRFFCJTi6I0hFeULMPLT+rMzcbrJN3B6BCU/1Y756ZHlZB0U4q88jQY/y68xMLhZ+XePrqKd0nUGW3+VE1XbRNsAOAb95tsuOS4KAo2+c9Cq0rO+/kJ0DUSn2WMfC79KrHDBlAgMBAAE="
  }

  s.id = id.id

  http.createServer(app).listen(HTTP_PORT);
  console.log("Server listening at: https://interface.blockpro.energy" )
 

  // To Do create ElectrumX connection to store Data in Doichain
  global.DEFAULT_NETWORK = network[process.env.DEFAULT_NETWORK]
  // with regtest start doichaind with -acceptnonstdtxn

  let o_options

  // check if seed file is available

  s.addrType = process.env.ADDRESS_TYPE

  switch (s.addrType) {
    case "p2pkh":
      s.purpose = "m/44"
      break;
    case "p2sh":
      s.purpose = "m/49"
      break;
    case "p2wpkh":
      s.purpose = "m/84"
      break;
  }

  s.coinType = global.DEFAULT_NETWORK.name == "mainnet" ? 0 : 1
  s.account = 0
  s.basePath = `${s.purpose}/${s.coinType}/${s.account}`

  global.client = new ElectrumClient(process.env.ELECTRUM_CLIENT, 50002, "ssl");
  try {
    await global.client.connect(
      "electrum-client-js", // optional client name
      "1.4.2" // optional protocol version
    )
  } catch (err) {
    console.error(err);
  }

  await createOrReadSeed(s.id)
  s.wallet = await createNewWallet(s.hdkey, s.purpose, s.coinType, o_options, s.addrType, s.id)

  const ipfs = await IPFS.create({
    repo: './ipfs',
    peerId: id,
    start: true,
    EXPERIMENTAL: {
      pubsub: true,
    },
    config: {
      Bootstrap: bootstrapers
    }
  })

  const peers = await ipfs.swarm.peers()
  console.log(`The node now has ${peers.length} peers.`)

  peers.forEach((connection)=>console.log(connection.peer)) 

  // Create IPFS instance
  //const ipfs = await IPFS.create();

  // Create OrbitDB instance
  const orbitDb = await OrbitDB.createInstance(ipfs, { directory: './orbitdb1' });

  // Create docstore DB
  // const address = '/orbitdb/zdpuArV8iyuGAanQs37r61HnREMExY9KnBmp2ZcxGj5iecsxo/docstoreDB'
  const docstore = await orbitDb.docstore("docstoreDB");
  console.log("Successfully created docstore");

  console.log("address docstore ", docstore.address)

  await docstore.load()

  console.log(ipfs.isOnline())
  console.log(await ipfs.bootstrap.list())

  await docstore.events.on('replicated', () => console.log("Replicated Db"))

  app.set('docstore', docstore)
  app.set('ipfs', ipfs)

 /* setInterval(async () => {
    console.log(`The node now has ${peers.length} peers.`)
  }, 5000)*/
}

main()
