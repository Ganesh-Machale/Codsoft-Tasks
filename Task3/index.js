
  let currentVal = '0';
  let prevVal = '';
  let operator = '';
  let shouldResetScreen = false;
  let lastExpr = '';
  let lastResult = '';

  const resultEl   = document.getElementById('result');
  const exprEl     = document.getElementById('expression');
  const histLbl    = document.getElementById('history-label');
  const histVal    = document.getElementById('history-val');

  function updateDisplay(val, expr) {
    resultEl.textContent = val;
    resultEl.classList.toggle('long', val.length > 9);
    if (expr !== undefined) exprEl.textContent = expr;
  }

  function inputNum(n) {
    if (shouldResetScreen) {
      currentVal = n === '0' ? '0' : n;
      shouldResetScreen = false;
    } else {
      if (currentVal === '0' && n !== '.') currentVal = n;
      else if (currentVal.length < 15) currentVal += n;
    }
    updateDisplay(currentVal);
  }

  function inputDecimal() {
    if (shouldResetScreen) { currentVal = '0.'; shouldResetScreen = false; updateDisplay(currentVal); return; }
    if (!currentVal.includes('.')) { currentVal += '.'; updateDisplay(currentVal); }
  }

  function inputOp(op) {
    if (operator && !shouldResetScreen) calculate(true);
    prevVal = currentVal;
    operator = op;
    shouldResetScreen = true;
    updateDisplay(currentVal, `${prevVal} ${op}`);
  }

  function calculate(chaining = false) {
    if (!operator || !prevVal) return;
    const a = parseFloat(prevVal);
    const b = parseFloat(currentVal);
    let res;
    switch (operator) {
      case '+': res = a + b; break;
      case '−': res = a - b; break;
      case '×': res = a * b; break;
      case '÷': res = b === 0 ? 'Error' : a / b; break;
      default: return;
    }
    const expr = `${prevVal} ${operator} ${currentVal}`;
    const resStr = res === 'Error' ? 'Error' : parseFloat(res.toFixed(10)).toString();
    if (!chaining) {
      histLbl.textContent = expr + ' =';
      histVal.textContent = '';
      exprEl.textContent = expr + ' =';
    } else {
      exprEl.textContent = `${resStr} ${operator}`;
    }
    lastExpr = expr; lastResult = resStr;
    currentVal = resStr; prevVal = ''; operator = ''; shouldResetScreen = true;
    updateDisplay(resStr);
  }

  function clearAll() {
    currentVal = '0'; prevVal = ''; operator = ''; shouldResetScreen = false;
    updateDisplay('0', '');
    histLbl.textContent = ''; histVal.textContent = '';
  }

  function toggleSign() {
    if (currentVal === '0' || currentVal === 'Error') return;
    currentVal = currentVal.startsWith('-') ? currentVal.slice(1) : '-' + currentVal;
    updateDisplay(currentVal);
  }

  function percent() {
    if (currentVal === 'Error') return;
    currentVal = (parseFloat(currentVal) / 100).toString();
    updateDisplay(currentVal);
  }

  // Keyboard support
  document.addEventListener('keydown', e => {
    if (e.key >= '0' && e.key <= '9') inputNum(e.key);
    else if (e.key === '.') inputDecimal();
    else if (e.key === '+') inputOp('+');
    else if (e.key === '-') inputOp('−');
    else if (e.key === '*') inputOp('×');
    else if (e.key === '/') { e.preventDefault(); inputOp('÷'); }
    else if (e.key === 'Enter' || e.key === '=') calculate();
    else if (e.key === 'Backspace') {
      if (currentVal.length > 1) currentVal = currentVal.slice(0,-1);
      else currentVal = '0';
      updateDisplay(currentVal);
    }
    else if (e.key === 'Escape') clearAll();
    else if (e.key === '%') percent();
  });