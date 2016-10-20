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
    this.simulationTime = 500;
    this.simulationSeed = 11;
    this.simulationSpeed = 5;

    // Número de servidores nos centros de serviço
    this.localServiceCenterServers = 10;
    this.remoteServiceCenterServers = 20;

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

    // Tempo entre chegadas de mensagens
    this.arrivalIntervalLocal = [Function.NUMBER.EXPONENCIAL, 0.5, 0, 0];
    this.arrivalIntervalRemote = [Function.NUMBER.EXPONENCIAL, 0.6, 0, 0];

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
 * Estatísticas da simulação
 */
function Statistics() {
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
    this.updateStatistics = function(timeExecuted, event, simulator) {
        // Se é evento de saída gera estatísticas
        if(event instanceof OutServiceCenterEvent) {
            // Pega a mensagem e gera as estatísticas
        }
        
        // Atualiza as estatísticas gerais
    };
    
    this.getSimulationReport = function() {
        var report =
            "==============================================================================================\n" +
            "                                    Relatório da Simulação                                    \n" +
            "==============================================================================================\n" +
            "\n" +
            "Parâmetros da simulação\n" +
            "----------------------------------------------------------------------------------------------\n" +
            "Tempo de simulação:           XXXXXXXX                Núm. Servidores Dest. Local:  XXX\n" +
            "Semente de aleatoriedade:     XXXXXXXX                Núm. Servidores Dest. Remoto: XXX\n" +
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
            this.nextEventsList.push(new OutReceptionCenterEvent(this.nextEventsList, this.time + 50, this.receptionCenter, this.serviceCenterLocal, this.serviceCenterRemote));
        }
//        this.receptionCenter.totalMessages++;
//        this.receptionCenter.numMessagesIn++;
    };
}

/**
 * Evento de saída de mensagem do centro de recepção
 */
function OutReceptionCenterEvent(nextEventsList, time, simulator) {
    this.name = "Saída do Centro de Recepção";
    this.nextEventsList = nextEventsList;
    this.time = time;
    this.receptionCenter = simulator.receptionCenter;
    this.serviceCenterLocal = simulator.serviceCenterLocal;
    this.serviceCenterRemote = simulator.serviceCenterRemote;

    this.execute = function(){
        this.receptionCenter.numMessagesIn--;
        this.nextEventsList.push(new ArrivalServiceCenterEvent(this.nextEventsList, this.time + 50, this.serviceCenterLocal));
        if(this.receptionCenter.queue.length != 0) {
            queueEvent = this.receptionCenter.queue.shift(); //time \/ vai ser o tempo de saida do evento atual + tempo gerado pela funcao
            this.nextEventsList.push(new OutReceptionCenterEvent(this.nextEventsList, this.time + 50, this.receptionCenter, this.serviceCenterLocal, this.serviceCenterRemote));
        }
    };
}

/**
 * Evento de chegada de mensagem no centro de serviço
 */
function ArrivalServiceCenterEvent(nextEventsList, time, serviceCenter) {
    this.name = "Chegada no Centro de Serviço";
    this.nextEventsList = nextEventsList;
    this.time = time;
    this.serviceCenter = serviceCenter;

    this.execute = function() {
        this.serviceCenter.totalMessages++;
        this.serviceCenter.numMessagesIn++;
        if(this.serviceCenter.queue.length == 0) {
            // verifica qual vai ser a saida do evento, sucesso, falha, adiamento, e então cria o evento de saida
            this.nextEventsList.push(new OutServiceCenterEvent(this.nextEventsList, this.time + 50, this.serviceCenter));
        } else {
            this.serviceCenter.queue.push(this);
        }
    };
}

/**
 * Evento de saída de mensagem do centro de serviço
 */
function OutServiceCenterEvent(nextEventsList, time, serviceCenter) {
    this.name = "Saída do Centro de Serviço";
    this.nextEventsList = nextEventsList;
    this.time = time;
    this.serviceCenter = serviceCenter;

    this.execute = function() {
        //verifica o tipo de saida e toma as atitudes necessarias, exemplo adiamento precisa criar um evento de chegada no centro servico

        if(this.serviceCenter.queue.length != 0) {
            this.serviceCenter.queue.shift();
            // verifica qual vai ser a saida do evento, sucesso, falha, adiamento, e então cria o evento de saida
            //precisa atualizar o tempo que ficou na fila
            this.nextEventsList.push(new OutServiceCenterEvent(this.nextEventsList, this.time + 50, this.serviceCenter));
        }
        this.serviceCenter.numMessagesIn--;
    };
}

