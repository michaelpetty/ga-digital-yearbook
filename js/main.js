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
          <img src="/i/profile/zoom/${getFirstName(zoomer).toLowerCase()}.png" alt="anya on zoom" />
        </figure>
      </div>
    `;
  })
}

const displayZoom = zoomers => {
  const zoomWindow = document.querySelector('.zoom');
  zoomWindow.insertAdjacentHTML('afterbegin', buildZoomPanes(zoomers).join(''));
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

displayZoom(randomizeListOrder(userData));
