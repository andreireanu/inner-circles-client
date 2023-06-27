import React, { useEffect, useMemo, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';
import {
  Button,
  Card,
  CardContent,
  Container,
  Typography
} from '@mui/material';
import CreateExpModal from '../../CreateExpModal';
import TitleView from '../../TitleView';
import CreatorCampaigns from '../CreatorCampaigns';
import CreatorNFTs from '../CreatorNFTs';
import { DataGrid, GridColDef, GridRowHeightParams } from '@mui/x-data-grid';

import {
  decodeBase64,
} from "@multiversx/sdk-dapp/utils";

import {
  Address,
  AddressValue,
  ContractFunction,
  ResultsParser
} from '@multiversx/sdk-core/out';
import { useGetAccount, useGetNetworkConfig } from '@multiversx/sdk-dapp/hooks';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { smartContract } from '../../Dashboard/Actions/helpers/smartContractOLD';
import s from './EditCreator.module.css';
import { API_URL, QUERY_URL, NFT_URL } from '../../../config';
import { contractAddress } from '../../../config';
import { issueNonFungibleToken } from '../../../utils/issueNonFungibleToken';
import { useForm } from 'react-hook-form';
import { hex2a, numberToHex } from '../../../utils/hexUtils';
import { spawn } from 'child_process';
import { getNftPrice } from '../../../utils/getNftPrice';

interface NftFormat {
  id: string,
  identifier: string;
  name: string;
  url: string;
  balance: number;
  price: number;
}


const EditCreator = ({ creatorToken, address }: any) => {

  const methods = useForm();
  const { handleSubmit } = methods;

  // SET TOKEN DATA
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [supply, setSupply] = useState(0);

  useEffect(() => {
    const tokenDataUrl = API_URL + '/tokens/' + creatorToken;
    fetch(tokenDataUrl)
      .then((response) => response.json())
      .then((responseJson) => {
        setName(responseJson.name);
        setToken(responseJson.ticker);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  useEffect(() => {
    if (token) {
      const tokenAccountsUrl = API_URL + '/tokens/' + token + '/accounts';
      fetch(tokenAccountsUrl)
        .then((response) => response.json())
        .then((responseJson) => {
          responseJson.forEach((record: any) => {
            if (record.address == contractAddress) {
              setSupply(record.balance);
            }
          })
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }, [token]);



  // SET NFT DATA
  const [nft, setNft] = useState('');
  const addressFromBech = Address.fromBech32(address).hex();
  useEffect(() => {
    fetch(QUERY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scAddress: contractAddress,
        funcName: 'getCreatorNft',
        args: [addressFromBech],
      })
    })
      .then(response => response.json())
      .then(data => {
        let nftBase64 = data.data.data.returnData[0];
        setNft(decodeBase64(nftBase64))
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  // Issue NFT
  const onSubmit = async (data: any) => {
    const sessionId = await issueNonFungibleToken(
      name,
      token.split("-")[0],
    );
  };

  // Get Campaigns
  const [campaignName, setCampaignName] = useState('');
  const [campaignHashtag, setCampaignHashtag] = useState('');
  const [campaignAmount, setCampaignAmount] = useState(0);
  useEffect(() => {
    fetch(QUERY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scAddress: contractAddress,
        funcName: 'getCampaigns',
        args: [addressFromBech],
      })
    })
      .then(response => response.json())
      .then(data => {
        try {
          let cmp = data.data.data.returnData[0];
          const hexCampaign = Buffer.from(cmp, 'base64').toString('hex');
          let regexConst = new RegExp(/0000000(?!0)./g);
          let hexCampaignSplit = hexCampaign.replaceAll(regexConst, ',').split(',');
          setCampaignName(hex2a(hexCampaignSplit[1]))
          setCampaignHashtag("#" + hex2a(hexCampaignSplit[2]).toLowerCase())
          setCampaignAmount(parseInt(hexCampaignSplit[3], 16))
        } catch (err) {
        } 
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  // Get NFTs
  const [nfts, setNfts] = useState<NftFormat[]>([]);
  useEffect(() => {
    if (nft) {
      let generalUri = NFT_URL + '?search=' + nft;
      fetch(generalUri)
        .then(response => response.json())
        .then(data => {
          try {
            data.forEach((record: any) => {
              let accountUri = NFT_URL + '/' + record.identifier + '/accounts';
              let balance = 0;
              fetch(accountUri)
                .then(response => response.json())
                .then(data => {
                  data.forEach((account: any) => {
                    if (account.address === contractAddress) {
                      balance = account.balance;
                      var price: number;
                      fetch(QUERY_URL, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          scAddress: contractAddress,
                          funcName: 'getNftPrice',
                          args: [addressFromBech, numberToHex(record.nonce)],
                        })
                      })
                        .then(response => response.json())
                        .then(data => {
                          let priceHex = data.data.data.returnData[0];
                          price = Buffer.from(priceHex, 'base64')[0];

                          const nftInstance = {
                            id: record.nonce,
                            identifier: record.identifier,
                            name: record.name,
                            url: record.url,
                            balance: balance,
                            price: price,
                          };
                          setNfts((prevState: NftFormat[]) => [...prevState, nftInstance]);
                        })
                        .catch(error => {
                        });
                    }
                  })
                });
            });
          } catch (err) {
          }
        })
        .catch(error => {
        });
    }

  }, [nft, setNfts]);


  const columns: GridColDef[] = [
    { field: 'identifier', headerName: 'Identifier', width: 140, headerAlign: 'center', align: 'center', flex: 1 },
    { field: 'name', headerName: 'Name', width: 140, headerAlign: 'center', align: 'center', flex: 1 },
    {
      field: 'url', headerName: 'Asset', width: 140, headerAlign: 'center', align: 'center', flex: 1,
      renderCell: (params) => (
        <img src={params.value} alt="Nft" width="20%" />
      )
    },
    { field: 'balance', headerName: 'Available', width: 140, headerAlign: 'center', align: 'center', flex: 1 },
    { field: 'price', headerName: `Price in fungible tokens`, width: 140, headerAlign: 'center', align: 'center', flex: 1 },


  ]


  return (
    <Container className={'text-center'} >
      <h1>Welcome, Creator  &#127911; &#127926; &#127908;</h1>
      <Card sx={{ mt: 2, display: 'inline-block' }}>
        <CardContent sx={{ textAlign: 'center' }}>
          Fungible Token Name : {name}  <br />
          Fungible Token Symbol : {token} <br />
          Supply left: {supply} <br />
          {nft == "" && name != "" ? (
            <span>
              <Button fullWidth size='large' type='submit' variant='contained' sx={{ mt: 2 }} onClick={handleSubmit(onSubmit)} >
                Please Click here to issue <br /> The Non Fungible Token
              </Button>
            </span>
          ) : (
            <span>Non Fungible Token Symbol : {nft}</span>
          )}
        </CardContent>
      </Card>
      <TitleView className={s.title}>My NFTs</TitleView>
      <CreatorNFTs />
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

      <TitleView className={s.title}>My Campaigns</TitleView>
      <CreatorCampaigns />
      {campaignName == "" ? (
        <span />     
      ) : (
          <Card sx={{ mt: 2, display: 'inline-block', width: '75%' }}>
          <CardContent sx={{ textAlign: 'center' }}>
            Campaign Name: {campaignName} <br />
            Hashtag: {campaignHashtag} <br />
            Amount allocated: {campaignAmount} <br />
              <Link href={`/dashboard/campaign?address=${address}&name=${campaignName}&hashtag=${campaignHashtag.substring(1)}&amount=${campaignAmount}`}  >
                <Button
                sx={{ mt: 2, display: 'inline-block', width: '25%' }}
                fullWidth size='small' type='submit' variant='contained' >
                Campaign status
              </Button>
              </Link>
            </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default EditCreator;
