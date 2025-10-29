const API_URL = proccess.env.YOUTUBE_DATA_API_URL;
async function getSubscriberCount() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        if (data.subscriberCount) {
            document.getElementById('subscriber-count-display').textContent = data.subscriberCount;
        } else {
            document.getElementById('subscriber-count-display').textContent = 'Error';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('subscriber-count-display').textContent = 'Error';
    }
}
getSubscriberCount();
