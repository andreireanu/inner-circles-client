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

const resultsParser = new ResultsParser();

const EditCreator = ({ creator }: any) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const { address } = useGetAccount();
  const { network } = useGetNetworkConfig();
  const [experienceSymbol, setExperienceSymbol] =
    useState<string>('SLM-97d6fc');

  const proxy = useMemo(() => {
    return new ProxyNetworkProvider(network);
  }, [network]);

  const allowMe = () => {
    onAllowMe(experienceSymbol);
  };

  const createNFT = () => {
    onCreateNFT();
  };

  return (
    <Container className={'text-center'}>
      <h1>Welcome, Creator  &#127911; &#127926; &#127908;</h1>
      <Card sx={{ mt: 2, display: 'inline-block' }}>
        <CardContent sx={{ textAlign: 'center' }}>
          Token Name : 
          <br />
          Token Symbol : 
          <br />
        </CardContent>
      </Card>
      <TitleView className={s.title}>My Compaigns</TitleView>
      <TitleView className={s.title}>My Experiences</TitleView>

      <Button
        onClick={() => setIsOpen(true)}
        sx={{ mt: 2 }}
        startIcon={<AddIcon />}
      >
        Create Experience
      </Button>

      {isOpen && <CreateExpModal handleClose={() => setIsOpen(false)} />}

      {experienceSymbol && (
        <Card sx={{ mt: 2 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant='h5'>Experience 1</Typography>
            <Typography variant='h5'>
              Your Experience Symbol: {experienceSymbol}
            </Typography>

            <Button onClick={allowMe} variant='contained' sx={{ mt: 2 }}>
              Allow me
            </Button>

            <Button
              onClick={createNFT}
              variant='contained'
              sx={{ ml: 2, mt: 2 }}
            >
              Create NFT
            </Button>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default EditCreator;
