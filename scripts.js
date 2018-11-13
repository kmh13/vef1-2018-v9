/**
 * Leit að lénum á Íslandi gegnum apis.is
 */

const API_URL = 'https://apis.is/isnic?domain=';

/**
 * Leit að lénum á Íslandi gegnum apis.is
 */

const program = (() => {
  let domains;

  function displayError(Villa) {
    const container = domains.querySelector('.results');
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(document.createTextNode(Villa));
  }

  function El(name, data) {
    if (data !== '') {
      const results = document.querySelector('.results');
      const dl = document.createElement('dl');
      results.appendChild(dl);
      const dt = document.createElement('dt');
      dl.appendChild(dt);
      dt.innerHTML = name;
      const dd = document.createElement('dd');
      dl.appendChild(dd);
      dd.innerHTML = data;
    }
  }

  function dateToday(date) {
    return new Date(date).toISOString().split('T')[0];
}
  function displayDomain(domainsList) {
    const results = document.querySelector('.results');
    while (results.firstChild) {
      results.removeChild(results.firstChild);
    }
    if (domainsList === undefined) {
      displayError('Len er ekki skráð');
      return;
    }

    const dl = document.createElement('dl');

    El('Lén', domainsList.domain);
    El('Skráð', dateToday(domainsList.registered));
    El('Seinast breytt', dateToday(domainsList.lastChange));
    El('Rennur út', dateToday(domainsList.expires));
    El('Skráningaraðili', domainsList.registrantname);
    El('Netfang', domainsList.email);
    El('Heimilisfang', domainsList.address);
    El('Land', domainsList.country);
    const container = domains.querySelector('.results');

    container.appendChild(dl);
  }


  function fetchData(info) {
    loading();
    fetch(`${API_URL}${info}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Villa kom upp');
      })

      .then((data) => {
        displayDomain(data.results[0]);
      })

      .catch((_error) => {
        displayError('Villa við að sækja gögn');
      });
  }

  function onSubmit(e) {
    e.preventDefault();
    const input = e.target.querySelector('input');
    if (input.value.trim() === '') {
      displayError('Lén verður að vera strengur');
      document.querySelector('input').value = '';
      return;
    }
    fetchData(input.value);
  }

  function init(_domains) {
    domains = _domains;
    const form = domains.querySelector('form');
    form.addEventListener('submit', onSubmit);
  }


  function loading() {
    const results = document.querySelector('.results');
    while (results.firstChild) {
      results.removeChild(results.firstChild);
    }
    const div = document.createElement('div');
    div.classList.add('loading');

    const bida = document.createElement('img');
    bida.setAttribute('src', 'loading.gif');
    console.log(bida);
    results.appendChild(div);
    div.appendChild(bida);


    const span = document.createElement('span');
    span.appendChild(document.createTextNode('Leita að léni...'));
    div.appendChild(span);
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const domains = document.querySelector('.domains');
  program.init(domains);
});
