const picsart = (url) => {
    const form = new FormData();
    form.append('effect_name', 'cyber1');
    form.append('format', 'JPG');
    form.append('image_url', url);

    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'X-Picsart-API-Key': 'RRZOx77uzZv8vTM2ZyDnvSRwapYtJUrG'
        }
    };

    options.body = form;

    fetch('https://api.picsart.io/tools/1.0/effects', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
}

export default picsart