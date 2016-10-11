/**
 * Construtor de uma simulação
 */
function Simulation() {
    "use strict";
    this.receptionCenter = new ReceptionCenter();
    this.localServiceCenter = new ServiceCenter(10);
    this.remoteServiceCenter = new ServiceCenter(20);
    this.simulationTime = 500;
    this.simulationSeed = 11;
    
    // Volume de tráfego
    this.traffic = [0, 0, 0, 0];
    this.traffic[Direction.LL] = 50;
    this.traffic[Direction.LR] = 25;
    this.traffic[Direction.RL] = 15;
    this.traffic[Direction.RR] = 5;
    
    // Taxas de sucesso, falha e adiamento, respectivamente
    // Deve totalizar 100%
    this.trafficRate = [0, 0, 0, 0];
    this.trafficRate[Direction.LL] = [87.0, 0.5, 12.5];
    this.trafficRate[Direction.LR] = [96.0, 1.5,  2.5];
    this.trafficRate[Direction.RL] = [96.0, 3.0,  1.0];
    this.trafficRate[Direction.RR] = [96.0, 1.0,  9.0];
    
    // Processamento das requisições
    this.processing = {
        LL : [[0.12, Function.NUMBER.NORMAL, 0.55, 0.05],
              [0.14, Function.NUMBER.TRIANGULAR, 0.02, 0.05, 0.12],
              [0.11, Function.NUMBER.UNIFORM, 0.06, 0.15]],
        LR : [[0.12, Function.NUMBER.NORMAL, 0.65, 0.04],
              [0.13, Function.NUMBER.UNIFORM, 0.16, 0.25],
              [0.15, Function.NUMBER.TRIANGULAR, 0.05, 0.07, 0.10]],
        RL : [[0.12, Function.NUMBER.UNIFORM, 0.03, 0.11],
              [0.14, Function.NUMBER.NORMAL, 0.46, 0.05],
              [0.11, Function.NUMBER.NORMAL, 0.72, 0.09]],
        RR : [[0.16, Function.NUMBER.UNIFORM, 0.09, 0.18],
              [0.13, Function.NUMBER.TRIANGULAR, 0.08, 0.15, 0.22],
              [0.16, Function.NUMBER.NORMAL, 0.63, 0.04]]
    };
}

/**
 * Construtor do simulador
 */
function Simulator() {
    "use strict";
    this.simulation = undefined;
    
    this.setSimulation = function(simulation) {
        this.simulation = simulation;  
    };
    this.runSimulation = function() {
        window.alert("Simulação iniciada!");
    };
    this.pauseSimulation = function() {
        window.alert("Simulação pausada!");        
    };
    this.stopSimulation = function() {
        window.alert("Simulação parada!");
    };
}
