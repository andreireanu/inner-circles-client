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
import { API_URL, QUERY_URL } from '../../../config';
import { contractAddress } from '../../../config';
import { issueNonFungibleToken } from '../../../utils/issueNonFungibleToken';
import { useForm } from 'react-hook-form';
import { hex2a } from '../../../utils/hexUtils';

const EditCreator = ({ creatorToken, address }: any) => {

  const methods = useForm();
  const { handleSubmit } = methods;

  // SET TOKEN DATA
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [supply, setSupply] = useState('');

  const tokenDataUrl = API_URL + '/tokens/' + creatorToken;
  useEffect(() => {
    fetch(tokenDataUrl)
      .then((response) => response.json())
      .then((responseJson) => {
        setName(responseJson.name);
        setToken(responseJson.ticker);
        setSupply(responseJson.supply);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

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

  // Get campaigns
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
        let cmp = data.data.data.returnData[0];
        const hexCampaign = Buffer.from(cmp, 'base64').toString('hex');
        let regexConst = new RegExp(/0000000(?!0)./g);
        let hexCampaignSplit = hexCampaign.replaceAll(regexConst, ',').split(',');
        setCampaignName(hex2a(hexCampaignSplit[1]))
        setCampaignHashtag("#" + hex2a(hexCampaignSplit[2]).toLowerCase())
        setCampaignAmount(parseInt(hexCampaignSplit[3], 16))
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  /// Campaign Dashboard
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <Container className={'text-center'} >
      <h1>Welcome, Creator  &#127911; &#127926; &#127908;</h1>
      <Card sx={{ mt: 2, display: 'inline-block' }}>
        <CardContent sx={{ textAlign: 'center' }}>
          Fungible Token Name : {name}  <br />
          Fungible Token Symbol : {token} <br />
          Supply : {supply} <br />
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
              <Link href={`/dashboard/campaign?address=${address}&hashtag=${campaignHashtag.substring(1)}`}  >
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
