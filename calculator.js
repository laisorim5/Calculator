document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    
    const display = document.getElementById('display');
    const gridItems = document.querySelectorAll('.grid-item');
    const onOffButton = document.getElementById('on-off-button');

    let currentInput = ''; // Variável para armazenar o input atual
    let currentOperation = ''; // Variável para armazenar a operação atual
    let firstOperand = null; // Primeiro operando da operação
    let awaitingSecondOperand = false; // Indica se estamos aguardando o segundo operando

    // Adiciona event listener para cada botão da calculadora
    gridItems.forEach(item => {
        item.addEventListener('click', function() {
            const value = item.textContent.trim(); // Obtém o texto do botão clicado

            // Lógica para lidar com números e operações
            if (!isNaN(value) || value === '.') { // Verifica se é um número ou ponto decimal
                handleNumber(value);
            } else { // É uma operação
                handleOperation(value);
            }
        });
    });

    // Event listener para o botão ON/OFF
    onOffButton.addEventListener('click', function() {
        clearCalculator();
    });

    // Função para limpar a calculadora (ligar/desligar)
    function clearCalculator() {
        currentInput = '';
        currentOperation = '';
        firstOperand = null;
        awaitingSecondOperand = false;
        display.textContent = '0';
    }

    // Função para lidar com a inserção de números no display
    function handleNumber(number) {
        if (currentOperation === '=' && !awaitingSecondOperand) {
            // Limpa o display após uma operação de '='
            clearCalculator();
        }

        // Adiciona o número ou ponto decimal ao input atual
        currentInput += number;
        display.textContent = currentInput;
        awaitingSecondOperand = false;
    }

    // Função para lidar com a seleção de operações
    function handleOperation(operation) {
        if (currentInput === '' && operation !== '-') {
            // Evita operadores no início sem um número antes, exceto para o operador de subtração inicial
            return;
        }

        if (firstOperand === null) {
            // Se ainda não há primeiro operando definido, definir o atual como primeiro
            firstOperand = parseFloat(currentInput);
        } else if (currentOperation && !awaitingSecondOperand) {
            // Se já há um operando e não estamos aguardando o segundo, calcular imediatamente
            const secondOperand = parseFloat(currentInput);
            const result = performCalculation(currentOperation, firstOperand, secondOperand);
            display.textContent = result;
            firstOperand = result; // Atualiza o primeiro operando com o resultado atual
        }

        // Atualiza a operação atual e indica que estamos aguardando o segundo operando
        currentOperation = operation;
        awaitingSecondOperand = true;

        // Limpa o input atual para o próximo número
        currentInput = '';
    }

    // Função para lidar com o operador de igualdade (=)
    function handleEquals() {
        if (currentOperation && firstOperand !== null) {
            const secondOperand = parseFloat(currentInput);
            const result = performCalculation(currentOperation, firstOperand, secondOperand);
            display.textContent = result;
            firstOperand = null; // Reseta o primeiro operando após o cálculo
            currentOperation = ''; // Reseta a operação atual
            awaitingSecondOperand = false; // Reseta a flag de aguardo do segundo operando
        }
    }

    // Função para realizar o cálculo com base no operador selecionado
    function performCalculation(operation, operand1, operand2) {
        switch (operation) {
            case '+':
                return operand1 + operand2;
            case '-':
                return operand1 - operand2;
            case '*':
                return operand1 * operand2;
            case '/':
                if (operand2 === 0) {
                    alert("Divisão por zero não é permitida.");
                    return 0; // Retorna um valor padrão em caso de divisão por zero
                } else {
                    return operand1 / operand2;
                }
            default:
                return 0;
        }
    }
});
