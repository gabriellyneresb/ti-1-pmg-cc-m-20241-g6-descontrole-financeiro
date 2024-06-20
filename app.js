let metas = {};

// Estrutura de dados JSON inicial
const initialData = `{
  "compras": [50, 100, 150],
  "viagem": [200, 300],
  "educacao": [80]
}`;

// Tenta analisar os dados JSON inicial e atribui a 'metas' se for válido
try {
  metas = JSON.parse(initialData);
} catch (error) {
  console.error('Erro ao analisar os dados JSON inicial:', error);
}

function addMeta() {
  const value = parseFloat(document.getElementById('new-meta-input').value.trim());
  const category = document.getElementById('category-select').value;

  if (!isNaN(value) && category) {
    metas[category] = metas[category] || [];
    metas[category].push(value);
    document.getElementById('new-meta-input').value = '';

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
      valueSpan.textContent = `Quero economizar ${meta.toFixed(2)} reais `;
        
      const valueInput = document.createElement('input');
      valueInput.type = 'number';
      valueInput.value = meta.toFixed(2);
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
          metas[category][index] = newValue;
          renderMetas();
        } else {
          alert('Valor inválido!');
        }
      };
  
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Excluir';
      deleteButton.onclick = function() {
        metas[category].splice(index, 1);
        renderMetas();
      };
  
      li.appendChild(valueSpan);
      li.appendChild(valueInput);
      li.appendChild(editButton);
      li.appendChild(saveButton);
      li.appendChild(deleteButton);
      ul.appendChild(li);
    });
  }
}

// Configura os botões
document.getElementById('btnCarregaDados').addEventListener('click', renderMetas);
document.getElementById('btnIncluirMeta').addEventListener('click', addMeta);
document.getElementById('btnCriarPasta').addEventListener('click', addCategory);
