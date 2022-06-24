<h1 align="center">Interface and Dashboard for Smart Meter Data in Orbit-DB</h1>

<p align="center">
  <img 
  src="./images/OrbitDB.png"
  raw=true 
  style="height:200px"
  />
</p>



## Background

This is a dashboard and API for BlockPro - the Blockchain based proof of existence for renewable energy.

The dashboard displays all meter data that was stored in the Doichain and backed up in the IPFS. Therefore, orbit-db is used, where the data can be queried by date, id, meter_id etc. 

The API is an interface for the BlockPro market place. At the market place electricity consumers and producers come together. An electricity transaction is sent to BlockPro via Rest API and stored in the Doichain Blockchain. Data from the offer like meter_id, date and amount of electricity ordered are also stored in OrbitDB. 

If the production and consumption of the ordered electricity has taken place, a matching between meter data and the order is sent back to the market place.

## Deployed at

<a href="https://interface.blockpro.energy">OrbitDB Dashboard</a>

Interface: 

https://interface.blockpro.energy

## Get Started

1. git clone this repo 
2. run ```npm i``` in root directory
3. run ```npm start``` 
4. run in different terminal ```npm i``` in root/client
5. in same terminal run ```npm start``` 
6. Or run ```npm run build``` to create production build

## Contributing

<a href="https://github.com/stallingerl/jwt-project/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=stallingerl/jwt-project" />
</a>

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[MIT © 2022 Lena Stallinger.](./LICENSE.txt)