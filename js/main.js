import {tempo} from './jquery.csv.js';

console.log('You rock!');

const getFirstName = (zoomer) => {
  return (zoomer[0].split(' '))[0];
}

const getRandomCaption = zoomer => {
  return zoomer[Math.floor(Math.random() * (zoomer.length-1)) + 1]
}

const buildZoomPanes = zoomers => {
  return zoomers.map((zoomer, i) => {
    return `
      <div class="zoom-pane" data-zoomerid=${i}>
        <figure>
          <img src="./i/profile/zoom/${getFirstName(zoomer).toLowerCase()}.png" alt="${zoomer[0]}" />
        </figure>
      </div>
    `;
  })
}

const buildStudentProfile = zoomer => {
  let profileDiv = document.createElement('div');
  profileDiv.classList.add('window-main');
  profileDiv.insertAdjacentHTML('afterbegin', `
    <div class="student">
      <figure>
        <img src="./i/profile/${getFirstName(zoomer).toLowerCase()}.png" alt="${zoomer[0]}" />
        <figcaption><span>${getRandomCaption(zoomer)}</span>&nbsp;<div class="refresh"></div></figcaption>
      </figure>
    </div>
  `);
  return profileDiv;
}

const buildInstructorProfile = (ele) => {
  ele.querySelector('h3').innerText = '#sei-sf09-strictlybiz';
  let profileDiv = document.createElement('div');
  profileDiv.classList.add('window-main');
  profileDiv.insertAdjacentHTML('afterbegin', `
    <div class="instructor">
      <div class="side">
        <img src="./i/ga-slack.png" alt="slack channel" />
      </div>
      <div class="content">
        <h4>Profile</h4>
        <figure>
          <img src="./i/profile/michael.png" alt="Michael Petty" />
        </figure>
        <h2>Michael Petty</h2>
        <h5>SEI Instructor - SF</h5>
        <ul>
          <li>
            <h6>LinkedIn</h6>
            <a href="https://www.linkedin.com/in/michaelpetty42/">https://www.linkedin.com/in/michaelpetty42/</a>
          </li>
          <li>
            <h6>GitHub</h6>
            <a href="https://github.com/michaelpetty">https://github.com/michaelpetty</a>
          </li>
          <li>
            <h6>Email Address</h6>
            <a href="mailto:michael.petty@gmail.com">michael.petty@gmail.com</a>
          </li>
        </ul>
      </div>
    </div>
  `);
  return profileDiv;

}

const displayZoom = (zoomers, ele) => {
  ele.insertAdjacentHTML('afterbegin', buildZoomPanes(zoomers).join(''));
}

const buildModal = (ele, type, id) => {
  (type === 'zoom')? ele.classList.remove('slack') : ele.classList.remove('zoom');
  ele.classList.add(type);
  ele.setAttribute('data-zoomerid', id)
}
const displayZoomModal = (zoomer, ele, id) => {
  buildModal(ele, 'zoom', id);
  ele.querySelector('h3').innerText = `SEI 9 - ${zoomer[0]}`;
  ele.querySelector('.window-main').replaceWith(buildStudentProfile(zoomer));
  ele.classList.remove('hidden');
}

const randomizeListOrder = list => {
  let randomList = [];
  let tmpList = Array(...list);
  let len = tmpList.length;
  for (let i=0; i<len; i++) {
    randomList.push(tmpList.splice(Math.floor(Math.random()*tmpList.length), 1)[0])
  }
  return randomList;
}

const cleanData = arr => {
  arr.forEach((zoomer, i) => {
    arr[i] = zoomer.filter(cell => cell !== '');
  })
  return arr;
}

const loadPage = data => {
  let zoomWindow = document.getElementById('zoom-classroom');
  let modalEle = document.querySelector('.modal');

  document.querySelector('.ga-folder').addEventListener('click', e => {
    buildModal(modalEle, 'slack');
    modalEle.querySelector('.window-main').replaceWith(buildInstructorProfile(modalEle));
    // TODO: displayModal(modalEle);
    modalEle.classList.remove('hidden');
  })

  let zoomersRandom = randomizeListOrder(data);
  displayZoom(zoomersRandom, zoomWindow);

  zoomWindow.addEventListener('click', e => {
    let zoomerId = e.target.parentNode.parentNode.dataset.zoomerid;
    displayZoomModal(zoomersRandom[zoomerId], modalEle, zoomerId);
  })

  document.querySelector('.modal').addEventListener('click', e => {
    if (e.target.parentNode.className === 'buttons') {
      modalEle.classList.add('hidden');
    } else if (e.target.localName === 'figcaption' || e.target.parentNode.localName === 'figcaption') {
      let zoomerId = e.path[4].dataset.zoomerid || e.path[5].dataset.zoomerid;
      modalEle.querySelector('figcaption span').innerText = getRandomCaption(zoomersRandom[zoomerId]);
    }
  })

}

fetch('./js/userData.csv')
  .then(res => res.text())
  .then(data => {
    loadPage(cleanData(tempo.csv.toArrays(data)));
  });
