async function getUserID(instaHandle, env) {

    // TODO
    // Determine a way to get sessionid automatically
    // Sessionid is now a personal user generated id
    const uri = env.INSTA_URL +
        '/id_from_username?username=' +
        instaHandle +
        '&sessionid=' +
        env.sessionid
    console.log(uri)

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
        console.log(result.json())
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

export { enrollUser }

