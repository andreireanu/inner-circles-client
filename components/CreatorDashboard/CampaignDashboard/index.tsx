import { Button, Card, CardContent, Container } from '@mui/material';
import { IgApiClient } from '../../../node_modules/instagram-private-api';
import clientPromise from '../../../lib/mongodb'
import { InferGetServerSidePropsType } from 'next'
import Head from 'next/head';

const CampaignDashboard = (context: any) => {

    return (
        <Card sx={{ mt: 2 }}>
            <CardContent sx={{ textAlign: 'center' }}>
                Text
            </CardContent>
        </Card>
    );

};
export default CampaignDashboard
