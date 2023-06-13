import React, { useEffect, useMemo, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import {
  Button,
  Card,
  CardContent,
  Container,
  Typography
} from '@mui/material';
import CreateExpModal from '../../CreateExpModal';
import TitleView from '../../TitleView';

import {
  Address,
  AddressValue,
  ContractFunction,
  ResultsParser
} from '@multiversx/sdk-core/out';
import { useGetAccount, useGetNetworkConfig } from '@multiversx/sdk-dapp/hooks';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { onAllowMe, onCreateNFT } from '../../../utils/contractUtils';
import { smartContract } from '../../Dashboard/Actions/helpers/smartContractOLD';
import s from './EditCreator.module.css';
import { API_URL } from '../../../config';

const EditCreator = ({ creatorToken }: any) => {

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


  return (
    <Container className={'text-center'}>
      <h1>Welcome, Creator  &#127911; &#127926; &#127908;</h1>
      <Card sx={{ mt: 2, display: 'inline-block' }}>
        <CardContent sx={{ textAlign: 'center' }}>
          Token Name : {name}
          <br />
          Token Symbol : {token}
          <br />
          Supply : {supply}
          <br />
        </CardContent>
      </Card>
      <TitleView className={s.title}>My Compaigns</TitleView>
      <TitleView className={s.title}>My Experiences</TitleView>

    </Container>
  );
};

export default EditCreator;
