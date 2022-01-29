const btn = document.getElementById('btn');
const indivScore = document.getElementById('indivScore');
const univScore = document.getElementById('univScore');
const ranking = document.getElementById('rankingTable');
const rankingTableBody = document.getElementById('rankingTableBody');
const info = document.getElementById('info');

let rankingMode = 0; // 0 : 대학랭킹 , 1 : 개인랭킹

btn.addEventListener('click', async () => {
  const res = await axios.post('/main');
  indivScore.innerText = res.data.user[0].point + 1;
  univScore.innerText = res.data.univ[0].point + 1;
})

async function updateUnivRanking() {
  const univRankingData = await axios.get('/main.univ');
  univRankingData.data.sort((a, b) => {
    return b.point - a.point;
  })
  for (let i = 0; i < univRankingData.data.length; i++) {
    Array.prototype.slice.call(rankingTableBody.children)[i].innerHTML = `<td>${i+1}</td><td>${univRankingData.data[i].name}</td><td>${univRankingData.data[i].point}</td>`
    if (univRankingData.data[i].point !== 0) {
      Array.prototype.slice.call(rankingTableBody.children)[i].children[1].addEventListener('click', goToUserRanking);
    }
  }
}

async function updateUserRanking() {
  const userRankingData = await axios.get('/main.user', {params: {
    univ: sessionStorage.getItem('targetUniv')
  }});
  userRankingData.data.sort((a, b) => {
    return b.point - a.point;
  })
  for (let i = 0; i < userRankingData.data.length; i++) {
    Array.prototype.slice.call(rankingTableBody.children)[i].innerHTML = `<td>${i+1}</td><td>${userRankingData.data[i].name}</td><td>${userRankingData.data[i].point}</td>`
    Array.prototype.slice.call(rankingTableBody.children)[i].children[1].addEventListener('click', goToUnivRanking);
  }
}

setInterval(() => {
  if (rankingMode) {
    updateUserRanking();
  } else {
    updateUnivRanking();
  }
}, 1000);

window.onload = async () => {
  initializeRanking();
}

async function goToUserRanking(e) {
  sessionStorage.setItem('targetUniv', e.target.innerText);
  resetTableBody();
  rankingMode = 1;
  ranking.children[0].children[0].children[1].innerText = "이름";
  info.innerHTML = "아무 이름이나 클릭하여<br>학교 랭킹으로 돌아갑니다.";
  const userRankingData = await axios.get('/main.user', {params: {
    univ: sessionStorage.getItem('targetUniv')
  }});
  userRankingData.data.sort((a, b) => {
    return b.point - a.point;
  })
  for (let i = 0; i < userRankingData.data.length; i++) {
    const rank = document.createElement('td');
    rank.innerText = i + 1;
    const user = document.createElement('td');
    user.innerText = userRankingData.data[i].name;
    user.addEventListener('click', goToUnivRanking);
    const point = document.createElement('td');
    point.innerText = userRankingData.data[i].point;
    const tr = document.createElement('tr');
    tr.appendChild(rank);
    tr.appendChild(user);
    tr.appendChild(point);
    rankingTableBody.appendChild(tr);
  }
}

async function goToUnivRanking() {
  sessionStorage.removeItem('targetUniv');
  rankingMode = 0;
  ranking.children[0].children[0].children[1].innerText = "학교";
  info.innerHTML = "학교명을 클릭하면<br>교내 랭킹을 볼 수 있습니다.";
  resetTableBody();
  initializeRanking();
}

function resetTableBody() {
  const length = Array.prototype.slice.call(rankingTableBody.children).length;
  for (let i = 0; i < length; i++) {
    Array.prototype.slice.call(rankingTableBody.children)[0].remove();
  }
}

async function initializeRanking() {
  const univRankingData = await axios.get('/main.univ');
  univRankingData.data.sort((a, b) => {
    return b.point - a.point;
  })
  for (let i = 0; i < univRankingData.data.length; i++) {
    const rank = document.createElement('td');
    rank.innerText = i+1;
    const univ = document.createElement('td');
    univ.innerText = univRankingData.data[i].name;
    if (univRankingData.data[i].point !== 0) {
      univ.addEventListener('click', goToUserRanking);
    }
    const point = document.createElement('td');
    point.innerText = univRankingData.data[i].point;
    const tr = document.createElement('tr');
    tr.appendChild(rank);
    tr.appendChild(univ);
    tr.appendChild(point);
    rankingTableBody.appendChild(tr);
  }
}