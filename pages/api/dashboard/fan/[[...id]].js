import clientPromise from "../../../../lib/mongodb"


export default async (req, res) => {
    const {
        query: { id },
        method,
    } = req;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const fan_collection = db.collection(process.env.MONGODB_FAN);
    let result;


    switch (method) {
        case 'POST':
            {
                const { user } = JSON.parse(req.body);
                result = await fan_collection.insertOne(
                    {
                        id: user.id,
                        username: user.username,
                        address: user.address
                    });
                if (result['acknowledged'] == true) {
                    res.status(200).json("");
                } else {
                    res.status(500).json("");
                }
                break;
            }
    }
}