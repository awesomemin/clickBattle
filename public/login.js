const univ = document.getElementById('univ');
const form = document.getElementById('form');

univ.addEventListener('click', async (e) => {
  console.log(e.target.innerText);
  await axios.get('/univ');
  window.location.replace('/univ');
});

window.onload = () => {
  if(localStorage.univ) {
    univ.innerText = localStorage.univ;
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if(e.target[0].value === "" || univ.innerText === "학교를 선택해주세요") {
    alert('학교와 이름을 모두 입력한 뒤 다시 시도해주세요.');
  } else {
    const data = {
      univ: univ.innerText,
      name: e.target[0].value,
    };
    await axios.post('/login', data);
    window.location.replace('/main');
  }
});