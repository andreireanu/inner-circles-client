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
            console.log('Fetch result: ' + responseJson)
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
        console.log(user);
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

    await fetch(request)
        .then((response) => response.json())
        .then((responseJson) => {
            let users = data.fanData
            let usersToKeep = users.map(obj => obj.id);
            console.log('Fetch result: ' + responseJson)
            let jsonParse = JSON.parse(JSON.stringify(responseJson))
            let filteredRecords = jsonParse.filter(obj => usersToKeep.includes(obj.owner.id));
            let selectedFields = filteredRecords.map(obj => (
                {
                    id: obj.owner.id,
                    likes: obj.likes,
                    comments: obj.comments,
                    timestamp: obj.taken_at_timestamp
                }
            ));

            let updatedFields = selectedFields.map(obj => {
                let matchingData = users.find(dataObj => dataObj.id === obj.id);
                const { _id, address, ...restMatchingData } = matchingData;
                return { ...obj, ...restMatchingData };
            });
            addCampaign(updatedFields, hashtag)
        })
        .catch((error) => {
            console.error(`Failed to fetch data: ${error.message}`);
            return null;
        });
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

