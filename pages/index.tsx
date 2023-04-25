import Head from 'next/head';
import * as React from 'react';
import { routeNames } from '../routes';
import Link from 'next/link';
import { Button, Card } from '@mui/material';

export default function Index() {
  return (
    <>
      <Head>
        <title>Inner Circles</title>
        <meta name='description' content='Inner Circles dapp' />
      </Head>
      <main className='mt-5'>
        <div className='d-flex flex-fill align-items-center container'>
          <div className='row w-100'>
            <div className='col-12 col-md-8 col-lg-5 mx-auto'>
              <Card>
                <div className='card-body text-center'>
                  <h2 className='mb-3' data-testid='title'>
                  </h2>
                  <p className='mb-3'>
                    Welcome to Inner Circles.
                    <br /> Login using your MultiversX wallet.
                  </p>
                  <Link href={routeNames.login} data-testid='loginBtn'>
                    <Button variant='contained'>Login</Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
