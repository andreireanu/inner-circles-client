import clientPromise from '../../lib/mongodb'
import { InferGetServerSidePropsType } from 'next'
import Head from 'next/head';
import { SetStateAction, useEffect, useState } from 'react'
import { enrollUser } from '../../lib/crud'
import { IgApiClient } from '../../node_modules/instagram-private-api';
import { API_URL, contractAddress } from '../../config';

import SendIcon from '@mui/icons-material/Send';
import {
  Button,
  Card,
  CardContent,
  Container,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  TextField,
  Typography
} from '@mui/material';
import { blue } from '@mui/material/colors';

import router, { useRouter } from 'next/router';
import { NotAuthRedirectWrapper } from '../../components/NotAuthRedirectWrapper';
import TitleView from '../../components/TitleView';
import { DataGrid, GridCellParams, GridColDef, GridRowHeightParams } from '@mui/x-data-grid';
import { numberToHex, stringToHex } from '../../utils/hexUtils';
import { QUERY_URL, NFT_URL } from '../../config';
import { buyNft } from '../../utils/buyNft';

interface NftFormat {
  id: string,
  identifier: string;
  name: string;
  url: string;
  balance: number;
  priceAndToken: { price: number, buyToken: string };
}

const FanDashboardPage = ({ data, env }: any) => {

  const [fan, setFan] = useState(data.fanData || [])
  const [instaHandle, setTwitterHandle] = useState('');

  const handleTwitterHandleInputChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setTwitterHandle(event.target.value);
  };

  const columns: GridColDef[] = [
    { field: 'identifier', headerName: 'Identifier', width: 140, headerAlign: 'center', align: 'center', flex: 1 },
    { field: 'name', headerName: 'Name', width: 140, headerAlign: 'center', align: 'center', flex: 1 },
    {
      field: 'url', headerName: 'Asset', width: 140, headerAlign: 'center', align: 'center', flex: 1,
      renderCell: (params) => (
        <img src={params.value} alt="Nft" width="20%" />
      )
    },
    { field: 'balance', headerName: 'Available for sale', width: 140, headerAlign: 'center', align: 'center', flex: 1 },
    {
      field: 'priceAndToken', headerName: `Price per NFT`, width: 140, headerAlign: 'center', align: 'center', flex: 1,
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word', wordBreak: 'break-word' }}>
          {params.value.price} {params.value.buyToken}
        </div>
      )
    },
    {
      field: 'actions',
      headerName: '',
      width: 120,
      renderCell: (params: GridCellParams) => {
        const handleButtonClick = () => {
          console.log(params.row);
          const splitParts = params.row.identifier.split('-');
          const nftToken = splitParts.slice(0, -1).join('-');
          const nonce = parseInt(splitParts[splitParts.length - 1]);
          let token = params.row.priceAndToken.buyToken;
          let price = params.row.priceAndToken.price;
          buyNft(nftToken, nonce, token, price);
          router.replace('/dashboard');
        };

        return (
          <button
            onClick={handleButtonClick}
            style={{
              padding: 6,
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              borderRadius: 4,
            }}
          >
            BUY
          </button>
        );
      },
    },



  ]

  // Get NFTs
  const [nfts, setNfts] = useState<NftFormat[]>([]);
  useEffect(() => {
    let nftsUri = API_URL + '/accounts/' + contractAddress + '/nfts';
    // Fetch all NFTs in contract
    fetch(nftsUri)
      .then(response => response.json())
      .then(data => {
        try {
          data.forEach((record: any) => {
            let accountUri = NFT_URL + '/' + record.identifier + '/accounts';
            let balance = 0;
            // For each NFT get the number available in the smart contract
            fetch(accountUri)
              .then(response => response.json())
              .then(data => {
                data.forEach((account: any) => {
                  if (account.address === contractAddress) {
                    balance = account.balance;
                    var price: number;
                    // For each NFT get the price from the smart contract
                    fetch(QUERY_URL, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        scAddress: contractAddress,
                        funcName: 'getNftPrice',
                        args: [stringToHex(record.collection), numberToHex(record.nonce)],
                      })
                    })
                      .then(response => response.json())
                      .then(data => {
                        let priceHex = data.data.data.returnData[0];
                        price = Buffer.from(priceHex, 'base64')[0];
                        // For each NFT get the price from the purchasing token identifier
                        fetch(QUERY_URL, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            scAddress: contractAddress,
                            funcName: 'getPaymentToken',
                            args: [stringToHex(record.collection)],
                          })
                        })
                          .then(response => response.json())
                          .then(data => {
                            let buyTokenHex = data.data.data.returnData[0];
                            const buyToken = Buffer.from(buyTokenHex, 'base64').toString('utf-8');
                            const nftInstance = {
                              id: record.nonce,
                              identifier: record.identifier,
                              name: record.name,
                              url: record.url,
                              balance: balance,
                              priceAndToken: { price: price, buyToken: buyToken },
                            };
                            setNfts((prevState: NftFormat[]) => [...prevState, nftInstance]);
                          })
                          .catch(error => {
                          });
                      })
                      .catch(error => {
                      });
                  }
                })
              })
              .catch(error => {
              });
          })
        } catch (error) {
        }
      })
      .catch(error => {
      });
  }, []);

  return (
    <>
      <Head>
        <title>Fan dashboard</title>
        <meta name='description' content='Fan dashboard' />
      </Head>
      <Container maxWidth='sm' sx={{ mt: 5, display: 'flex', align: "center", flexDirection: 'column' }} >
        <Typography variant='h3'> Welcome, Fan &#127926; &#127908; &#127911; </Typography>
        {fan.length === 0 ?
          <>
            <Typography variant='h5' sx={{ mt: 3, mb: 3, mr: 3 }}> No Instagram account recorded for this address.
              Please enter your account below:
            </Typography>
            <div className="content-center">
              <TextField id="outlined-basic" label="ex: @carlasdreams" variant="outlined"
                onChange={handleTwitterHandleInputChange} />
              <Button variant='contained' size='large' sx={{ ml: 3 }} endIcon={<SendIcon />}
                onClick={() => enrollUser(instaHandle, setFan, env)}>
                Register
              </Button>
            </div>
          </>
          : <>
            <Typography variant='h4' sx={{ mt: 3, mb: 3, mr: 3 }}> Congratulations! Address <span style={{ color: blue[500] }}>{env.address} </span>is registered with the following Instagram user: &nbsp;
              <span style={{ color: blue[500] }}> @{fan['username']} </span>
            </Typography>
          </>}
      </Container>
      <Container maxWidth='lg' sx={{ mt: 5, display: 'flex', align: "center", flexDirection: 'column' }} >
        <TitleView> NFTs for sale </TitleView>
        {nfts.length !== 0 ? <span>
          <DataGrid
            rows={nfts}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 50 },
              },
            }}
            autoHeight
            pagination
            getRowHeight={({ id, densityFactor }: GridRowHeightParams) => {
              if ((id as number) % 2 === 0) {
                return 100 * densityFactor;
              }
              return null;
            }}
          />
        </span> : <span></span>}

      </Container>
    </>
  );
};

