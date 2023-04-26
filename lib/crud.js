const addTwitter = async (instaHandle, setFan, address) => {
    console.log('HERE1  ' + instaHandle);
    const result = await fetch("/api/dashboard/fan", {
        method: "POST",
        body: JSON.stringify({ instaHandle }),
    });
    if (result.status == 200) {
    }

};

export { addTwitter }