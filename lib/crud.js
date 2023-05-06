const getInstaId = async (instaHandle, setFan, address) => {

};



const addInsta = async (instaHandle, setFan, address) => {
    const result = await fetch("/api/dashboard/fan", {
        method: "POST",
        body: JSON.stringify({ instaHandle }),
    });
    if (result.status == 200) {
    }

};

export { addInsta, getInstaId }