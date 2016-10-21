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
    this.simulationTime = 30;
    this.simulationSeed = 11;
    this.simulationSpeed = 50;

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
    this.arrivalIntervalLocal = [Function.NUMBER.EXPONENCIAL, 0.3, 0, 0];
    this.arrivalIntervalRemote = [Function.NUMBER.EXPONENCIAL, 0.6, 0, 0];

    // Tempo de recepção de acordo com a direção
    this.receptionTime = [0.12, 0.12, 0.14, 0.16];

    // Processamento das requisições
    this.serviceTime = {
        LL : [[Function.NUMBER.NORMAL, 0.55, 0.05, 0],
              [Function.NUMBER.TRIANGULAR, 0.02, 0.05, 0.12],
              [Function.NUMBER.CONSTANT, 0.3, 0, 0]],
        LR : [[Function.NUMBER.NORMAL, 0.65, 0.04, 0],
              [Function.NUMBER.EXPONENCIAL, 0.6, 0, 0],
              [Function.NUMBER.TRIANGULAR, 0.05, 0.07, 0.10]],
        RL : [[Function.NUMBER.UNIFORM, 0.03, 0.11, 0],
              [Function.NUMBER.EXPONENCIAL, 0.46, 0, 0],
              [Function.NUMBER.CONSTANT, 0.72, 0, 0]],
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
    this.trafficRate[Direction.NUMBER.LL] = [0, 0, 0, 0]; // Last index = total
    this.trafficRate[Direction.NUMBER.LR] = [0, 0, 0, 0];
    this.trafficRate[Direction.NUMBER.RL] = [0, 0, 0, 0];
    this.trafficRate[Direction.NUMBER.RR] = [0, 0, 0, 0];

    this.totalDispatchedMessages = 0;
                               /*      Mínimo,        Médio,          Máximo*/
    this.messagesSystemTime = [Number.MAX_SAFE_INTEGER, 0, Number.MIN_SAFE_INTEGER];
    
                                  /*      Mínimo,        Médio,          Máximo*/
    this.totalMessagesInSystem = [0, 0, Number.MIN_SAFE_INTEGER];
    this.totalMessagesInSystemEnd = 0;
    
                                      /*      Mínimo,        Médio,          Máximo*/
    this.occupationRateLocalCenter = [0, 0, Number.MIN_SAFE_INTEGER];
                                       /*      Mínimo,        Médio,          Máximo*/
    this.occupationRateRemoteCenter = [0, 0, Number.MIN_SAFE_INTEGER];
    
    /**
     * Atualizar as estatísticas da simulação
     * @param timeExecuted tempo executado desde o último evento e 
     * @param event último evento executado
     * @param simulator simulador
     * @return
     */
    this.updateStatistics = function(timeExecuted, event, simulator) {
        // Se é evento de saída gera estatísticas
        if(event instanceof OutServiceCenterEvent) {
            // Pega a mensagem e gera as estatísticas
            var email = event.email;
            // Total por direção e status
            this.trafficRate[email.direction][email.status]++;
            // Total por direção
            this.trafficRate[email.direction][3]++;
            // Total de mensagens despachadas
            this.totalDispatchedMessages++;
            
            // Média de tempo no sistema
            this.messagesSystemTime[1] += email.timeInSystem;
            // Menor tempo no sistema
            if(email.timeInSystem < this.messagesSystemTime[0])
                this.messagesSystemTime[0] = email.timeInSystem;
            // Maior tempo no sistema
            if(email.timeInSystem > this.messagesSystemTime[1])
                this.messagesSystemTime[1] = email.timeInSystem;
        }
        
        // Atualiza mensagens no sistema
        var msgsNow = simulator.numberOfMessagesInSystem();
        this.totalMessagesInSystem[1] += msgsNow * timeExecuted;
        
        if(msgsNow > this.totalMessagesInSystem[2])
            this.totalMessagesInSystem[2] = msgsNow;
        
        // Atualiza ocupação do centro local
        var localOccupationNow = simulator.serviceCenterLocal.occupationRate();
        this.occupationRateLocalCenter[1] += localOccupationNow * timeExecuted;

        if(localOccupationNow > this.occupationRateLocalCenter[2])
            this.occupationRateLocalCenter[2] = localOccupationNow;
        
        // Atualiza ocupação do centro remoto
        var remoteOccupationNow = simulator.serviceCenterRemote.occupationRate();
        this.occupationRateRemoteCenter[1] += remoteOccupationNow * timeExecuted;

        if(remoteOccupationNow > this.occupationRateRemoteCenter[2])
            this.occupationRateRemoteCenter[2] = remoteOccupationNow;
        
    };
    
    this.updateFinalStatistics = function(simulator) {        
        // Atualiza as estatísticas gerais
        this.simulationTime = simulator.simulation.simulationTime;
        this.localServiceCenterServers = simulator.simulation.localServiceCenterServers;
        this.remoteServiceCenterServers = simulator.simulation.remoteServiceCenterServers;
        
        this.messagesSystemTime[1] /= this.totalDispatchedMessages;
        this.totalMessagesInSystem[1] /= this.simulationTime;
        this.totalMessagesInSystemEnd = simulator.numberOfMessagesInSystem();
        
        this.occupationRateLocalCenter[1] /= this.simulationTime;
        this.occupationRateRemoteCenter[1] /= this.simulationTime;
    };
    
    this.numberToString = function(number, size) {
        var str = new String(roundNumber(number, 4));
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
            "Tempo de simulação:           " + this.numberToString(this.simulationTime, 10) +
            "            Núm. Servidores Dest. Local:  " + this.numberToString(this.localServiceCenterServers, 10) + "\n" +
            "Semente de aleatoriedade:     XXXXXXXXXX            Núm. Servidores Dest. Remoto: " +
            this.numberToString(this.remoteServiceCenterServers, 10) + "\n" +
            "\n" +
            "Resultados da simulação\n" +
            "----------------------------------------------------------------------------------------------\n" +
            "                                                         Mínimo          Média        Máximo\n" +
            "Número de mensagens no sistema                       " + this.numberToString(this.totalMessagesInSystem[0], 10) +
            "     " + this.numberToString(this.totalMessagesInSystem[1], 10) + "    " + this.numberToString(this.totalMessagesInSystem[2], 10) + "\n" +
            "Tempo de trânsito das mensagens no sistema           " + this.numberToString(this.messagesSystemTime[0], 10) +
            "     " + this.numberToString(this.messagesSystemTime[1], 10) + "    " + this.numberToString(this.messagesSystemTime[2], 10) + "\n" +
            "\n" +
            "Mensagens despachadas                                                                       \n" +
            "Total                                                " + this.numberToString(this.totalDispatchedMessages, 10) +
            "     " + this.numberToString(this.totalDispatchedMessages, 10) + "    " + this.numberToString(this.totalDispatchedMessages, 10) + "\n" +
            "Mensagens despachadas LOCAL -> LOCAL                 " + this.numberToString(this.trafficRate[0][3], 10) +
            "     " + this.numberToString(this.trafficRate[0][3], 10) + "    " + this.numberToString(this.trafficRate[0][3], 10) + "\n" +
            "Mensagens despachadas LOCAL -> REMOTO                " + this.numberToString(this.trafficRate[1][3], 10) +
            "     " + this.numberToString(this.trafficRate[1][3], 10) + "    " + this.numberToString(this.trafficRate[1][3], 10) + "\n" +
            "Mensagens despachadas REMOTO -> LOCAL                " + this.numberToString(this.trafficRate[2][3], 10) +
            "     " + this.numberToString(this.trafficRate[2][3], 10) + "    " + this.numberToString(this.trafficRate[2][3], 10) + "\n" +
            "Mensagens despachadas REMOTO -> REMOTO               " + this.numberToString(this.trafficRate[3][3], 10) +
            "     " + this.numberToString(this.trafficRate[3][3], 10) + "    " + this.numberToString(this.trafficRate[3][3], 10) + "\n" +
            "Total de mensagens no sistema no fim da simulação    " + this.numberToString(this.totalMessagesInSystemEnd, 10) +
            "     " + this.numberToString(this.totalMessagesInSystemEnd, 10) + "    " + this.numberToString(this.totalMessagesInSystemEnd, 10) + "\n" +
            "\n" +
            "Taxa de ocupação dos centros de serviço                                                     \n" +
            "Destino Local                                        " + this.numberToString(this.occupationRateLocalCenter[0], 10) +
            "     " + this.numberToString(this.occupationRateLocalCenter[1], 10) + "    " + this.numberToString(this.occupationRateLocalCenter[2], 10) + "\n" +
            "Destino Remoto                                       " + this.numberToString(this.occupationRateRemoteCenter[0], 10) +
            "     " + this.numberToString(this.occupationRateRemoteCenter[1], 10) + "    " + this.numberToString(this.occupationRateRemoteCenter[2], 10) + "\n";

        return report;
    }

}

