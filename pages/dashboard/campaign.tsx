import { Button, Card, CardContent, Container, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Link from 'next/link';
import { IgApiClient } from 'instagram-private-api';
import clientPromise from '../../lib/mongodb'
import { InferGetServerSidePropsType } from 'next'
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getCampaignDataFromInsta } from '../../lib/crud'
import { useEffect, useState } from 'react';


function formatData(rawData: any, fanData: any) {
    rawData.forEach((element: any) => {
        const timestamp = element.timestamp * 1000; // Convert timestamp to milliseconds
        const date = new Date(timestamp);
        const utcTime = date.toUTCString().slice(5, 22); // Extract day and hour in UTC format
        element.timestamp = utcTime; // Update the timestamp property with the UTC time
        fanData.forEach((fan: any) => {
            if (fan.id === element.instaId) {
                element.username = fan.username;
            }
        })
    });
    return rawData;
}

const getRowHeight = (params: any) => {
    const lineHeight = 20; // Specify the line height for each row
    const numLines = Math.ceil(params.length / 40); // Adjust the line length to your desired value
    return lineHeight * numLines + 16; // Add padding or margin if needed
};


const CampaignDashboardPage = ({ data, env }: any) => {

    interface CampaignFormat {
        comments: number;
        id: string;
        likes: number;
        timestamp: number;
        username: string;
        description: string;
        hashtags: string;
        mentions: string;
    }

    const router = useRouter();
    const { address } = router.query;
    const { hashtag } = router.query;
    const { name } = router.query;
    const [rows, setRows] = useState<CampaignFormat[]>([]);
    const hashtagValue = hashtag || '';

    const columns: GridColDef[] = [
        { field: 'username', headerName: 'User', width: 100, headerAlign: 'center', align: 'center' },
        { field: 'timestamp', headerName: 'Timestamp', width: 140, headerAlign: 'center', align: 'center' },
        { field: 'likes', headerName: 'Likes', type: "number", width: 90, headerAlign: 'center', align: 'center' },
        { field: 'comments', headerName: 'Comments', type: "number", width: 90, headerAlign: 'center', align: 'center' },
        { field: 'hashtags', headerName: 'Hashtags', type: "number", headerAlign: 'center', align: 'center' },
        { field: 'mentions', headerName: 'Mentions', type: "number", width: 150, headerAlign: 'center', align: 'center' },
        {
            field: 'description', headerName: 'Description', type: "number", headerAlign: 'center', align: 'center', flex: 1,
            renderCell: (params) => (
                <div style={{ whiteSpace: 'normal', wordWrap: 'break-word', wordBreak: 'break-word' }}>
                    {params.value}
                </div>
            )
        },

    ];

    useEffect(() => {
        const fetchData = async () => {
            if (data.campaignData.length === 0 && rows.length === 0) {
                let instaData = await getCampaignDataFromInsta(hashtagValue, env, data);
                let modifiedArray = formatData(instaData, data.fanData);
                setRows(modifiedArray);
            } else {
                let modifiedArray = formatData(data.campaignData, data.fanData);
                console.log(modifiedArray);
                setRows(modifiedArray);
            }
        };

        fetchData();
    }, []);

    return (
        <Container maxWidth='xl' sx={{ mt: 5 }}>
            <Card sx={{ mt: 2 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant='h4' sx={{ mt: 3, mb: 1, mr: 3 }}>  {name} campaign
                    </Typography>
                    <Typography variant='h5' sx={{ mt: 1, mb: 3, mr: 3 }}>  #{hashtag}
                    </Typography>
                    <Button variant='contained' size='medium' onClick={() => getCampaignDataFromInsta(hashtag, env, data)} >
                        Refresh data
                    </Button>
                </CardContent>
                <Link href={`/dashboard/creator?address=${address}`} >
                    <Button variant='contained' size='large'>
                        Back
                    </Button>
                </Link>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 50 },
                        },
                    }}
                    autoHeight
                    pagination
                    getRowHeight={getRowHeight}
                />
            </Card>
        </Container >
    );

};



export async function getServerSideProps(context: any) {

    const { query } = context;
    const hashtag = query.hashtag;

    try {
        // GET MONGO DB DATA
        const client = await clientPromise
        const db = client.db(process.env.MONGODB_DB)
        const fanCollection = db.collection(process.env.MONGODB_FAN as string)
        const fanData = await fanCollection.find().toArray()
        const campaignCollection = db.collection(hashtag);
        const campaignData = await campaignCollection.find().toArray()

        // GET INSTAGRAM SESSION ID  
        let sessionid = '7553568911%3A4qIjKj518QHeXF%3A12%3AAYejuC1dsj4TstkQG1Hbbd2omVnR13WPgQhay-hukg';
        /*
        let sessionid = null

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
                    fanData: JSON.parse(JSON.stringify(fanData)),
                    campaignData: JSON.parse(JSON.stringify(campaignData)),
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

export default CampaignDashboardPage;


