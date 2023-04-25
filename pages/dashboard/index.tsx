import { Button, Card, CardContent, Typography } from '@mui/material';
import { Container, Stack } from '@mui/system';
import Link from 'next/link';
import Head from 'next/head';

const DashboardPage = () => {
  return (
    <>
      <Head>
        <title>Inner Circles</title>
        <meta name='description' content='Inner Circles dapp' />
      </Head>
    <Container maxWidth='sm' sx={{ mt: 5 }}>
      <Card>
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant='h4'>Choose your type</Typography>
          <Stack
            direction='row'
            spacing={3}
            justifyContent='center'
            sx={{ mt: 3 }}
          >
            <Link href='/dashboard/creator'>
              <Button variant='contained' size='large'>
                Creator
              </Button>
            </Link>
            <Link href='/dashboard/fan'>
              <Button variant='contained' size='large'>
                Fan
              </Button>
            </Link>
          </Stack>
        </CardContent>
      </Card>
    </Container>
    </>
  );

};

export default DashboardPage;
