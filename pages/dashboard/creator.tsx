import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { InferGetServerSidePropsType } from 'next'

import {
  useGetCreatorToken
} from '../../utils/useGetCreatorToken';

import { SetUpCreator, EditCreator } from '../../components/CreatorDashboard';
import { NotAuthRedirectWrapper } from '../../components/NotAuthRedirectWrapper';


export async function getServerSideProps(context: any) {
  const address = context['query']['address'] || ""
  return {
    props: {
      data: {
        address: address,
      },
    },
  }
}

const CreatorDashboardPage = ({ data }: any) => {
  const { address } = data;
  const creatorToken = useGetCreatorToken({ address }) || "";

  return (
    <>
      <Head>
        <title>Creator Dashboard</title>
        <meta name='description' content='Creator dashboard' />
      </Head>
      <main className='mt-5 position-relative'>
        <div className='home d-flex flex-fill flex-column align-items-center justify-content-center'>
          {creatorToken === "" ? (
            <SetUpCreator />
          ) : (
              <EditCreator creatorToken={creatorToken} address={address} />
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
