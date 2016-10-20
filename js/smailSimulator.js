/*========================================
 * Requires:  enums.js
 *            operationCenter.js
 *=======================================*/

/**
 * Configurações da simulação
 */
function Simulation() {
    "use strict";
    // Parâmetros básicos de execução
    this.simulationTime = 50;
    this.simulationSeed = 11;
    this.simulationSpeed = 20;

    // Número de servidores nos centros de serviço
    this.localServiceCenterServers = 10;
    this.remoteServiceCenterServers = 20;

    // Volume de tráfego
    this.traffic = [0, 0, 0, 0];
    this.traffic[Direction.NUMBER.LL] = 66;
    this.traffic[Direction.NUMBER.LR] = 34;
    this.traffic[Direction.NUMBER.RL] = 65;
    this.traffic[Direction.NUMBER.RR] = 35;

    // Taxas de sucesso, falha e adiamento, respectivamente
    // Deve totalizar 100%
    this.trafficRate = [0, 0, 0, 0];
    this.trafficRate[Direction.NUMBER.LL] = [83.0, 5.0, 12.0];
    this.trafficRate[Direction.NUMBER.LR] = [96.0, 1.5,  2.5];
    this.trafficRate[Direction.NUMBER.RL] = [96.0, 3.0,  1.0];
    this.trafficRate[Direction.NUMBER.RR] = [82.0, 9.0,  9.0];

    // Tempo entre chegadas de mensagens
    this.arrivalIntervalLocal = [Function.NUMBER.EXPONENCIAL, 0.5, 0, 0];
    this.arrivalIntervalRemote = [Function.NUMBER.EXPONENCIAL, 0.6, 0, 0];

    // Tempo de recepção de acordo com a direção
    this.receptionTime = [0.12, 0.12, 0.14, 0.16];

    // Processamento das requisições
    this.serviceTime = {
        LL : [[Function.NUMBER.NORMAL, 0.55, 0.05, 0],
              [Function.NUMBER.TRIANGULAR, 0.02, 0.05, 0.12],
              [Function.NUMBER.UNIFORM, 0.06, 0.15, 0]],
        LR : [[Function.NUMBER.NORMAL, 0.65, 0.04, 0],
              [Function.NUMBER.EXPONENCIAL, 0.6, 0, 0],
              [Function.NUMBER.TRIANGULAR, 0.05, 0.07, 0.10]],
        RL : [[Function.NUMBER.UNIFORM, 0.03, 0.11, 0],
              [Function.NUMBER.EXPONENCIAL, 0.46, 0, 0],
              [Function.NUMBER.NORMAL, 0.72, 0.09, 0]],
        RR : [[Function.NUMBER.UNIFORM, 0.09, 0.45, 0],
              [Function.NUMBER.TRIANGULAR, 0.08, 0.15, 0.22],
              [Function.NUMBER.NORMAL, 0.63, 0.04, 0]]
    };
}

/**
 * Estatísticas da simulação
 */