/**
 * Evento de início de simulação
 */
function StartOfSimulationEvent(nextEventsList, time, simulator) {
    this.name = "Início da Simulação";
    this.nextEventsList = nextEventsList;
    this.time = time;
    this.receptionCenter = simulator.receptionCenter;
    this.serviceCenterLocal = simulator.serviceCenterLocal;
    this.serviceCenterRemote = simulator.serviceCenterRemote;

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
    var self = this; // Necessário para uso do temporizador

    this.simulation = new Simulation(); // Simulação padrão
    this.probabilityGenerator = new ProbabilityGenerator();
    this.simulationTimer = undefined; // Temporizador de execução
    this.simulationCurrentTime = 0; // Momento atual da simulação
    this.simulationTimeInterval = undefined; // Intervalo de execução/atualização da interface

    this.receptionCenter = undefined // Centro de recepção
    this.localServiceCenter = undefined // Centro de serviço local
    this.remoteServiceCenter = undefined // Centro de serviço remoto

    this.simulationInProgress = false; // Simulação em progresso ou parada/terminada
    this.simulationRunning = false; // Simulação executando no momento ou pausada

    this.nextEventsList = undefined; // Lista de próximos eventos
    this.nextEvent = undefined; // Próximo evento a ser executado
    this.statistics = new Statistics(); // Estatísticas da simulação

    
    /**
     * Executar um passo da simulação
     */
    this.runStep = function() { // Deve utilizar self para acessar o contexto por causa do timer
        if(!self.simulationInProgress) {
            setSimulationStatus("Simulação iniciada.");
            self.initializeSimulation();
        }
        
        self.simulationInProgress = true;
        
        // Se simulação não terminou, consome próximo evento
        if(self.nextEvent.time <= self.simulation.simulationTime) {
            var currentTime = self.simulationTime;
            self.advanceToNextEvent();
            self.nextEvent.execute();
            
            // Atualiza as estatísticas
            self.statistics.updateStatistics(self.nextEvent.time - currentTime, self.nextEvent, self);

            // Atualiza a interface
            updateInterface();
        } else { // Senão, para simulação/gera estatísticas
            self.stopSimulation();
        }
    };

    /**
     * Executar (iniciar/resumir) a simulação
     */
    this.runSimulation = function() {
        // Inicializa a simulação se uma simulação ainda não estava em progresso
        if(this.simulationInProgress) {
            setSimulationStatus("Simulação resumida.");
        } else {
            setSimulationStatus("Simulação iniciada.");
            this.initializeSimulation();
        }

        // Define a execução cíclica dos passos da simulação
        this.simulationRunning = true;
        this.simulationTimer = setInterval(this.runStep, this.simulationTimeInterval);
    };

    /**
     * Pausar a simulação
     */
    this.pauseSimulation = function() {
        setSimulationStatus("Simulação pausada.");
        clearInterval(this.simulationTimer);
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
        clearInterval(this.simulationTimer);

        // Computa as estatísticas até o momento
        // TODO Acredito que isso não será necessário!
        this.computeFinalStatistics();
    };

    /**
     * Inicializar a simulação (configurações, eventos iniciais)
     */
    this.initializeSimulation = function() {        
        // Inicializa centros de recepção e serviço
        this.receptionCenter = new ReceptionCenter();
        this.localServiceCenter = new ServiceCenter(this.simulation.localServiceCenterServers);
        this.remoteServiceCenter = new ServiceCenter(this.simulation.remoteServiceCenterServers);

        // Inicializa o gerador de probabilidades
        this.initializeProbabilityGenerator();

        // Inicializa parâmetros de tempo de execução
        this.simulationTimeInterval = this.simulation.simulationSpeed * 100;
        this.simulationCurrentTime = 0;
        
        this.statistics = new Statistics();
        
        // Inicializa a lista de próximos eventos com eventos iniciais
        this.nextEventsList = new SortedArray([], null, function (a, b) {
            return a.time - b.time;
        });
        this.nextEvent = new StartOfSimulationEvent(this.nextEventsList, this.simulationCurrentTime, this);
        this.nextEventsList.push(this.nextEvent);
        this.nextEventsList.push(new EndOfSimulationEvent(this.simulation.simulationTime));
    };

    /**
     * Avançar a simulação para o próximo evento
     */
    this.advanceToNextEvent = function() {
        this.nextEvent = this.nextEventsList.shift();
        this.simulationCurrentTime += this.nextEvent.time;
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
