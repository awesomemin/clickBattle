const btn = document.getElementById('btn');
const indivScore = document.getElementById('indivScore');
const univScore = document.getElementById('univScore');
const ranking = document.getElementById('ranking');

btn.addEventListener('click', async () => {
  const res = await axios.post('/main');
  console.dir(res.data);
  indivScore.innerText = res.data.user[0].point;
  univScore.innerText = res.data.univ[0].point;
})

setInterval(async () => {
  const rankingData = await axios.get('/main.json');
  rankingData.data.sort((a, b) => {
    return b.point - a.point;
  })
  console.log(Array.prototype.slice.call(ranking.children));
  for (let i = 0; i < Array.prototype.slice.call(ranking.children).length; i++) {
    Array.prototype.slice.call(ranking.children)[i].innerText = rankingData.data[i].name + " " + rankingData.data[i].point;
  }
}, 1000)

function compare(a, b) {
  if(a.point >= b.point) {
    return -1;
  } else {
    return 1;
  }
}