/**
 * Evento de chegada de mensagem no centro de recepção
 */
function ArrivalReceptionCenterEvent(nextEventsList, currentTime, origin, simulator) {
    this.name = "Chegada no Centro de Recepção (Origem " + Message.NAME[Message.INDEX[origin]] + ")";
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
    this.name = "Chegada no Centro de Serviço (" + Direction.NAME[Direction.INDEX[email.direction]] + ")";
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
            setSimulationStatus("<span style='color: #41ab5d'>Simulação iniciada.</span>");
            this.initializeSimulation();
        } else if(!this.simulationRunning) {
            setSimulationStatus("<span style='color: #41ab5d'>Passo a passo.</span>");            
        }

        this.updateSimulationSpeed();
        this.simulationInProgress = true;

        // Se simulação não terminou, consome próximo evento
        if(!(this.nextEvent instanceof EndOfSimulationEvent)) {
            var currentTime = this.simulationTime;
            this.advanceToNextEvent();
            this.nextEvent.execute();
            
            // Atualiza as estatísticas
            this.statistics.updateStatistics(this.nextEvent.time - currentTime, this.nextEvent, this);
            
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
            setSimulationStatus("<span style='color: #41ab5d'>Simulação resumida.</span>");
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
        setSimulationStatus("<span style='color: #f2d013'>Simulação pausada.</span>");
        clearTimeout(this.simulationTimer);
        this.simulationRunning = false;
    };

    /**
     * Parar a simulação e calcular as estatísticas finais
     */
    this.stopSimulation = function() {
        setSimulationStatus("<span style='color: #d83838'>Simulação parada.</span>");

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
    
    this.updateSimulationSpeed = function() {
        this.simulationTimeInterval = 2500/this.simulation.simulationSpeed;
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
        this.updateSimulationSpeed();
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
    
    /**
     * Obter o número de mensagens no sistema no momento
     * @return
     */
    this.numberOfMessagesInSystem = function() {
        var reception = this.receptionCenter.isBusy() ? 1 : 0;
        reception += this.receptionCenter.waitQueue.length;
        
        var localCenter = this.serviceCenterLocal.getNumberOfBusyServers()
                    + this.serviceCenterLocal.waitQueue.length;
        
        var remoteCenter = this.serviceCenterRemote.getNumberOfBusyServers()
                    + this.serviceCenterRemote.waitQueue.length;
        
        return reception + localCenter + remoteCenter;
    }

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