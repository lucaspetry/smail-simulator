/**
 * Construtor de uma simulação
 */
function Simulation() {
    "use strict";
    this.receptionCenter = new ReceptionCenter();
    this.localServiceCenter = new ServiceCenter();
    this.remoteServiceCenter = new ServiceCenter();
    this.simulationTime = 0;
    this.simulationSeed = 11;
    
    // Volume de tráfego
    this.trafficLL = 50;
    this.trafficLR = 25;
    this.trafficRL = 15;
    this.trafficRR = 5;
    
    // Taxas de sucesso, falha e adiamento, respectivamente
    // Deve totalizar 100%
    this.trafficRateLL = [87.0, 0.5, 12.5];
    this.trafficRateLR = [96.0, 1.5,  2.5];
    this.trafficRateRL = [96.0, 3.0,  1.0];
    this.trafficRateRR = [96.0, 1.0,  9.0];
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
