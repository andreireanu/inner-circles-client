
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


async function getCampaignData(hashtag, env, data) {

    let dbData;
    dbData = getCampaignDataFromDb(hashtag)
    if (dbData == '') {
        dbData = getCampaignDataFromInsta(hashtag, env, data);
    }
    console.log(dbData);
}

async function getCampaignDataFromDb(hashtag) {

    // GET MONGO DB DATA
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const campaign_collection = db.collection(hashtag);
    const data = await campaign_collection.find().toArray()
    return data
}

async function getCampaignDataFromInsta(hashtag, env, data) {

    const uri = env.INSTA_URL +
        '/campaign_data?campaign_name=' +
        hashtag +
        '&sessionid=' +
        env.sessionid +
        '&count=5'

    // /*
    let users = data.campaign_data
    let usersToKeep = users.map(obj => obj.id);
    let jsonStringify = '[{"id":"3125861138678494904","shortcode":"CthSiTkITa4","type":"GraphSidecar","is_video":false,"dimension":{"height":1080,"width":1080},"display_url":"https://scontent-fra5-1.cdninstagram.com/v/t51.2885-15/353785550_3575374419411972_5462457362539680681_n.jpg?stp=dst-jpg_e35_s1080x1080&_nc_ht=scontent-fra5-1.cdninstagram.com&_nc_cat=100&_nc_ohc=n-yVdno0hTwAX_UAhz1&edm=AA0rjkIBAAAA&ccb=7-5&oh=00_AfBoKvD7V3uT3U4GD9Dm0HPIfYfCBKoq6qMUNDvEQDVf8A&oe=64932037&_nc_sid=501f91","thumbnail_src":"https://scontent-fra5-1.cdninstagram.com/v/t51.2885-15/353785550_3575374419411972_5462457362539680681_n.jpg?stp=dst-jpg_e35_s640x640_sh0.08&_nc_ht=scontent-fra5-1.cdninstagram.com&_nc_cat=100&_nc_ohc=n-yVdno0hTwAX_UAhz1&edm=AA0rjkIBAAAA&ccb=7-5&oh=00_AfDlbA5uvcytcT8Oh18fjGIScnJCqVYQXP1JDEhoCvj7Kg&oe=64932037&_nc_sid=501f91","owner":{"id":"8479687547"},"description":"🩸 22.06.2023 @clubcontrol 🩸\n\n#dimitrisbats","comments":4,"likes":59,"comments_disabled":false,"taken_at_timestamp":1686851707,"hashtags":["#dimitrisbats"],"mentions":["@clubcontrol"]},{"id":"3124277420893592967","shortcode":"CtbqcLcIt2H","type":"GraphImage","is_video":false,"dimension":{"height":1080,"width":1080},"display_url":"https://scontent-fra5-2.cdninstagram.com/v/t51.2885-15/353048315_6036436389815118_2449834891834070946_n.jpg?stp=dst-jpg_e35_s1080x1080&_nc_ht=scontent-fra5-2.cdninstagram.com&_nc_cat=106&_nc_ohc=lP7A86yR3yUAX_hSnCM&edm=AA0rjkIBAAAA&ccb=7-5&oh=00_AfB1G_MCFYBQnWXDd-OrRjyKPu9xHJ67RrMkgdPIwY0xpQ&oe=649460E2&_nc_sid=501f91","thumbnail_src":"https://scontent-fra5-2.cdninstagram.com/v/t51.2885-15/353048315_6036436389815118_2449834891834070946_n.jpg?stp=dst-jpg_e35_s640x640_sh0.08&_nc_ht=scontent-fra5-2.cdninstagram.com&_nc_cat=106&_nc_ohc=lP7A86yR3yUAX_hSnCM&edm=AA0rjkIBAAAA&ccb=7-5&oh=00_AfASFRnF4ahstVGilCnAIMlF8rkzSo7Ryxzh_tcVM2z4TQ&oe=649460E2&_nc_sid=501f91","owner":{"id":"5680591644"},"description":"can you find the penguin? 🐧\n\n#dimitrisbats","comments":8,"likes":76,"comments_disabled":false,"taken_at_timestamp":1686662913,"hashtags":["#dimitrisbats"],"mentions":[]},{"id":"3123628627235789643","shortcode":"CtZW6_QoVtL","type":"GraphImage","is_video":false,"dimension":{"height":1080,"width":1080},"display_url":"https://scontent-fra3-1.cdninstagram.com/v/t51.2885-15/352810630_1414103812737953_6000138573499363174_n.jpg?stp=dst-jpg_e35_s1080x1080&_nc_ht=scontent-fra3-1.cdninstagram.com&_nc_cat=105&_nc_ohc=3nHNZG3ogzIAX9p7pgA&edm=AA0rjkIBAAAA&ccb=7-5&oh=00_AfASmtrFudIIPZimH8TOyWE5FcS7tuT0u3VxtiBPN0Jy2Q&oe=6493C8C1&_nc_sid=501f91","thumbnail_src":"https://scontent-fra3-1.cdninstagram.com/v/t51.2885-15/352810630_1414103812737953_6000138573499363174_n.jpg?stp=dst-jpg_e35_s640x640_sh0.08&_nc_ht=scontent-fra3-1.cdninstagram.com&_nc_cat=105&_nc_ohc=3nHNZG3ogzIAX9p7pgA&edm=AA0rjkIBAAAA&ccb=7-5&oh=00_AfAntYkl1QV-N9dqKHzfzVqIPe2J94QXQtI_CXJsphoFNQ&oe=6493C8C1&_nc_sid=501f91","owner":{"id":"5680591644"},"description":"🍭 june 22nd @clubcontrol \n\n#dimitrisbats","comments":2,"likes":100,"comments_disabled":false,"taken_at_timestamp":1686585571,"hashtags":["#dimitrisbats"],"mentions":["@clubcontrol"]}]'
    let escapedJsonString = jsonStringify.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");
    let jsonParse = JSON.parse(escapedJsonString);
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
// */

/*
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
        let jsonParse = JSON.parse(JSON.stringify(responseJson))

        console.log(data.fan_data)
        console.log(responseJson)

        for (const item of jsonParse) {
            const ownerId = item.owner.id;
            const likes = item.likes;
            const comments = item.comments;
            const timestamp = item.taken_at_timestamp;

            console.log(`Owner ID: ${ownerId}`);
            console.log(`Likes: ${likes}`);
            console.log(`Comments: ${comments}`);
            console.log(`Timestamp: ${timestamp}`);
            console.log('---');
        }
    })
    .catch((error) => {
        console.error(`Failed to fetch data: ${error.message}`);
        return null;
    });
    */
}

async function addCampaign(campaignData, campaign) {
    const result = await fetch("/api/dashboard/campaign", {
        method: "POST",
        body: JSON.stringify({ campaignData, campaign }),
    });
    if (result.status == 200) {
    }
};

export { enrollUser, getCampaignData }

