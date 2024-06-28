let metas = {};
const localStorageKey = 'metas';

function loadMetasFromLocalStorage() {
  const storedData = localStorage.getItem(localStorageKey);
  if (storedData) {
    try {
      metas = JSON.parse(storedData);
    } catch (error) {
      console.error('Erro ao analisar os dados do localStorage:', error);
      metas = {};
    }
  }
}

function saveMetasToLocalStorage() {
  localStorage.setItem(localStorageKey, JSON.stringify(metas));
}

function addMeta() {
  const value = parseFloat(document.getElementById('new-meta-input').value.trim());
  const category = document.getElementById('category-select').value;
  if (!isNaN(value) && category) {
    metas[category] = metas[category] || [];
    metas[category].push({ value, completed: false });
    document.getElementById('new-meta-input').value = '';
    saveMetasToLocalStorage();
    renderMetas();
  } else {
    alert('Valor inválido ou pasta não selecionada!');
  }
}

function addCategory() {
  const categoryName = document.getElementById('new-category-input').value.trim();
  if (categoryName && !metas[categoryName]) {
    metas[categoryName] = [];
    document.getElementById('new-category-input').value = '';
    saveMetasToLocalStorage();
    updateCategorySelect();
  } else {
    alert('Nome de pasta inválido ou já existente!');
  }
}

function updateCategorySelect() {
  const select = document.getElementById('category-select');
  select.innerHTML = '';
  for (const category in metas) {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  }
  renderMetas();
}

function renderMetas() {
  const ul = document.getElementById('meta-ul');
  ul.innerHTML = '';
  const category = document.getElementById('category-select').value;
  if (category && metas[category]) {
    metas[category].forEach((meta, index) => {
      const li = document.createElement('li');
      li.classList.add('meta-item');
      const valueSpan = document.createElement('span');
      valueSpan.textContent = `Quero economizar ${meta.value.toFixed(2)} reais `;
      const valueInput = document.createElement('input');
      valueInput.type = 'number';
      valueInput.value = meta.value.toFixed(2);
      valueInput.style.display = 'none';
      const editButton = document.createElement('button');
      editButton.textContent = 'Editar';
      editButton.onclick = function() {
        valueSpan.style.display = 'none';
        valueInput.style.display = 'inline';
        saveButton.style.display = 'inline';
        editButton.style.display = 'none';
      };
      const saveButton = document.createElement('button');
      saveButton.textContent = 'Salvar';
      saveButton.style.display = 'none';
      saveButton.onclick = function() {
        const newValue = parseFloat(valueInput.value.trim());
        if (!isNaN(newValue)) {
          metas[category][index].value = newValue;
          saveMetasToLocalStorage();
          renderMetas();
        } else {
          alert('Valor inválido!');
        }
      };
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Excluir';
      deleteButton.onclick = function() {
        metas[category].splice(index, 1);
        saveMetasToLocalStorage();
        renderMetas();
      };
      const completedCheckbox = document.createElement('input');
      completedCheckbox.type = 'checkbox';
      completedCheckbox.checked = meta.completed;
      completedCheckbox.onchange = function() {
        metas[category][index].completed = completedCheckbox.checked;
        saveMetasToLocalStorage();
        if (completedCheckbox.checked) {
          launchConfetti();
        }
      };
      li.appendChild(completedCheckbox);
      li.appendChild(valueSpan);
      li.appendChild(valueInput);
      li.appendChild(editButton);
      li.appendChild(saveButton);
      li.appendChild(deleteButton);
      ul.appendChild(li);
    });
  }
}

function launchConfetti() {
  const confettiCanvas = document.getElementById('confetti-canvas');
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  const confettiContext = confettiCanvas.getContext('2d');
  const confettiColors = ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b', '#577590'];
  let confettiParticles = [];
  for (let i = 0; i < 100; i++) {
    confettiParticles.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      size: Math.random() * 10 + 5,
      speed: Math.random() * 5 + 2
    });
  }
  let animationFrame;
  function drawConfetti() {
    confettiContext.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiParticles.forEach(p => {
      confettiContext.beginPath();
      confettiContext.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      confettiContext.fillStyle = p.color;
      confettiContext.fill();
      p.y += p.speed;
      if (p.y > confettiCanvas.height) {
        p.y = 0 - p.size;
      }
    });
    animationFrame = requestAnimationFrame(drawConfetti);
  }
  drawConfetti();
  setTimeout(() => {
    cancelAnimationFrame(animationFrame);
    confettiContext.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }, 3000);
}

document.getElementById('btnCarregaDados').addEventListener('click', renderMetas);
document.getElementById('btnIncluirMeta').addEventListener('click', addMeta);
document.getElementById('btnCriarPasta').addEventListener('click', addCategory);
loadMetasFromLocalStorage();
updateCategorySelect();
