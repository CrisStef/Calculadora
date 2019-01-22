class CalcController {

    /**
     * Método construtor da classe
     */
    constructor() {

        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
    }

    /**
     * Chamado ao inicializar a página
     */
    initialize() {
        
        this.setDisplayDateTime();
        
        //Executa o método setDisplayDateTime a cada segundo
        let interval = setInterval(()=>{

            this.setDisplayDateTime();
            
        }, 1000);

        this.setLastNumberToDisplay();
    }

    /**
     * Percorre um array de eventos e executa o evento encontrado
     * @param {*} element elemento que está sendo passado
     * @param {*} events lista de elementos
     * @param {*} fn função a ser executada
     */
    addEventListenerAll(element, events, fn) {

        events.split(' ').forEach(event => {

            element.addEventListener(event, fn, false);
        });

    }

    /**
     * Esvazia o array
     */
    clearAll() {
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();
    }

    /**
     * Remove o último elemento do array
     */
    clearEntry() {
        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    /**
     * Recupera a última operação inserida no array
     */
    getLastOperation() {
        return this._operation[this._operation.length-1];
    }

    /**
     * Insere na última posição do array um valor, sobrescrevendo o valor anterior
     * @param {*} value valor a ser adicionado no final do array
     */
    setLastOperation(value) {
        this._operation[this._operation.length-1] = value;
    }

    /**
     * Verifica se valor passado é um operador 
     * @param {*} value valor a ser verificado
     */
    isOperator(value) {
        return (['+', '-', '*', '/', '%'].indexOf(value) > -1);
    }

    /**
     * Adiciona no array o valor 
     * Verifica se o array tem 3 elementos, se tiver ele executa a função para calcular 
     * Ex: n1 + n2 
     * @param {*} value o valor a ser adicionado no array
     */
    pushOperation(value) {
        this._operation.push(value);

        if (this._operation.length > 3) {
            
            this.calc();
        }
    }

    /**
     * Retorna o resultado da operação
     */
    getResult() {
        return eval(this._operation.join("")); //eval realiza o calculo; join transforma o array em uma string
    }


    /**
     * Realiza o calculo
     */
    calc() {

        let last = '';

        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3) {

            let firtItem = this._operation[0];
            this._operation = [firtItem, this._lastOperator, this._lastNumber];
        }

        if (this._operation.length > 3) {

            let last = this._operation.pop(); //Remove do array o 4º elemento adicionado e o guarda para ser utilizado no próximo calculo
            this._lastNumber = this.getResult();

        } else if (this._operation.length == 3) {
            
            this._lastNumber = this.getLastItem(false);
        }

        let result = this.getResult(); 

        if (last == '%') {
            let porcento = this._operation[0] * this._operation[2] / 100;
            
            this.setLastOperation(porcento);
        } else {
            this._operation = [result]; // limpa o array inserindo o resultado do calculo, e o 4º elemento digitado
            if (last) this._operation.push(last);
        }

        this.setLastNumberToDisplay(); // atualiza os valores no display
    }

    getLastItem(isOperator = true) {

        let lastItem;

        for (let i = this._operation.length -1; i >= 0; i--) {
            
            if (this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i];
                break;

            }
        }

        if (!lastItem) {
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }
        return lastItem;
    }

    /**
     * Recupera o último número inserido no array e exibe no display
     */
    setLastNumberToDisplay() {

        let lastNumber = this.getLastItem(false);

        if (!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;
    }

    /**
     * Adiciona no array os valores
     * @param {*} value 
     */
    addOperation(value) {

        if (isNaN(this.getLastOperation())) { // isNan: função verifica se o valor não é um número

            //Caso o operador do calculo seja alterado executa o metodo que altera a ultima posição do array, substituindo o valor
            if (this.isOperator(value)) {
                this.setLastOperation(value);
                
            } else { // caso não seja um operador matematico, ele inclui o numero no array
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }
        } else {

            if (this.isOperator(value)) {
                this.pushOperation(value);

            } else {
                //Concatena os números inseridos 
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);

                this.setLastNumberToDisplay();
            }
        }
    }

    addDot() {

        let lastOperation = this.getLastOperation();

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if (this.isOperator(lastOperation) || !lastOperation) {
            this.pushOperation('0.');
        } else {
            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLastNumberToDisplay();
    }

    /**
     * Mensagem de erro
     */
    setError() {
        this.displayCalc = "Error";
    }

    /**
     * Verifica qual o valor capturado no evento e executa a função correspondente a ele
     * @param {*} value 
     */
    execBtn (value) {

        switch (value) {

            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
                this.addOperation('+');
                break;
            case 'subtracao':
                this.addOperation('-');
                break;
            case 'divisao':
                this.addOperation('/');
                break;
            case 'multiplicacao':
                this.addOperation('*');
                break;
            case 'porcento':
                this.addOperation('%');    
                break;
            case 'igual':
                this.calc();    
                break;
            case 'ponto':
                this.addDot();
                break;

            case '0':
            case '1':   
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;  

            default:
                this.setError();
                break;  
        }
    }

    /**
     * Inicializa os eventos dos botões
     */
    initButtonsEvents() {

        //seleciona todos os elementos das classes e id's passados no parametro
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        buttons.forEach((btn, index)=>{

            this.addEventListenerAll(btn, "click drag", e => {

                let textBtn = btn.className.baseVal.replace("btn-", "");
                this.execBtn(textBtn);

            });

            //modifica cursor do mouse 
            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {

                btn.style.cursor = "pointer";
            });
        });
    }

    /**
     * Mostra no display a data e a hora
     */
    setDisplayDateTime() {

        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    get displayCalc() {
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value) {
        this._displayCalcEl.innerHTML = value;
    }

    get displayTime() {
        return this._timeEl.innerHTML;
    }

    set displayTime(value) {
        this._timeEl.innerHTML = value;
    }

    get displayDate() {
        return this._dateEl.innerHTML;
    }

    set displayDate(value) {
        this._dateEl.innerHTML = value;
    }

    get currentDate() {
        return new Date();
    }

    set currentDate(value) {
        this.currentDate = valor;
    }
}