function Statistics() {
    // Parâmetros básicos de execução
    this.simulationTime = 0;

    // Número de servidores nos centros de serviço
    this.localServiceCenterServers = 0;
    this.remoteServiceCenterServers = 0;
    
    // Número de sucessos, falhas e adiamentos por direção de tráfego    
    this.trafficRate = [0, 0, 0, 0];
    this.trafficRate[Direction.NUMBER.LL] = [0, 0, 0];
    this.trafficRate[Direction.NUMBER.LR] = [0, 0, 0];
    this.trafficRate[Direction.NUMBER.RL] = [0, 0, 0];
    this.trafficRate[Direction.NUMBER.RR] = [0, 0, 0];
    
    this.queuedMessagesReception = 0;
    this.queuedMessagesServiceCenter = [0, 0];
    this.queuedMessagesServiceCenter = [0, 0];
    
    /**
     * Atualizar as estatísticas da simulação
     * @param timeExecuted tempo executado desde o último evento e 
     * @param event último evento executado
     * @param simulator simulador
     * @return
     */
    this.updateStatistics = function(timeExecuted, event) {
        // Se é evento de saída gera estatísticas
        if(event instanceof OutServiceCenterEvent) {
            // Pega a mensagem e gera as estatísticas
            var email = event.email;
            this.trafficRate[email.direction][email.status]++;
        }
    };
    
    this.updateFinalStatistics = function(simulator) {        
        // Atualiza as estatísticas gerais
        this.simulationTime = simulator.simulation.simulationTime;
        this.localServiceCenterServers = simulator.simulation.localServiceCenterServers;
        this.remoteServiceCenterServers = simulator.simulation.remoteServiceCenterServers;
    };
    
    this.numberToString = function(number, size) {
        var str = new String(roundNumber(number, 3));
        var pad = "";
        
        for(i = 0; i < size; i++)
            pad += " ";
        
        return (pad + str).slice(str.length);
    }
    
    this.getSimulationReport = function(simulator) {
        this.updateFinalStatistics(simulator);
        
        var report =
            "==============================================================================================\n" +
            "                                    Relatório da Simulação                                    \n" +
            "==============================================================================================\n" +
            "\n" +
            "Parâmetros da simulação\n" +
            "----------------------------------------------------------------------------------------------\n" +
            "Tempo de simulação:           " + this.numberToString(this.simulationTime, 8) +
            "                Núm. Servidores Dest. Local:  " + this.numberToString(this.localServiceCenterServers, 8) + "\n" +
            "Semente de aleatoriedade:     XXXXXXXX                Núm. Servidores Dest. Remoto: " +
            this.numberToString(this.remoteServiceCenterServers, 8) + "\n" +
            "\n" +
            "Resultados da simulação\n" +
            "----------------------------------------------------------------------------------------------\n" +
            "                                                         Média        Mínimo        Máximo\n" +
            "Número de mensagens no sistema                          XXXXXX        XXXXXX        XXXXXX\n" +
            "Tempo de trânsito das mensagens no sistema              XXXXXX        XXXXXX        XXXXXX\n" +
            "\n" +
            "Mensagens despachadas                                                                     \n" +
            "Total                                                   XXXXXX        XXXXXX        XXXXXX\n" +
            "Mensagens despachadas LOCAL -> LOCAL                    XXXXXX        XXXXXX        XXXXXX\n" +
            "Mensagens despachadas LOCAL -> REMOTO                   XXXXXX        XXXXXX        XXXXXX\n" +
            "Mensagens despachadas REMOTO -> LOCAL                   XXXXXX        XXXXXX        XXXXXX\n" +
            "Mensagens despachadas REMOTO -> REMOTO                  XXXXXX        XXXXXX        XXXXXX\n" +
            "Total de mensagens no sistema no fim da simulação       XXXXXX        XXXXXX        XXXXXX\n" +
            "\n" +
            "Taxa de ocupação dos centros de serviço                                                   \n" +
            "Destino Local                                           XXXXXX        XXXXXX        XXXXXX\n" +
            "Destino Remoto                                          XXXXXX        XXXXXX        XXXXXX\n";

        return report;
    }

}

/**
 * Evento de chegada de mensagem no centro de recepção
 */
function ArrivalReceptionCenterEvent(nextEventsList, currentTime, origin, simulator) {
    this.name = "Chegada no Centro de Recepção (" + Message.INDEX[origin] + ")";
    this.nextEventsList = nextEventsList;
    this.origin = origin;

    this.receptionCenter = simulator.receptionCenter;
    this.serviceCenterLocal = simulator.serviceCenterLocal;
    this.serviceCenterRemote = simulator.serviceCenterRemote;
    this.probabilityGenerator = simulator.probabilityGenerator;
    this.email = new Email();
    this.email.origin = this.origin;

    this.time = currentTime + this.probabilityGenerator.getTimeToNextArrival(this.origin);

    this.execute = function() {
        // Gera a próxima chegada dependendo do tipo desse evento
        if(this.origin == Message.NUMBER.LOCAL) {
            this.nextEventsList.push(
                new ArrivalReceptionCenterEvent(this.nextEventsList, this.time, Message.NUMBER.LOCAL, simulator));
        } else {
            this.nextEventsList.push(
                new ArrivalReceptionCenterEvent(this.nextEventsList, this.time, Message.NUMBER.REMOTE, simulator));
        }

        // Se o centro de recepção está ocupado, aguarda na fila
        // Caso contrário, gera evento de saída do centro de recepção
        if(this.receptionCenter.isBusy()) {
            this.receptionCenter.pushToWaitQueue(this);
        } else {
            this.receptionCenter.currentEvent = this;
            this.nextEventsList.push(new OutReceptionCenterEvent(this.nextEventsList, this.time, 0, simulator, origin, this.email));
        }
    };
}

/**
 * Evento de saída de mensagem do centro de recepção
 */
