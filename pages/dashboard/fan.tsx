import clientPromise from '../../lib/mongodb'
import { InferGetServerSidePropsType } from 'next'

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

const FanDashboardPage = ({ fan_data }: any) => {

  return (
    <>
      <Head>
        <title>Fan dashboard</title>
        <meta name='description' content='Fan dashboard' />
      </Head>
      <Container maxWidth='sm' sx={{ mt: 5 }}>
        {fan_data.map((todo: any) => (
          <li
            className={"flex mb-4 pb-4 items-center border-b-2 border-gray-300"}
            key={todo._id}>
            <p className={`w-full 
                                ${todo.completed ? "line-through text-green-600" : ""}`} >
              {todo.title}
            </p>
            <button className={`flex-no-shrink p-2 ml-4 mr-2 border-2 rounded hover:text-white
                                ${todo.completed
                ? "text-green-500 border-green-500 hover:bg-green-500"
                : "text-onMakeOffergray-500 border-gray-500 hover:bg-gray-500"
              }`}
            >
              Complete
            </button>
            <button
              className="flex-no-shrink p-2 ml-2 border-2 rounded text-red-500 border-red-500 hover:text-white hover:bg-red-500"
            >
              Delete
            </button>
          </li>
        ))}
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
