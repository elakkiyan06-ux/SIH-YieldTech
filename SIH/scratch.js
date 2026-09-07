const ids = ['DYpPU_HFuYs', 'DaXovpYT6wN', 'Da_9K8Dz7VD'];

(async () => {
  for (const id of ids) {
    const res = await fetch('https://www.instagram.com/p/' + id + '/embed/captioned');
    const data = await res.text();
    const usernameRegex = /"username":"(.*?)"/;
    const userMatch = data.match(usernameRegex);
    const profilePicRegex = /"profile_pic_url":"(.*?)"/;
    const picMatch = data.match(profilePicRegex);
    console.log('ID:', id);
    console.log('Username:', userMatch ? userMatch[1] : 'Not found');
    console.log('Profile Pic:', picMatch ? picMatch[1].replace(/\\/g, '') : 'Not found');
    console.log('---');
  }
})();
