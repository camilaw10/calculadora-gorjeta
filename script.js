
// Geração aleatória do código de barras

const barcode = document.getElementById('barcode');
for(let i=0;i<28;i++){
  const bar = document.createElement('span');
  const w = Math.random() < 0.3 ? 4 : 2;
  bar.style.setProperty('--w', w+'px');
  bar.style.height = (Math.random() < 0.5 ? '100%' : '70%');
  barcode.appendChild(bar);
}

// CABEÇALHO: Data e hora em tempo real no recibo

const now = new Date();
const pad = n => String(n).padStart(2,'0');
document.getElementById('datetime').textContent =
  `${pad(now.getDate())}/${pad(now.getMonth()+1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

// SELEÇÃO DE ELEMENTOS DO DOM

const billInput = document.getElementById('bill');
const tipRange = document.getElementById('tipRange');
const tipValue = document.getElementById('tipValue');
const presetButtons = document.querySelectorAll('.tip-presets button');
const minusBtn = document.getElementById('minus');
const plusBtn = document.getElementById('plus');
const peopleCountEl = document.getElementById('peopleCount');

const subtotalEl = document.getElementById('subtotal');
const tipAmountEl = document.getElementById('tipAmount');
const totalEl = document.getElementById('total');
const perPersonEl = document.getElementById('perPerson');
const stamp = document.getElementById('stamp');

// Estados iniciais da aplicação
let people = 1;
let currentTip = 15;

// Limpa a string digitada e converte para número decimal
function parseBill(){
  const raw = billInput.value.replace(/\./g,'').replace(',', '.').replace(/[^0-9.]/g,'');
  const val = parseFloat(raw);
  return isNaN(val) ? 0 : val;
}

// Formata valores numéricos para o padrão de moeda brasileira (R$)
function formatMoney(n){
  return 'R$ ' + n.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2});
}

// Controla a visibilidade do carimbo visual dependendo da porcentagem da gorjeta
function updateStampVisibility(tipPct){
  stamp.style.opacity = tipPct >= 18 ? '0.9' : '0';
}

// Executa todos os cálculos matemáticos e atualiza a interface
function recalc(){
  const bill = parseBill();
  const tipAmt = bill * (currentTip/100);
  const total = bill + tipAmt;
  const per = total / people;

  subtotalEl.textContent = formatMoney(bill);
  tipAmountEl.textContent = formatMoney(tipAmt);
  totalEl.textContent = formatMoney(total);

  // Efeito visual de pulso no valor por pessoa
  perPersonEl.classList.add('pulse');
  perPersonEl.textContent = formatMoney(per);
  setTimeout(()=>perPersonEl.classList.remove('pulse'), 180);

  updateStampVisibility(currentTip);
}

// Atualiza os cálculos conforme o usuário digita o valor da conta
billInput.addEventListener('input', recalc);

// Formata bonitinho com 2 casas decimais quando o campo perde o foco
billInput.addEventListener('blur', () => {
  const val = parseBill();
  billInput.value = val.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2});
  recalc();
});

// Botões predefinidos de porcentagem (10%, 15%, 20%)
presetButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    presetButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTip = parseInt(btn.dataset.tip, 10);
    tipRange.value = currentTip;
    tipValue.textContent = currentTip + '%';
    recalc();
  });
});

// Slider (barra deslizante) de gorjeta personalizada
tipRange.addEventListener('input', () => {
  currentTip = parseInt(tipRange.value, 10);
  tipValue.textContent = currentTip + '%';
  presetButtons.forEach(b => {
    b.classList.toggle('active', parseInt(b.dataset.tip,10) === currentTip);
  });
  recalc();
});

// Botões de diminuir e aumentar a quantidade de pessoas para divisão
minusBtn.addEventListener('click', () => {
  if(people > 1){ people--; peopleCountEl.textContent = people; recalc(); }
});
plusBtn.addEventListener('click', () => {
  if(people < 30){ people++; peopleCountEl.textContent = people; recalc(); }
});

// Inicializa a aplicação com os valores padrão
recalc();