function OutReceptionCenterEvent(nextEventsList, currentTime, queueTime, simulator, origin, email) {
    this.name = "Saída do Centro de Recepção";
    this.nextEventsList = nextEventsList;
    this.direction = simulator.probabilityGenerator.getDirection(origin);
    this.time = currentTime + queueTime + simulator.probabilityGenerator.getReceptionTime(this.direction);
    this.receptionCenter = simulator.receptionCenter;
    this.serviceCenterLocal = simulator.serviceCenterLocal;
    this.serviceCenterRemote = simulator.serviceCenterRemote;
    this.email = email;
    this.email.direction = this.direction;
    this.email.timeInSystem += this.time - currentTime;

    this.execute = function(){
        this.receptionCenter.currentEvent = undefined;
        var serviceCenter = this.serviceCenterLocal;
        
        if(Direction.DESTINATION[Direction.INDEX[this.direction]] == Message.NUMBER.REMOTE)
            serviceCenter = this.serviceCenterRemote;
        
        this.nextEventsList.push(new ArrivalServiceCenterEvent(this.nextEventsList, this.time, serviceCenter, simulator, this.email));
        if(this.receptionCenter.waitQueue.length > 0) {
            var queueEvent = this.receptionCenter.waitQueue.shift(); 
            queueTime = this.time - queueEvent.time;
            this.nextEventsList.push(new OutReceptionCenterEvent(this.nextEventsList, this.time, queueTime, simulator, origin, this.email));
        }
    };
}

/**
 * Evento de chegada de mensagem no centro de serviço
 */
function ArrivalServiceCenterEvent(nextEventsList, time, serviceCenter, simulator, email) {
    this.name = "Chegada no Centro de Serviço";
    this.nextEventsList = nextEventsList;
    this.time = time;
    this.serviceCenter = serviceCenter;
    this.simulator = simulator;
    this.email = email;
    
    this.execute = function() {
        if(this.serviceCenter.availableServers > 0) {
            this.serviceCenter.availableServers--;
            this.nextEventsList.push(new OutServiceCenterEvent(this.nextEventsList, this.time, 0, this.serviceCenter, this.simulator, this.email));
        } else {
            this.serviceCenter.waitQueue.push(this);
        }
    };
}

/**
 * Evento de saída de mensagem do centro de serviço
 */
function OutServiceCenterEvent(nextEventsList, currentTime, queueTime, serviceCenter, simulator, email) {
    this.name = "Saída do Centro de Serviço";
    this.nextEventsList = nextEventsList;
    this.simulator = simulator;
    this.status = this.simulator.probabilityGenerator.getStatus(email.direction);
    this.time = currentTime + queueTime + this.simulator.probabilityGenerator.getServiceTime(email.direction, this.status);
    this.serviceCenter = serviceCenter;
    this.email = email;
    this.email.status = this.status;
    this.email.timeInSystem += this.time - currentTime;

    this.execute = function() {
        if(this.status == Status.NUMBER.POSTPONE) {
            this.nextEventsList.push(new ArrivalServiceCenterEvent(this.nextEventsList, this.time, this.serviceCenter, this.simulator, this.email));
            this.email.postponements++;
        }
    
        this.serviceCenter.availableServers++;
        
        if(this.serviceCenter.waitQueue.length > 0) {
            var queueEvent = this.serviceCenter.waitQueue.shift();
            queueTime = this.time - queueEvent.time;
            this.nextEventsList.push(new OutServiceCenterEvent(this.nextEventsList, this.time, queueTime, this.serviceCenter, this.simulator, this.email));
        }
    };
}

/**
 * Evento de início de simulação
 */
function StartOfSimulationEvent(nextEventsList, time, simulator) {
    this.name = "Início da Simulação";
    this.nextEventsList = nextEventsList;
    this.time = time;

    this.execute = function() {
        // Cria os primeiros eventos de origem local e remota
        this.nextEventsList.push(
            new ArrivalReceptionCenterEvent(this.nextEventsList, this.time, Message.NUMBER.LOCAL, simulator));
        this.nextEventsList.push(
            new ArrivalReceptionCenterEvent(this.nextEventsList, this.time, Message.NUMBER.REMOTE, simulator));
    };
}

/**
 * Evento de fim de simulação
 */
function EndOfSimulationEvent(time) {
    this.name = "Fim da Simulação";
    this.time = time;
    this.execute = function() { };
}

/**
 * Simulador
 */
