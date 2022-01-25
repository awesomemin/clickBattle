const selectedUniv = document.getElementById('selectedUniv');
const univ1 = document.getElementById('1');
const univ2 = document.getElementById('2');
const univ3 = document.getElementById('3');
const univ4 = document.getElementById('4');
const univ5 = document.getElementById('5');
const univ6 = document.getElementById('6');
const btn = document.getElementById('btn');

univ1.addEventListener('click', () => {
  selectedUniv.innerText = "서울대학교";
});

univ2.addEventListener('click', () => {
  selectedUniv.innerText = "연세대학교";
});

univ3.addEventListener('click', () => {
  selectedUniv.innerText = "고려대학교";
});

univ4.addEventListener('click', () => {
  selectedUniv.innerText = "서강대학교";
});

univ5.addEventListener('click', () => {
  selectedUniv.innerText = "성균관대학교";
});

univ6.addEventListener('click', () => {
  selectedUniv.innerText = "한양대학교";
});

btn.addEventListener('click', () => {
  if(selectedUniv.innerText == "선택되지 않음") {
    alert("학교를 선택하고 다시 시도해주세요.");
  } else {
    localStorage.setItem('univ', selectedUniv.innerText);
    window.location.replace('/login');
  }
})