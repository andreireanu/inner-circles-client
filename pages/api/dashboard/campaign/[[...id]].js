import clientPromise from "../../../../lib/mongodb"


export default async (req, res) => {
    const {
        method,
    } = req;
    const { campaignData, campaign } = JSON.parse(req.body)
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const campaign_collection = db.collection(campaign);
    let result;

    switch (method) {
        case 'POST':
            {
                result = await campaign_collection.insertMany(
                    campaignData);
                if (result['acknowledged'] == true) {
                    res.status(200).json("");
                } else {
                    res.status(500).json("");
                }
                break;
            }
    }
}