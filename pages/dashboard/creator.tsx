import React, { useState, useEffect } from 'react';
import Head from 'next/head';

import {
  deleteCreatorFromLocalStorage,
  getCreatorFromLocalStorage
} from '../../utils/localStorage';

import { SetUpCreator, EditCreator } from '../../components/CreatorDashboard';
import { NotAuthRedirectWrapper } from '../../components/NotAuthRedirectWrapper';
import { Button } from 'react-bootstrap';

const CreatorDashboardPage = () => {
  const [creator, setCreator] = useState(null);

  useEffect(() => {
    (async () => {
      const creatorTmp = await getCreatorFromLocalStorage();
      setCreator(creatorTmp);
    })();
  }, []);

  return (
    <>
      <Head>
        <title>Creator Dashboard</title>
        <meta name='description' content='Creator dashboard' />
      </Head>
      <main className='mt-5 position-relative'>
        <div className='home d-flex flex-fill flex-column align-items-center justify-content-center'>
          {/* TODO remove box when api is working */}
          <Button
            onClick={() => {
              deleteCreatorFromLocalStorage();
              setCreator(null);
            }}
            className={'position-absolute'}
            style={{ top: 0, left: 0 }}
          >
            Reset Creator
          </Button>
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
