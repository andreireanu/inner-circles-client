async function getUserID(instaHandle, env) {

    // TODO
    // Determine a way to get sessionid automatically
    // Sessionid is now a personal user generated id
    const uri = env.INSTA_URL +
        '/id_from_username?username=' +
        instaHandle +
        '&sessionid=' +
        env.sessionid

    var request = new Request(uri, {
        method: 'GET',
        mode: "cors",
        headers: new Headers({
            'Accept': 'application/json',
        })
    });

    const user = await fetch(request)
        .then((response) => response.json())
        .then((responseJson) => {
            const user = responseJson[0].owner
            return user;
        })
        .catch((error) => {
            console.error(`Failed to fetch data: ${error.message}`);
            return null;
        });

    return user;

};

async function addUser(user) {
    const result = await fetch("/api/dashboard/fan", {
        method: "POST",
        body: JSON.stringify({ user }),
    });
    if (result.status == 200) {
    }
};

async function enrollUser(instaHandle, setFan, env) {

    try {
        const user = await getUserID(instaHandle, env);
        // TO DO
        // API Returns pontormian user data if instaHandle inexistent
        // Need to find an alternative
        if (user['id'] != '7553568911') {
            user['address'] = env.address;
            addUser(user);
            setFan(user);
        }
    } catch (error) {
        console.error(error.message);
    }
}

/**
 * @typedef {Object} CampaignFormat
 * @property {string} address
 * @property {number} comments
 * @property {string} id
 * @property {string} _id
 * @property {number} likes
 * @property {number} timestamp
 * @property {string} username
 */

/**
 * Fetches campaign data from Instagram.
 * @param {string|string[]} hashtag
 * @param {string} env
 * @param {*} data
 * @returns {Promise<CampaignFormat[]>}
 */
async function getCampaignDataFromInsta(hashtag, env, data) {

    const uri = env.INSTA_URL +
        '/campaign_data?campaign_name=' +
        hashtag +
        '&sessionid=' +
        env.sessionid +
        '&count=5'

    var request = new Request(uri, {
        method: 'GET',
        mode: "cors",
        headers: new Headers({
            'Accept': 'application/json',
        })
    });

    let out;
    await fetch(request)
        .then((response) => response.json())
        .then((responseJson) => {
            let users = data.fanData
            let usersToKeep = users.map(obj => obj.id);
            let jsonParse = JSON.parse(JSON.stringify(responseJson))
            let filteredRecords = jsonParse.filter(obj => usersToKeep.includes(obj.owner.id));
            console.log(filteredRecords)
            let selectedFields = filteredRecords.map(obj => (
                {
                    id: obj.id,
                    instaId: obj.owner.id,
                    likes: obj.likes,
                    comments: obj.comments,
                    timestamp: obj.taken_at_timestamp,
                    description: obj.description,
                    hashtags: obj.hashtags,
                    mentions: obj.mentions,
                }
            ));
            let updatedFields = selectedFields.filter((record) =>
                usersToKeep.includes(record.instaId)
            );
            addCampaign(updatedFields, hashtag)
            out = updatedFields;
        })
        .catch((error) => {
            console.error(`Failed to fetch data: ${error.message}`);
            return null;
        });
    return out;
}

async function addCampaign(campaignData, campaign) {
    const result = await fetch("/api/dashboard/campaign", {
        method: "POST",
        body: JSON.stringify({ campaignData, campaign }),
    });
    if (result.status == 200) {
    }
};

export { enrollUser, getCampaignDataFromInsta }

