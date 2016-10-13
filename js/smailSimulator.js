/**
 * Construtor de uma simulação
 */
function Simulation() {
    "use strict";
    this.simulationTime = 500;
    this.simulationSeed = 11;
    this.simulationSpeed = 5;
    
    // Volume de tráfego
    this.traffic = [0, 0, 0, 0];
    this.traffic[Direction.NUMBER.LL] = 50;
    this.traffic[Direction.NUMBER.LR] = 25;
    this.traffic[Direction.NUMBER.RL] = 15;
    this.traffic[Direction.NUMBER.RR] = 10;
    
    // Taxas de sucesso, falha e adiamento, respectivamente
    // Deve totalizar 100%
    this.trafficRate = [0, 0, 0, 0];
    this.trafficRate[Direction.NUMBER.LL] = [87.0, 0.5, 12.5];
    this.trafficRate[Direction.NUMBER.LR] = [96.0, 1.5,  2.5];
    this.trafficRate[Direction.NUMBER.RL] = [96.0, 3.0,  1.0];
    this.trafficRate[Direction.NUMBER.RR] = [96.0, 1.0,  9.0];
    
    // Tempo de recepção de acordo com a direção
    this.receptionTime = [0, 0, 0, 0];
    this.receptionTime[Direction.NUMBER.LL] = 0.12;
    this.receptionTime[Direction.NUMBER.LR] = 0.12;
    this.receptionTime[Direction.NUMBER.RL] = 0.14;
    this.receptionTime[Direction.NUMBER.RR] = 0.16;
    
    // Processamento das requisições
    this.serviceTime = {
        LL : [[Function.NUMBER.NORMAL, 0.55, 0.05, 0],
              [Function.NUMBER.TRIANGULAR, 0.02, 0.05, 0.12],
              [Function.NUMBER.UNIFORM, 0.06, 0.15, 0]],
        LR : [[Function.NUMBER.NORMAL, 0.65, 0.04, 0],
              [Function.NUMBER.UNIFORM, 0.16, 0.25, 0],
              [Function.NUMBER.TRIANGULAR, 0.05, 0.07, 0.10]],
        RL : [[Function.NUMBER.UNIFORM, 0.03, 0.11, 0],
              [Function.NUMBER.NORMAL, 0.46, 0.05, 0],
              [Function.NUMBER.NORMAL, 0.72, 0.09, 0]],
        RR : [[Function.NUMBER.UNIFORM, 0.09, 0.18, 0],
              [Function.NUMBER.TRIANGULAR, 0.08, 0.15, 0.22],
              [Function.NUMBER.NORMAL, 0.63, 0.04, 0]]
    };
}

/**
 * Construtor do simulador
 */
function Simulator() {
    "use strict";
    var self = this;
    
    this.simulationTimer = undefined;
    this.simulationTimeInterval = 500; // ms
    this.simulation = undefined;
    this.receptionCenter = new ReceptionCenter();
    this.localServiceCenter = new ServiceCenter(10);
    this.remoteServiceCenter = new ServiceCenter(20);
    this.simulationRunning = false;
    
    this.setSimulation = function(simulation) {
        this.simulation = simulation;  
    };
    
    this.runStep = function() { // Deve utilizar self para acessar o contexto por causa do timer
        self.simulationRunning = true;
        console.log("Passo executado!");
    };
    
    this.runSimulation = function() {
        if(this.simulationRunning)
            console.log("Simulação resumida!");
        else
            console.log("Simulação iniciada!");
        
        this.simulationTimer = setInterval(this.runStep, this.simulationTimeInterval);
    };
    
    this.pauseSimulation = function() {
        clearInterval(this.simulationTimer);
        console.log("Simulação pausada!");
    };
    
    this.stopSimulation = function() {
        this.simulationRunning = false;
        clearInterval(this.simulationTimer);
        console.log("Simulação parada!");
    };
}
