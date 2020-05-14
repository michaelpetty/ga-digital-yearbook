import {userData} from './userData.js';

console.log('You rock!');

const getFirstName = (zoomer) => {
  return (zoomer[0].split(' '))[0];
}
const buildZoomPanes = zoomers => {
  return zoomers.map((zoomer, i) => {
    return `
      <div class="zoom-pane" data-zoomerId=${i}>
        <figure>
          <img src="./i/profile/zoom/${getFirstName(zoomer).toLowerCase()}.png" alt="anya on zoom" />
        </figure>
      </div>
    `;
  })
}

const buildStudentProfile = zoomer => {
  const profileDiv = document.createElement('div');
  profileDiv.classList.add('zoom');
  profileDiv.id = 'student-profile'
  profileDiv.insertAdjacentHTML('afterbegin', `
    <div class="student">
      <figure>
        <img src="./i/profile/${getFirstName(zoomer).toLowerCase()}.png" alt="anya on zoom" />
        <figcaption>${zoomer[Math.floor(Math.random() * (zoomer.length-1)) + 1]}</figcaption>
      </figure>
    </div>
  `);
  return profileDiv;
}

const displayZoom = (zoomers, ele) => {
  ele.insertAdjacentHTML('afterbegin', buildZoomPanes(zoomers).join(''));
}

const displayZoomModal = zoomer => {
  document.getElementById('student-profile').replaceWith(buildStudentProfile(zoomer));
  document.querySelector('.zoom-modal').classList.remove('hidden');
}

const randomizeListOrder = list => {
  const randomList = [];
  const tmpList = Array(...list);
  const len = tmpList.length;
  for (let i=0; i<len; i++) {
    randomList.push(tmpList.splice(Math.floor(Math.random()*tmpList.length), 1)[0])
  }
  return randomList;
}

const zoomersRandom = randomizeListOrder(userData);
const zoomWindow = document.getElementById('zoom-classroom');
displayZoom(zoomersRandom, zoomWindow);

zoomWindow.addEventListener('click', e => {
  displayZoomModal(zoomersRandom[e.target.parentNode.parentNode.dataset.zoomerid]);
})

document.querySelector('.zoom-modal .buttons').addEventListener('click', e => {
  document.querySelector('.zoom-modal').classList.add('hidden');
})
