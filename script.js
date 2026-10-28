const display = document.getElementById('display');
const historyDisplay = document.getElementById('history');
const themeToggle = document.getElementById('theme-toggle');
const buttonsContainer = document.querySelector('.buttons');

const operators = ['+', '-', '*', '/'];

buttonsContainer.addEventListener('click', (event) => {
    const button = event.target;
    
    if (!button.matches('button')) return;
    const action = button.dataset.action;
    const value = button.textContent;

    switch (action) {
        case 'clear':
            clearAll();
            break;
        case 'delete':
            deleteLast();
            break;
        case 'percentage':
                applyPercentage();
                break;
        case 'equals':
            calculate();
            break;
        default:
                appendValue(value);
                break;
    }
})
function clearAll() {
    display.value = '';
    historyDisplay.textContent = '';
}
function deleteLast() {
    if(display.value === 'Error'){
        clearAll();
        return;
    }
    display.value = display.value.slice(0, -1);
}
function appendValue(value) {

    if (value === '\u00D7') value = '*';
    if (value === '\u00F7') value = '/';

    if (display.value === 'Error') {
        clearAll();
    }const lastChar = display.value.slice(-1);
    if (display.value === '' && operators.includes(value) && value !== '-') {
        return;
    }
    if (operators.includes(value) && operators.includes(lastChar)) {
        display.value = display.value.slice(0, -1) + value;
        return;
    }

   if (value === '.') {
    const parts = display.value.split(/[\+\-\*\/]/);
    const currentNumber = parts[parts.length - 1];

    if (currentNumber.includes('.')) {
        return;
    }
    if (currentNumber === '') {
        display.value += '0';
    }
   }
    display.value += value;
}
function applyPercentage() {
    if (display.value === '' || display.value === 'Error') return;

    const parts = display.value.split(/([\+\-\*\/])/);
    const lastNumber = parseFloat(parts[parts.length - 1]);

    if (isNaN(lastNumber)) return;
    parts[parts.length - 1] = lastNumber / 100;
    display.value = parts.join('');
}
function calculate(){
    if (display.value === '') return;
    const expression = display.value;
    try{
    const result = new Function (`'use strict'; return (${expression})`)();

    if (!Number.isFinite(result)) {
        throw new Error('Invalid calculation');
    }
    const cleanResult = parseFloat(result.toFixed(10));

    historyDisplay.textContent = `${expression} =`;
    display.value = cleanResult;
    }
    catch (error){
        display.value = 'Error';
    }
}
document.addEventListener('keydown', (event) => {
    const key = event.key;

    if (/^[0-9]$/.test(key) || key === '.' || operators.includes(key)){
        event.preventDefault();
        appendValue(key);
        return;
    }
    if (key === 'Enter' || key === '='){
        event.preventDefault();
        calculate();
        return;
    }
    if (key === 'Backspace'){
        event.preventDefault();
        deleteLast();
        return;
    }
    if(key === 'Escape'){
        event.preventDefault();
        clearAll();
        return;
    }
    if (key === '%'){
        event.preventDefault();
        applyPercentage();
        return;
    }
})
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');

    if(document.body.classList.contains('light')){
        themeToggle.textContent = '☀️';
    } else {
        themeToggle.textContent = '🌙';
    }
});