export async function getServerSideProps(context: any) {

  const address = context['query']['address']

  try {
    // GET MONGO DB DATA
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const fan_collection = db.collection(process.env.MONGODB_FAN as string)
    const fanData = await fan_collection.find({ address: address }).toArray()

    // GET INSTAGRAM SESSION ID IF FAN NOT ENROLLED
    let sessionid = null;

    if (fanData.length === 0) {
      await (async () => {
        const ig = new IgApiClient();
        ig.state.generateDevice(process.env.INSTA_USER as string);
        ig.request.end$.subscribe(async () => {
          const serialized = await ig.state.serialize();
          const data = serialized['cookies'];
          const cookies = JSON.parse(data).cookies;
          cookies.forEach((cookie: any) => {
            if (cookie.key === 'sessionid') {
              sessionid = cookie.value;
            }
          });
        });
        await ig.account.login(process.env.INSTA_USER as string, process.env.INSTA_PASSWORD as string);
      })();
    }

    return {
      props: {
        connection: {
          isDbConnected: true,
        },
        data: {
          fanData: fanData[0] ? JSON.parse(JSON.stringify(fanData[0])) : "",
        },
        env: {
          INSTA_URL: process.env.INSTA_URL,
          sessionid: sessionid,
          address: address
        },
      },
    }
  } catch (e) {
    console.error(e)
    return {
      props: {
        connection: {
          isDbConnected: false,
        }
      }
    }
  }
}

export default function FanDashboard({
  data, env
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <NotAuthRedirectWrapper>
      <FanDashboardPage data={data} env={env} />
    </NotAuthRedirectWrapper>
  );
}
