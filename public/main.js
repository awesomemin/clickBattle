const btn = document.getElementById('btn');
const indivScore = document.getElementById('indivScore');
const univScore = document.getElementById('univScore');
const ranking = document.getElementById('ranking');
const rankingTableBody = document.getElementById('rankingTableBody');

btn.addEventListener('click', async () => {
  const res = await axios.post('/main');
  //console.dir(res.data);
  indivScore.innerText = res.data.user[0].point + 1;
  univScore.innerText = res.data.univ[0].point + 1;
})

async function getRanking() {
  const rankingData = await axios.get('/main.json');
  rankingData.data.sort((a, b) => {
    return b.point - a.point;
  })
  for (let i = 0; i < rankingData.data.length; i++) {
    console.dir(Array.prototype.slice.call(rankingTableBody.children)[i]);
    Array.prototype.slice.call(rankingTableBody.children)[i].innerHTML = `<td>${i+1}</td><td>${rankingData.data[i].name}</td><td>${rankingData.data[i].point}</td>`
  }
}

setInterval(getRanking, 1000)

window.onload = async () => {
  const rankingData = await axios.get('/main.json');
  rankingData.data.sort((a, b) => {
    return b.point - a.point;
  })
  for (let i = 0; i < rankingData.data.length; i++) {
    const rank = document.createElement('td');
    rank.innerText = i+1;
    const univ = document.createElement('td');
    univ.innerText = rankingData.data[i].name;
    const point = document.createElement('td');
    point.innerText = rankingData.data[i].point;
    const tr = document.createElement('tr');
    tr.appendChild(rank);
    tr.appendChild(univ);
    tr.appendChild(point);
    rankingTableBody.appendChild(tr);
  }
}

function compare(a, b) {
  if(a.point >= b.point) {
    return -1;
  } else {
    return 1;
  }
}