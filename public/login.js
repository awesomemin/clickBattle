const univ = document.getElementById('univ');
const form = document.getElementById('form');

const univInfo = {
  1: "서울대학교",
  2: "연세대학교",
  3: "고려대학교",
  4: "서강대학교",
  5: "성균관대학교",
  6: "한양대학교"
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  localStorage.setItem('univ', e.target[1].value);
  const data = {
    univ: univInfo[e.target[0].value],
    name: e.target[1].value
  };
  await axios.post('/login', data);
  location.replace('/main');
});