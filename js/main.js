import {parser} from './jquery.csv.js';
import {instructorData, spiritData} from './instructorData.js';

const s3BaseUrl = "https://ga-digital-yearbook.s3-us-west-1.amazonaws.com/wc-sei-0119";

console.log('You got this!');

const getRandomCaption = zoomer => {
  return zoomer[Math.floor(Math.random() * (zoomer.length))]
}

const buildZoomPanes = zoomers => {
  return zoomers.map((zoomer, i) => {
    return `
      <div class="zoom-pane" data-zoomerid=${i}>
        <figure>
          <img src="${s3BaseUrl}/zoom/${zoomer.zoomImg}"  alt="${zoomer.name}" />
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
        <img src="${s3BaseUrl}/slack/${zoomer.slackImg}" alt="${zoomer.name}" />
        <figcaption><span>${getRandomCaption(zoomer.quotes)}</span><img class="refresh" src="./i/refresh.png"></figcaption>
      </figure>
    </div>
  `);
  return profileDiv;
}

const buildInstructorProfile = (ele, instructor) => {
  ele.querySelector('h3').innerText = '#seir_119_strictlybiz';
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
            <a href="${instructor.linkedIn}" target="_blank">${instructor.linkedIn}</a>
          </li>
          `}
          ${(instructor.github) && `
          <li>
            <h6>GitHub</h6>
            <a href="${instructor.github}" target="_blank">${instructor.github}</a>
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
    folderHTML += `<figure class="folder" data-fileid="${i}">`
    if (folder.file) {
    folderHTML += `
        ${(folder.link)? `
          <a href="${folder.link}" target="_blank"><img src="./i/file.png"/></a>
        ` : `
          <img src="${s3BaseUrl}/spirit/th/${folder.thumb}" alt="${folder.name}" />
        `}`
      } else {
        folderHTML += '<img src="./i/folder.png" alt="folder icon" />'
      }
    folderHTML += `
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

const buildSpirit = (spirit, ele) => {
  ele.innerText = '';
  ele.insertAdjacentHTML('afterbegin', `
  <figure>
    <img src="${s3BaseUrl}/spirit/${spirit.img}" alt="folder icon" />
    <figcaption>${spirit.name}</figcaption>
  </figure>
  `);
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
  ele.querySelector('h3').innerText = `WC SEI 0119 - ${zoomer.name}`;
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
    const [name, slackImg, zoomImg] = zoomer.splice(0, 3);
    arr[i] = {
      name,
      slackImg,
      zoomImg,
      quotes: zoomer.filter(cell => /\w/.test(cell))
    }
  })
  return arr;
}

const loadPage = (students, instructors, spirit) => {
  let zoomWindow = document.getElementById('zoom-main');
  let zoomSpirit = document.getElementById('zoom-spirit');
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
    modalEle.querySelector('.window-main').replaceWith(buildFinder(modalEle, 'RESOURCES', spirit));
    // TODO: displayModal(modalEle);
    modalEle.classList.remove('hidden');
  })

  document.querySelector('.folder.sei').addEventListener('click', e => {
    document.querySelector('.window.zoom').classList.remove('hidden');
  })

  document.querySelector('.window.zoom .buttons').addEventListener('click', e => {
    document.querySelector('.window.zoom').classList.add('hidden');
  })

  zoomSpirit.addEventListener('click', e => {
    zoomSpirit.classList.toggle('hidden');
    zoomWindow.classList.toggle('hidden');
  })
  document.querySelector('.modal').addEventListener('click', e => {
    let paths = e.composedPath();
    if (e.target.parentNode.className === 'buttons') {
      modalEle.classList.add('hidden');
    } else if (paths[0].localName === 'figure' || paths[1].localName === 'figure' || paths[2].localName === 'figure' ) {
      if (paths[0].className === 'folder' || paths[1].className === 'folder') {
        let dataId = paths[0].dataset.fileid || paths[1].dataset.fileid;
        if (paths[4].className === 'modal finder ga' || paths[5].className === 'modal finder ga') {
          buildModal(modalEle, ['slack']);
          modalEle.querySelector('.window-main').replaceWith(buildInstructorProfile(modalEle, instructors[dataId]));
          // TODO: displayModal(modalEle);
          modalEle.classList.remove('hidden');
        } else if (!spirit[0].link && (paths[4].className === 'modal finder spirit' || paths[5].className === 'modal finder spirit')) {
          buildSpirit(spiritData[dataId], zoomSpirit);
          zoomSpirit.classList.remove('hidden');
          zoomWindow.classList.add('hidden');
          modalEle.classList.add('hidden');
          document.querySelector('.window.zoom').classList.remove('hidden');
        }
      } else if (paths[0].localName === 'figcaption' || paths[1].localName === 'figcaption') {
        let zoomerId = paths[4].dataset.zoomerid || paths[5].dataset.zoomerid;
        modalEle.querySelector('figcaption span').innerText = getRandomCaption(zoomersRandom[zoomerId].quotes);
      }
    }
  })
}

fetch('./js/wcsei0119.csv')
  .then(res => res.text())
  .then(data => {
    loadPage(cleanData(parser.csv.toArrays(data)), instructorData, spiritData);
  });
