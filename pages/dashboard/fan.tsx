import clientPromise from '../../lib/mongodb'
import { InferGetServerSidePropsType } from 'next'
import Head from 'next/head';
import { SetStateAction, useState } from 'react'
import { addInsta, getInstaId } from '../../lib/crud'


import SendIcon from '@mui/icons-material/Send';
import {
  Button,
  Card,
  CardContent,
  Container,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  TextField,
  Typography
} from '@mui/material';

import { useGetAccount } from '@multiversx/sdk-dapp/hooks';
import { useRouter } from 'next/router';
import { NotAuthRedirectWrapper } from '../../components/NotAuthRedirectWrapper';

const FanDashboardPage = ({ fan_data }: any) => {

  const [fan, setFan] = useState(fan_data || [])
  const [instaHandle, setTwitterHandle] = useState('');
  const { address } = useGetAccount();

  const handleTwitterHandleInputChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setTwitterHandle(event.target.value);
  };


  return (
    <>
      <Head>
        <title>Fan dashboard</title>
        <meta name='description' content='Fan dashboard' />
      </Head>
      <Container maxWidth='sm' sx={{ mt: 5, display: 'flex', align: "center", flexDirection: 'column' }} >
        <Typography variant='h3'> Welcome, Fan &#127926; &#127908; &#127911; </Typography>
        {fan.length === 0 ?
          <div>
            <Typography variant='h5' sx={{ mt: 3, mb: 3, mr: 3 }}> No Instagram account recorded for this address.
              Please enter your account below:</Typography>
            <div className="content-center">
              <TextField id="outlined-basic" label="ex: @carlasdreams" variant="outlined"
                onChange={handleTwitterHandleInputChange} />
              <Button variant='contained' size='large' sx={{ ml: 3 }} endIcon={<SendIcon />}
                onClick={() => getInstaId(instaHandle, setFan, address)}>
                Register
              </Button>
            </div>
          </div>
          : "Data exists"}
      </Container>
    </>
  );
};

export async function getServerSideProps(context: any) {
  try {
    // await clientPromise
    // `await clientPromise` will use the default database passed in the MONGODB_URI
    // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
    //
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const fan_collection = db.collection(process.env.MONGODB_FAN!)
    const fan_data = await fan_collection.find({}).toArray()
    //
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands
    console.log(fan_data)
    return {
      props: { isConnected: true, fan_data: JSON.parse(JSON.stringify(fan_data)) },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}

export default function FanDashboard({
  fan_data
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <NotAuthRedirectWrapper>
      <FanDashboardPage fan_data={fan_data} />
    </NotAuthRedirectWrapper>
  );
}
