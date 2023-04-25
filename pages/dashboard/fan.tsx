import {
  Card,
  CardContent,
  Container,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Typography
} from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NotAuthRedirectWrapper } from '../../components/NotAuthRedirectWrapper';

const FanDashboardPage = () => {

  return (
    <>
      <Head>
        <title>Fan dashboard</title>
        <meta name='description' content='Fan dashboard' />
      </Head>
      <Container maxWidth='sm' sx={{ mt: 5 }}>
         TEXT
      </Container>
    </>
  );
};

export default function FanDashboard() {
  return (
    <NotAuthRedirectWrapper>
      <FanDashboardPage />
    </NotAuthRedirectWrapper>
  );
}
