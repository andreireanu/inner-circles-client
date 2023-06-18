import { Button, Card, CardContent, Container } from '@mui/material';
import Link from 'next/link';
import { IgApiClient } from 'instagram-private-api';
import clientPromise from '../../lib/mongodb'
import { InferGetServerSidePropsType } from 'next'
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getCampaignData } from '../../lib/crud'


const CampaignDashboardPage = ({ data, env }: any) => {

    const router = useRouter();
    const { address } = router.query;
    const { hashtag } = router.query;

    return (
        <Container maxWidth='sm' sx={{ mt: 5 }}>
            <Card sx={{ mt: 2 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                    <Button variant='contained' size='medium' onClick={() => getCampaignData(hashtag, env, data)}>
                        Get current data
                    </Button>
                </CardContent>
                <Link href={`/dashboard/creator?address=${address}`}>
                    <Button variant='contained' size='large'>
                        Back
                    </Button>
                </Link>
            </Card>
        </Container >
    );

};



export async function getServerSideProps(context: any) {

    try {
        // GET MONGO DB DATA
        const client = await clientPromise
        const db = client.db(process.env.MONGODB_DB)
        const fan_collection = db.collection(process.env.MONGODB_FAN as string)
        const fan_data = await fan_collection.find().toArray()

        // GET INSTAGRAM SESSION ID IF FAN NOT ENROLLED
        let sessionid = '7553568911%3A4qIjKj518QHeXF%3A12%3AAYejuC1dsj4TstkQG1Hbbd2omVnR13WPgQhay-hukg';

        /*
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
        */

        return {
            props: {
                connection: {
                    isDbConnected: true,
                },
                data: {
                    campaign_data: JSON.parse(JSON.stringify(fan_data)),
                },
                env: {
                    INSTA_URL: process.env.INSTA_URL,
                    sessionid: sessionid,
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

export default function CampaignDashboard({
    data, env
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <CampaignDashboardPage data={data} env={env} />
    );
}




