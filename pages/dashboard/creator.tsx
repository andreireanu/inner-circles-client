import React, { useState, useEffect } from 'react';
import Head from 'next/head';

import {
  useGetCreatorToken
} from '../../utils/useGetCreatorToken';


import { SetUpCreator, EditCreator } from '../../components/CreatorDashboard';
import { NotAuthRedirectWrapper } from '../../components/NotAuthRedirectWrapper';

import { Button, Stack } from '@mui/material';

import { useForm } from 'react-hook-form';

const CreatorDashboardPage = () => {
  const [creator, setCreator] = useState(null);

  const methods = useForm();
  const { handleSubmit } = methods;

  const creatorToken = useGetCreatorToken();

  const onSubmit = async (data: any) => {

    console.log("Pressed");
    console.log(creatorToken);
    console.log("Worked");

  };

  return (
    <>
      <Head>
        <title>Creator Dashboard</title>
        <meta name='description' content='Creator dashboard' />
      </Head>
      <main className='mt-5 position-relative'>
        <div className='home d-flex flex-fill flex-column align-items-center justify-content-center'>
          {<Button
            variant='contained'
            sx={{
              width: '100%',
              marginTop: '1rem',
              padding: '1rem'
            }}
            onClick={handleSubmit(onSubmit)}
            className='w-full'
          >
            Get from SC
          </Button>}


          {creator ? (
            <EditCreator creator={creator} />
          ) : (
            <SetUpCreator setCreator={setCreator} />
          )}
        </div>
      </main>
    </>
  );
};

export default function CreatorDashboard() {
  return (
    <NotAuthRedirectWrapper>
      <CreatorDashboardPage />
    </NotAuthRedirectWrapper>
  );
}