function Simulator() {
    "use strict";

    this.simulation = new Simulation(); // Simulação padrão
    this.probabilityGenerator = new ProbabilityGenerator();
    this.simulationTimer = undefined; // Temporizador de execução
    this.simulationCurrentTime = 0; // Momento atual da simulação
    this.simulationTimeInterval = undefined; // Intervalo de execução/atualização da interface

    this.receptionCenter = undefined // Centro de recepção
    this.serviceCenterLocal = undefined // Centro de serviço local
    this.serviceCenterRemote = undefined // Centro de serviço remoto

    this.simulationInProgress = false; // Simulação em progresso ou parada/terminada
    this.simulationRunning = false; // Simulação executando no momento ou pausada

    this.nextEventsList = undefined; // Lista de próximos eventos
    this.nextEvent = undefined; // Próximo evento a ser executado
    this.statistics = new Statistics(); // Estatísticas da simulação


    /**
     * Executar um passo da simulação
     */
    this.runStep = function() { // Deve utilizar self para acessar o contexto por causa do timer
        if(!this.simulationInProgress) {
            setSimulationStatus("Simulação iniciada.");
            this.initializeSimulation();
        } else if(!this.simulationRunning) {
            setSimulationStatus("Passo a passo.");            
        }

        this.simulationInProgress = true;

        // Se simulação não terminou, consome próximo evento
        if(!(this.nextEvent instanceof EndOfSimulationEvent)) {
            var currentTime = this.simulationTime;
            this.advanceToNextEvent();
            this.nextEvent.execute();
            
            // Atualiza as estatísticas
            this.statistics.updateStatistics(this.nextEvent.time - currentTime, this.nextEvent);
            
            // Atualiza a interface
            updateInterface();
        } else { // Senão, para simulação/gera estatísticas
            stopSimulation();
        }
    };

    /**
     * Executar (iniciar/resumir) a simulação
     */
    this.runSimulation = function() {
        var self = this; // Necessário para uso do temporizador
        
        // Inicializa a simulação se uma simulação ainda não estava em progresso
        if(this.simulationInProgress) {
            setSimulationStatus("Simulação resumida.");
        }
        
        function step() {
            self.runStep();
            
            if(self.simulationInProgress)
                self.runSimulation();
        }
        
        // Define a execução cíclica dos passos da simulação
        this.simulationRunning = true;
        this.simulationTimer = setTimeout(function() { step(); }, self.simulationTimeInterval);

        //this.simulationTimer = setInterval(self.runStep, 5000);
    };

    /**
     * Pausar a simulação
     */
    this.pauseSimulation = function() {
        setSimulationStatus("Simulação pausada.");
        clearTimeout(this.simulationTimer);
        this.simulationRunning = false;
    };

    /**
     * Parar a simulação e calcular as estatísticas finais
     */
    this.stopSimulation = function() {
        setSimulationStatus("Simulação parada.");

        // Para a simulação
        this.simulationRunning = false;
        this.simulationInProgress = false;
        clearTimeout(this.simulationTimer);

        // Computa as estatísticas até o momento
        // TODO Acredito que isso não será necessário!
        this.computeFinalStatistics();
        
        // Atualiza a interface
        updateInterface();
    };

    /**
     * Inicializar a simulação (configurações, eventos iniciais)
     */
    this.initializeSimulation = function() {
        // Inicializa centros de recepção e serviço
        this.receptionCenter = new ReceptionCenter();
        this.serviceCenterLocal = new ServiceCenter(this.simulation.localServiceCenterServers);
        this.serviceCenterRemote = new ServiceCenter(this.simulation.remoteServiceCenterServers);

        // Inicializa o gerador de probabilidades
        this.initializeProbabilityGenerator();

        // Inicializa parâmetros de tempo de execução
        this.simulationTimeInterval = 2500/this.simulation.simulationSpeed;
        this.simulationCurrentTime = 0;

        this.statistics = new Statistics();

        // Inicializa a lista de próximos eventos com eventos iniciais
        this.nextEventsList = new SortedArray([], null, function (a, b) {
            return a.time - b.time;
        });
        this.nextEvent = new StartOfSimulationEvent(this.nextEventsList, this.simulationCurrentTime, this);
        this.nextEventsList.push(this.nextEvent);
        this.nextEventsList.push(new EndOfSimulationEvent(this.simulation.simulationTime));
        
        updateInterface();
    };

    /**
     * Avançar a simulação para o próximo evento
     */
    this.advanceToNextEvent = function() {
        this.nextEvent = this.nextEventsList.shift();
        this.simulationCurrentTime = this.nextEvent.time;
    };

    /**
     * Calcular as estatísticas finais
     */
    this.computeFinalStatistics = function() {

    };

    this.initializeProbabilityGenerator = function() {
        this.probabilityGenerator.trafficVolume = this.simulation.traffic;
        this.probabilityGenerator.trafficRate = this.simulation.trafficRate;
        this.probabilityGenerator.arrivalIntervalLocal = this.simulation.arrivalIntervalLocal;
        this.probabilityGenerator.arrivalIntervalRemote = this.simulation.arrivalIntervalRemote;
        this.probabilityGenerator.receptionTimes = this.simulation.receptionTime;
        this.probabilityGenerator.serviceTimeFunctions = this.simulation.serviceTime;
    };

}

function Email() {
    this.origin;
    this.destination;
    this.status;
    this.timeInSystem = 0;
    this.postponements = 0;
}