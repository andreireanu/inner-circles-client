import clientPromise from '../../lib/mongodb'
import { InferGetServerSidePropsType } from 'next'
import Head from 'next/head';
import { SetStateAction, useState } from 'react'
import { enrollUser } from '../../lib/crud'
import { IgApiClient } from '../../node_modules/instagram-private-api';

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
import { blue } from '@mui/material/colors';

import { useRouter } from 'next/router';
import { NotAuthRedirectWrapper } from '../../components/NotAuthRedirectWrapper';

const FanDashboardPage = ({ data, env }: any) => {

  const [fan, setFan] = useState(data.fan_data || [])
  const [instaHandle, setTwitterHandle] = useState('');

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
              Please enter your account below:
            </Typography>
            <div className="content-center">
              <TextField id="outlined-basic" label="ex: @carlasdreams" variant="outlined"
                onChange={handleTwitterHandleInputChange} />
              <Button variant='contained' size='large' sx={{ ml: 3 }} endIcon={<SendIcon />}
                onClick={() => enrollUser(instaHandle, setFan, env)}>
                Register
              </Button>
            </div>
          </div>
          : <div>
            <Typography variant='h4' sx={{ mt: 3, mb: 3, mr: 3 }}> Congratulations! Address <span style={{ color: blue[500] }}>{env.address} </span>is registered with the following Instagram user: &nbsp;
              <span style={{ color: blue[500] }}> {fan['username']} </span>
            </Typography>

          </div>}
      </Container>
    </>
  );
};

export async function getServerSideProps(context: any) {

  const address = context['query']['address']

  try {
    // GET MONGO DB DATA
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const fan_collection = db.collection(process.env.MONGODB_FAN as string)
    const fan_data = await fan_collection.find({ address: address }).toArray()

    // GET INSTAGRAM SESSION ID IF FAN NOT ENROLLED
    let sessionid = null;

    if (fan_data.length === 0) {
      await (async () => {
        const ig = new IgApiClient();
        ig.state.generateDevice(process.env.INSTA_USER as string);
        ig.request.end$.subscribe(async () => {
          const serialized = await ig.state.serialize();
          const data = serialized['cookies'];
          const cookies = JSON.parse(data).cookies;
          cookies.forEach((cookie: any) => {
            if (cookie.key === 'sessionid') {
              sessionid = cookie.value;
            }
          });
        });
        await ig.account.login(process.env.INSTA_USER as string, process.env.INSTA_PASSWORD as string);
      })();
    }

    return {
      props: {
        connection: {
          isDbConnected: true,
        },
        data: {
          fan_data: fan_data[0] ? JSON.parse(JSON.stringify(fan_data[0])) : "",
        },
        env: {
          INSTA_URL: process.env.INSTA_URL,
          sessionid: sessionid,
          address: address
        },
      },
    }
  } catch (e) {
    console.error(e)
    return {
      props: {
        connection: {
          isDbConnected: false,
        }
      }
    }
  }
}

export default function FanDashboard({
  data, env
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <NotAuthRedirectWrapper>
      <FanDashboardPage data={data} env={env} />
    </NotAuthRedirectWrapper>
  );
}
