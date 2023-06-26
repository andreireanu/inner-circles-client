import { Box, Button, Card, CardContent, Container, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowHeightParams } from '@mui/x-data-grid';
import Link from 'next/link';
import { IgApiClient } from 'instagram-private-api';
import clientPromise from '../../lib/mongodb'
import { InferGetServerSidePropsType } from 'next'
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getCampaignDataFromInsta } from '../../lib/crud'
import { useEffect, useState } from 'react';
import { sendCampaignTokens } from '../../utils/sendCampaignTokens';
import { useForm } from 'react-hook-form';
import { SubmitHandler, FieldValues } from 'react-hook-form';

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

interface UsernameAmount {
    id: string
    username: string;
    amount: number;
    amountTokens: number;
}

interface MultiValue {
    address: string,
    amountTokens: number,
}

function calculateAllocation(campaignData: CampaignFormat[], amount: any) {
    let amountInt = parseInt(amount);
    const sums: UsernameAmount[] = [];
    let totalSum = 0;

    campaignData.forEach((record) => {
        if (record.username !== undefined) {
            const sum = record.likes + record.comments;
            const existingIndex = sums.findIndex((entry) => entry.username === record.username);
            if (existingIndex !== -1) {
                sums[existingIndex].amount += sum;
            } else {
                sums.push({ id: record.id, username: record.username, amount: sum, amountTokens: 0 });
            }
        }
    });
    for (let i = 0; i < sums.length; i++) {
        const { amount } = sums[i];
        totalSum += Math.sqrt(amount)
    }
    for (let i = 0; i < sums.length; i++) {
        const { amount } = sums[i];
        const percentage = Math.sqrt(amount) / totalSum;
        sums[i].amountTokens = percentage * amountInt;
    }
    return sums;
}


const CampaignDashboardPage = ({ data, env }: any) => {

    const methods = useForm();
    const { handleSubmit } = methods;

    const router = useRouter();
    const { address } = router.query;
    const { hashtag } = router.query;
    const { name } = router.query;
    const { amount } = router.query;
    const [rows, setRows] = useState<CampaignFormat[]>([]);
    const [allocation, setAllocation] = useState<UsernameAmount[]>([]);
    const hashtagValue = Array.isArray(hashtag) ? hashtag[0] : String(hashtag || '');
    const amountValue = amount || '';

    const onSubmitSendTokens = async () => {

        const multiValue = allocation.map((item) => {
            const matchingRecord = data.fanData.find((record: any) => record.username === item.username);
            if (matchingRecord) {
                return {
                    address: matchingRecord.address,
                    amountTokens: item.amountTokens,
                };
            }
            return null;
        }).filter(Boolean);
        const filteredArray: MultiValue[] = multiValue.filter(item => item !== null) as MultiValue[];
        sendCampaignTokens(hashtagValue, filteredArray);
        router.replace('/dashboard');
    };

    const columnsCampaignData: GridColDef[] = [
        {
            field: 'username', headerName: 'User', width: 150, headerAlign: 'center', align: 'center', flex: 1,
        },
        { field: 'timestamp', headerName: 'Timestamp', width: 140, headerAlign: 'center', align: 'center' },
        { field: 'likes', headerName: 'Likes', type: "number", width: 90, headerAlign: 'center', align: 'center' },
        { field: 'comments', headerName: 'Comments', type: "number", width: 90, headerAlign: 'center', align: 'center' },
        {
            field: 'description', headerName: 'Description', type: "number", headerAlign: 'center', align: 'center', flex: 1,
            renderCell: (params) => (
                <div style={{ whiteSpace: 'normal', wordWrap: 'break-word', wordBreak: 'break-word' }}>
                    {params.value}
                </div>
            )
        },
        {
            field: 'hashtags', headerName: 'Hashtags', type: "number", headerAlign: 'center', align: 'center', flex: 1,
            renderCell: (params) => (
                <div style={{ whiteSpace: 'normal', wordWrap: 'break-word', wordBreak: 'break-word' }}>
                    {params.value}
                </div>
            )
        },
        {
            field: 'mentions', headerName: 'Mentions', type: "number", width: 150, headerAlign: 'center', align: 'center', flex: 1,
            renderCell: (params) => (
                <div style={{ whiteSpace: 'normal', wordWrap: 'break-word', wordBreak: 'break-word' }}>
                    {params.value}
                </div>
            )
        },
    ];

    const columnsAllocationData: GridColDef[] = [
        { field: 'username', headerName: 'Username', width: 140, headerAlign: 'center', align: 'center', flex: 1 },
        {
            field: 'amountTokens', headerName: 'Token Allocation', width: 140, headerAlign: 'center', align: 'center', flex: 1,
            renderCell: (params) => (
                <div style={{ whiteSpace: 'normal', wordWrap: 'break-word', wordBreak: 'break-word' }}>
                    {params.value.toFixed(0)}
                </div>
            )
        },
    ]

    useEffect(() => {
        const fetchData = async () => {
            let modifiedArray: any;
            if (data.campaignData.length === 0 && rows.length === 0) {
                let instaData = await getCampaignDataFromInsta(hashtagValue, env, data);
                modifiedArray = formatData(instaData, data.fanData);
            } else {
                modifiedArray = formatData(data.campaignData, data.fanData);
            }
            setRows(modifiedArray);
            let allocation = calculateAllocation(modifiedArray, amountValue);
            setAllocation(allocation);
        };

        fetchData();
    }, []);

    return (
        <div>
            <Container maxWidth='xl' sx={{ mt: 5 }}>
                <Card sx={{ mt: 2 }}>
                    <Link href={`/dashboard/creator?address=${address}`} >
                        <Button variant='contained' size='large'>
                            Back
                        </Button>
                    </Link>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant='h4' sx={{ mt: 3, mb: 1, mr: 3 }}>  {name} campaign
                        </Typography>
                        <Typography variant='h5' sx={{ mt: 1, mb: 1, mr: 3 }}>  #{hashtag}
                        </Typography>
                        <Typography variant='h5' sx={{ mt: 1, mb: 3, mr: 3 }}>  amount: {amount} tokens
                        </Typography>
                        <Button variant='contained' size='medium' onClick={() => getCampaignDataFromInsta(hashtagValue, env, data)} >
                            Refresh data
                        </Button>
                    </CardContent>

                    <DataGrid
                        rows={rows}
                        columns={columnsCampaignData}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 50 },
                            },
                        }}
                        autoHeight
                        pagination
                        getRowHeight={({ id, densityFactor }: GridRowHeightParams) => {
                            if ((id as number) % 2 === 0) {
                                return 100 * densityFactor;
                            }
                            return null;
                        }}
                    />
                </Card>
            </Container >
            <Container maxWidth='sm' sx={{ mt: 5 }}>
                <Card sx={{ mt: 2 }}>
                    <DataGrid
                        rows={allocation}
                        columns={columnsAllocationData}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 50 },
                            },
                        }}
                        autoHeight
                        pagination
                        getRowHeight={({ id, densityFactor }: GridRowHeightParams) => {
                            if ((id as number) % 2 === 0) {
                                return 100 * densityFactor;
                            }
                            return null;
                        }}
                    />
                    <Box textAlign='center'>
                        <Button variant='contained' size='large' sx={{ mt: 2, mb: 2 }} onClick={handleSubmit(onSubmitSendTokens)} >
                            Send tokens
                        </Button>
                    </Box>
                </Card>
            </Container >
        </div>
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
                        console.log(sessionid)
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


