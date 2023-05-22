import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { InferGetServerSidePropsType } from 'next'

import {
  useGetCreatorToken
} from '../../utils/useGetCreatorToken';

import { SetUpCreator, EditCreator } from '../../components/CreatorDashboard';
import { NotAuthRedirectWrapper } from '../../components/NotAuthRedirectWrapper';
import { useForm } from 'react-hook-form';


export async function getServerSideProps(context: any) {
  const address = context['query']['address']
  return {
    props: {
      data: {
        address: address,
      },
    },
  }
}

const CreatorDashboardPage = ({ data }: any) => {
  const [creator, setCreator] = useState(null);
  const address = data.address;
  const creatorToken = useGetCreatorToken({ address });
  console.log(creatorToken);

  return (
    <>
      <Head>
        <title>Creator Dashboard</title>
        <meta name='description' content='Creator dashboard' />
      </Head>
      <main className='mt-5 position-relative'>
        <div className='home d-flex flex-fill flex-column align-items-center justify-content-center'>
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

export default function CreatorDashboard({
  data
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <NotAuthRedirectWrapper>
      <CreatorDashboardPage data={data} />
    </NotAuthRedirectWrapper>
  );
}
