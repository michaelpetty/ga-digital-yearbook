import {parser} from './jquery.csv.js';
import {instructorData, spiritData} from './instructorData.js';

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

const buildInstructorProfile = (ele, instructor) => {
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
          <img src="./i/instructor/${instructor.img}" alt="${instructor.name}" />
        </figure>
        <h2>${instructor.name}</h2>
        <h5>${instructor.title}</h5>
        <ul>
        ${(instructor.linkedIn) && `
          <li>
            <h6>LinkedIn</h6>
            <a href="${instructor.linkedIn}">${instructor.linkedIn}</a>
          </li>
          `}
          ${(instructor.github) && `
          <li>
            <h6>GitHub</h6>
            <a href="${instructor.github}">${instructor.github}</a>
          </li>
          `}
          ${(instructor.email) && `
          <li>
            <h6>Email Address</h6>
            <a href="mailto:${instructor.email}">${instructor.email}</a>
          </li>
          `}
        </ul>
      </div>
    </div>
  `);
  return profileDiv;
}

const buildFolders = folders => {
  let folderHTML = '';
  folders.forEach((folder, i) => {
    folderHTML += `
      <figure class="folder" data-fileid="${i}">
        ${(folder.file)? `
          <img src="./i/spirit/${folder.img}" alt="${folder.name}" />
        ` : `
          <img src="./i/folder.png" alt="folder icon" />
        `}
        <figcaption>${(folder.file)? `${folder.name}` : `${folder.name.split(' ')[0]}`}</figcaption>
      </figure>
    `
  })
  return folderHTML;
}

const buildFinder = (ele, title, folders) => {
  ele.querySelector('h3').innerHTML = `<img src="./i/folder.png" alt="folder icon">${title}`;
  let profileDiv = document.createElement('div');
  profileDiv.classList.add('window-main');
  profileDiv.insertAdjacentHTML('afterbegin', `
    <div class="finder-main">
      <div class="side">
        Favorites
        <ul>
          <li>Recents</li>
          <li>Applications</li>
          <li>Downloads</li>
          <li>Desktop</li>
        </ul>
      </div>
      <div class="content">
      ${buildFolders(folders)}
      </div>
    </div>
  `);
  return profileDiv;
}

const displayZoom = (zoomers, ele) => {
  ele.insertAdjacentHTML('afterbegin', buildZoomPanes(zoomers).join(''));
}

const buildModal = (ele, type, id) => {
  switch (type[0]) {
    case 'zoom':
      ele.classList.remove('slack', 'finder', 'ga', 'spirit');
      break;
    case 'slack':
      ele.classList.remove('zoom', 'finder', 'ga', 'spirit');
      break;
    case 'finder':
      ele.classList.remove('zoom', 'slack', (type[1] === 'spirit')? 'ga' : 'spirit');
      break;
  }
  ele.classList.add(...type);
  ele.setAttribute('data-zoomerid', (id)? id:'');
}
const displayZoomModal = (zoomer, ele, id) => {
  buildModal(ele, ['zoom'], id);
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

const loadPage = (students, instructors, spirit) => {
  let zoomWindow = document.getElementById('zoom-classroom');
  let modalEle = document.querySelector('.modal');

  let zoomersRandom = randomizeListOrder(students);
  displayZoom(zoomersRandom, zoomWindow);

  zoomWindow.addEventListener('click', e => {
    let zoomerId = e.target.parentNode.parentNode.dataset.zoomerid;
    displayZoomModal(zoomersRandom[zoomerId], modalEle, zoomerId);
  })

  document.querySelector('.folder.ga').addEventListener('click', e => {
    buildModal(modalEle, ['finder','ga']);
    modalEle.querySelector('.window-main').replaceWith(buildFinder(modalEle, 'GA', instructors));
    // TODO: displayModal(modalEle);
    modalEle.classList.remove('hidden');
  })

  document.querySelector('.folder.spirit').addEventListener('click', e => {
    buildModal(modalEle, ['finder','spirit']);
    modalEle.querySelector('.window-main').replaceWith(buildFinder(modalEle, 'SPIRIT', spirit));
    // TODO: displayModal(modalEle);
    modalEle.classList.remove('hidden');
  })

  document.querySelector('.folder.sei9').addEventListener('click', e => {
    document.querySelector('.window.zoom').classList.remove('hidden');
  })

  document.querySelector('.window.zoom .buttons').addEventListener('click', e => {
    document.querySelector('.window.zoom').classList.add('hidden');
  })

  document.querySelector('.modal').addEventListener('click', e => {
    let paths = e.composedPath();
    if (e.target.parentNode.className === 'buttons') {
      modalEle.classList.add('hidden');
    } else if (paths[0].localName === 'figure' || paths[1].localName === 'figure' || paths[2].localName === 'figure' ) {
      if (paths[0].className === 'folder' || paths[1].className === 'folder') {
        let instructorId = paths[0].dataset.fileid || paths[1].dataset.fileid;
        buildModal(modalEle, ['slack']);
        modalEle.querySelector('.window-main').replaceWith(buildInstructorProfile(modalEle, instructors[instructorId]));
        // TODO: displayModal(modalEle);
        modalEle.classList.remove('hidden');
      } else if (paths[0].localName === 'figcaption' || paths[1].localName === 'figcaption') {
        let zoomerId = paths[4].dataset.zoomerid || paths[5].dataset.zoomerid;
        modalEle.querySelector('figcaption span').innerText = getRandomCaption(zoomersRandom[zoomerId]);
      }
    }
  })
}

fetch('./js/userData.csv')
  .then(res => res.text())
  .then(data => {
    loadPage(cleanData(parser.csv.toArrays(data)), instructorData, spiritData);
  });
