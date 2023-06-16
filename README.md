# **Inner Circles dApp**
 
The scraping part is done in 2 steps:

1. Instagram-private-api (https://github.com/dilame/instagram-private-api) is used to get a valid login sessionid
2. An API wrapper is built on top of a modified version of instagram scraper (https://github.com/drawrowfly/instagram-scraper). The modified version console logs the scraping output while the API wrapper feeds back to the GET request caller the output. The GET request needs to send the sessionid in order for the scraping to work

Example NFT picture: 
[link](ipfs://bafybeihbh6yup53quguma2qze3o7v6m6cef3cvu3qlap3jvc5lzymnmo7i)