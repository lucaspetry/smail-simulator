/*========================================
 * Requires:  enums.js
 *            operationCenter.js
 *            smailSimulator.js
 *=======================================*/
 

/**
 * Carregar as opções de funções disponíveis (exponencial, normal, etc)
 * @param selectElement campo de opções da interface
 */
function loadFunctionOptions(selectElement) {
    console.log("Method call: loadFunctionOptions(selectElement)");

    for(i = 0; i < Function.SIZE; i++) {
        option = document.createElement("option");
        option.id = selectElement.id + Function.INDEX[i];
        option.value = Function.NUMBER[Function.INDEX[i]];
        // option.disabled = true;
        option.innerHTML = Function.NAME[Function.INDEX[i]];
        selectElement.options.add(option, i);
    }
}

/**
 * Atualizar os campos de parâmetros dependendo da função selecionada.
 * @param selectElement campo de opções da interface
 */
function updateFunctionParams(selectElement) {
    console.log("Method call: updateFunctionParams(selectElement)");

    selectedFunction = selectElement.options[selectElement.selectedIndex].value;
    functionParams = Function.PARAMS[Function.INDEX[selectedFunction] || Function.INDEX[0]];

    document.getElementById(selectElement.id + "Param1").disabled = true;
    document.getElementById(selectElement.id + "Param2").disabled = true;
    document.getElementById(selectElement.id + "Param3").disabled = true;
    document.getElementById(selectElement.id + "Param1").title = "";
    document.getElementById(selectElement.id + "Param2").title = "";
    document.getElementById(selectElement.id + "Param3").title = "";

    switch(functionParams.length) {
        case 3:
            document.getElementById(selectElement.id + "Param3").disabled = false;
            document.getElementById(selectElement.id + "Param3").title = functionParams[2];
        case 2:
            document.getElementById(selectElement.id + "Param2").disabled = false;
            document.getElementById(selectElement.id + "Param2").title = functionParams[1];
        case 1:
            document.getElementById(selectElement.id + "Param1").disabled = false;
            document.getElementById(selectElement.id + "Param1").title = functionParams[0];
        default:
            break;
    }
}

/**
 * Executar/pausar a simulação
 * @param src botão do menu que chamou a função
 */
function playSimulation(src) {
    console.log("Method call: playSimulation(src)");
    
    if(!simulator.simulationInProgress)
        loadInterfaceSettings();
    
    simulator.simulation.simulationSpeed = new Number(document.getElementById('field_simulationSpeed').value);

    if(src.id == "btn_play") {
        src.id = "btn_pause";
        document.getElementById("img_play").setAttribute("src", "images/appbar.control.pause.png");
        simulator.runSimulation();
    } else {
        src.id = "btn_play";
        document.getElementById("img_play").setAttribute("src", "images/appbar.control.play.png");
        simulator.pauseSimulation();
    }
}

/**
 * Executar um passo da simulação
 */
function stepSimulation() {
    console.log("Method call: stepSimulation()");
    
    if(!simulator.simulationInProgress)
        loadInterfaceSettings();
    
    simulator.simulation.simulationSpeed = new Number(document.getElementById('field_simulationSpeed').value);

    simulator.pauseSimulation();
    simulator.runStep();
}

/**
 * Parar a simulação
 */
function stopSimulation() {
    console.log("Method call: stopSimulation()");

    document.getElementById("img_play").setAttribute("src", "images/appbar.control.play.png");
    document.getElementById("img_play").parentElement.id = "btn_play";
    simulator.stopSimulation();
}

/**
 * Gerar o relatório da simulação
 */
function simulationReport() {
    console.log("Method call: simulationReport()");

    var blob = new Blob([simulator.statistics.getSimulationReport(simulator)], {type: "text/plain;charset=utf-8"});
    var currentdate = new Date();
    var datetime = currentdate.getFullYear() + "" + (currentdate.getMonth()+1) + "" + currentdate.getDate() + "@"
                + currentdate.getHours() + "" + currentdate.getMinutes() + "" + currentdate.getSeconds();
    
    saveAs(blob, "smail_report_" + datetime + ".txt");
}

/**
 * Exibir/esconder uma janela flutuante
 * @param divId identificador do elemento a ser exibido/escondido
 */
function showHideBox(divId) {
    console.log("Method call: showHideBox(divId)");

    // Se o container está visível, torna invisível, e vice-versa
    if(document.getElementById(divId).style.opacity == 0) {
        document.getElementById(divId).style.visibility = 'visible';
        document.getElementById(divId).style.opacity = 1;
    } else {
        document.getElementById(divId).style.opacity = 0;
        document.getElementById(divId).style.visibility = 'hidden';
    }

    // Se alguma das caixas de informação/configuração estiver ativa,
    // então esmaece a tela
    if(document.getElementById('about_box').style.visibility == 'visible'
      || document.getElementById('settings_box').style.visibility == 'visible'
      || document.getElementById('time_settings_box').style.visibility == 'visible') {
        document.getElementById('black_box').style.visibility = 'visible';
        document.getElementById('black_box').style.opacity = 0.7;
        document.body.style.overflowY = 'hidden';
    } else {
        document.getElementById('black_box').style.opacity = 0;
        document.getElementById('black_box').style.visibility = 'hidden';
        document.body.style.overflowY = 'scroll';
    }
}

/**
 * Carregar as configurações padrão da simulação na interface
 */
function loadDefaultSettings() {
    console.log("Method call: loadDefaultSettings()");
    
    loadFunctionOptions(document.getElementById("field_arrivalIntervalLocal"));
    loadFunctionOptions(document.getElementById("field_arrivalIntervalRemote"));
    loadFunctionOptions(document.getElementById("field_receptionLL"));
    loadFunctionOptions(document.getElementById("field_receptionLR"));
    loadFunctionOptions(document.getElementById("field_receptionRL"));
    loadFunctionOptions(document.getElementById("field_receptionRR"));
    loadFunctionOptions(document.getElementById("field_serviceLLS"));
    loadFunctionOptions(document.getElementById("field_serviceLLF"));
    loadFunctionOptions(document.getElementById("field_serviceLLA"));
    loadFunctionOptions(document.getElementById("field_serviceLRS"));
    loadFunctionOptions(document.getElementById("field_serviceLRF"));
    loadFunctionOptions(document.getElementById("field_serviceLRA"));
    loadFunctionOptions(document.getElementById("field_serviceRLS"));
    loadFunctionOptions(document.getElementById("field_serviceRLF"));
    loadFunctionOptions(document.getElementById("field_serviceRLA"));
    loadFunctionOptions(document.getElementById("field_serviceRRS"));
    loadFunctionOptions(document.getElementById("field_serviceRRF"));
    loadFunctionOptions(document.getElementById("field_serviceRRA"));

    document.getElementById('field_simulationTime').value = simulator.simulation.simulationTime;
    document.getElementById('field_simulationSeed').value = simulator.simulation.simulationSeed;
    document.getElementById('field_simulationSpeed').value = simulator.simulation.simulationSpeed;

    document.getElementById('field_serversLocal').value = simulator.simulation.localServiceCenterServers;
    document.getElementById('field_serversRemote').value = simulator.simulation.remoteServiceCenterServers;

    document.getElementById('field_arrivalIntervalLocal' + Function.INDEX[Function.NUMBER.EXPONENCIAL]).selected = true;
    document.getElementById('field_arrivalIntervalLocal' + Function.INDEX[Function.NUMBER.CONSTANT]).disabled = true;
    document.getElementById('field_arrivalIntervalLocal' + Function.INDEX[Function.NUMBER.UNIFORM]).disabled = true;
    document.getElementById('field_arrivalIntervalLocal' + Function.INDEX[Function.NUMBER.NORMAL]).disabled = true;
    document.getElementById('field_arrivalIntervalLocal' + Function.INDEX[Function.NUMBER.TRIANGULAR]).disabled = true;
    document.getElementById('field_arrivalIntervalLocalParam1').value = simulator.simulation.arrivalIntervalLocal[1];
    document.getElementById('field_arrivalIntervalLocalParam1').disabled = false;

    document.getElementById('field_arrivalIntervalRemote' + Function.INDEX[Function.NUMBER.EXPONENCIAL]).selected = true;
    document.getElementById('field_arrivalIntervalRemote' + Function.INDEX[Function.NUMBER.CONSTANT]).disabled = true;
    document.getElementById('field_arrivalIntervalRemote' + Function.INDEX[Function.NUMBER.UNIFORM]).disabled = true;
    document.getElementById('field_arrivalIntervalRemote' + Function.INDEX[Function.NUMBER.NORMAL]).disabled = true;
    document.getElementById('field_arrivalIntervalRemote' + Function.INDEX[Function.NUMBER.TRIANGULAR]).disabled = true;
    document.getElementById('field_arrivalIntervalRemoteParam1').value = simulator.simulation.arrivalIntervalRemote[1];
    document.getElementById('field_arrivalIntervalRemoteParam1').disabled = false;

    for(i = 0; i < Direction.SIZE; i++) {
        // Volume de tráfego
        document.getElementById('field_traffic' + Direction.INDEX[i]).value = simulator.simulation.traffic[i];

        // Taxas de sucesso, falha e adiamento
        document.getElementById('field_rateSuccess' + Direction.INDEX[i]).value = simulator.simulation.trafficRate[i][0];
        document.getElementById('field_rateFailure' + Direction.INDEX[i]).value = simulator.simulation.trafficRate[i][1];
        document.getElementById('field_ratePostponement' + Direction.INDEX[i]).value = simulator.simulation.trafficRate[i][2];

        // Tempos de recepção
        document.getElementById('field_reception' + Direction.INDEX[i] + Function.INDEX[Function.NUMBER.CONSTANT]).selected = true;
        document.getElementById('field_reception' + Direction.INDEX[i] + Function.INDEX[Function.NUMBER.EXPONENCIAL]).disabled = true;
        document.getElementById('field_reception' + Direction.INDEX[i] + Function.INDEX[Function.NUMBER.UNIFORM]).disabled = true;
        document.getElementById('field_reception' + Direction.INDEX[i] + Function.INDEX[Function.NUMBER.NORMAL]).disabled = true;
        document.getElementById('field_reception' + Direction.INDEX[i] + Function.INDEX[Function.NUMBER.TRIANGULAR]).disabled = true;
        document.getElementById('field_reception' + Direction.INDEX[i] + "Param1").value = simulator.simulation.receptionTime[i];
        document.getElementById('field_reception' + Direction.INDEX[i] + "Param1").disabled = false;

        // Tempos de serviço
        for(j = 0; j < Status.SIZE; j++) {
            func = simulator.simulation.serviceTime[Direction.INDEX[i]][j][0];
            funcParams = Function.PARAMS[Function.INDEX[func]];

            document.getElementById('field_service' + Direction.INDEX[i] + Status.INDEX[j] + "Param1").value = "";
            document.getElementById('field_service' + Direction.INDEX[i] + Status.INDEX[j] + "Param2").value = "";
            document.getElementById('field_service' + Direction.INDEX[i] + Status.INDEX[j] + "Param3").value = "";
            document.getElementById('field_service' + Direction.INDEX[i] + Status.INDEX[j] + Function.INDEX[func]).selected = true;

            for(k = 0; k < funcParams.length; k++) {
                document.getElementById('field_service' + Direction.INDEX[i] + Status.INDEX[j] + "Param" + (k+1)).value = simulator.simulation.serviceTime[Direction.INDEX[i]][j][k+1];
                document.getElementById('field_service' + Direction.INDEX[i] + Status.INDEX[j] + "Param" + (k+1)).disabled = false;
            }
        }
    }
}

/**
 * Carregar as configurações da interface na simulação
 */
function loadInterfaceSettings() {
    console.log("Method call: loadInterfaceSettings()");

    simulator.simulation.simulationTime = new Number(document.getElementById('field_simulationTime').value);
    simulator.simulation.simulationSeed = new Number(document.getElementById('field_simulationSeed').value);
    simulator.simulation.simulationSpeed = new Number(document.getElementById('field_simulationSpeed').value);

    simulator.simulation.localServiceCenterServers = new Number(document.getElementById('field_serversLocal').value);
    simulator.simulation.remoteServiceCenterServers = new Number(document.getElementById('field_serversRemote').value);
    
    simulator.simulation.arrivalIntervalLocal[1] = new Number(document.getElementById('field_arrivalIntervalLocalParam1').value);
    simulator.simulation.arrivalIntervalRemote[1] = new Number(document.getElementById('field_arrivalIntervalRemoteParam1').value);

    for(i = 0; i < Direction.SIZE; i++) {
        // Volume de tráfego
        simulator.simulation.traffic[i] = new Number(document.getElementById('field_traffic' + Direction.INDEX[i]).value);

        // Taxas de sucesso, falha e adiamento
        simulator.simulation.trafficRate[i][0] = new Number(document.getElementById('field_rateSuccess' + Direction.INDEX[i]).value);
        simulator.simulation.trafficRate[i][1] = new Number(document.getElementById('field_rateFailure' + Direction.INDEX[i]).value);
        simulator.simulation.trafficRate[i][2] = new Number(document.getElementById('field_ratePostponement' + Direction.INDEX[i]).value);

        // Tempos de recepção
        simulator.simulation.receptionTime[i] = new Number(document.getElementById('field_reception' + Direction.INDEX[i] + "Param1").value);

        // Tempos de serviço
        for(j = 0; j < Status.SIZE; j++) {
            func = document.getElementById('field_service' + Direction.INDEX[i] + Status.INDEX[j]);
            func = func[func.selectedIndex].value;
            funcParams = Function.PARAMS[Function.INDEX[func]];
            
            switch(funcParams.length) {
                case 1:
                    simulator.simulation.serviceTime[Direction.INDEX[i]][j] = [func*1,
                                            new Number(document.getElementById('field_service' + Direction.INDEX[i] + Status.INDEX[j] + "Param1").value)];
                    break;
                case 2:
                    simulator.simulation.serviceTime[Direction.INDEX[i]][j] = [func*1,
                                            new Number(document.getElementById('field_service' + Direction.INDEX[i] + Status.INDEX[j] + "Param1").value),
                                            new Number(document.getElementById('field_service' + Direction.INDEX[i] + Status.INDEX[j] + "Param2").value)];
                    break;
                case 3:
                    simulator.simulation.serviceTime[Direction.INDEX[i]][j] = [func*1,
                                            new Number(document.getElementById('field_service' + Direction.INDEX[i] + Status.INDEX[j] + "Param1").value),
                                            new Number(document.getElementById('field_service' + Direction.INDEX[i] + Status.INDEX[j] + "Param2").value),
                                            new Number(document.getElementById('field_service' + Direction.INDEX[i] + Status.INDEX[j] + "Param3").value)];
                    break;
            }
        }
    }
}

/**
 * Construir os gráficos padrão da interface
 */
function buildDefaultGraphs() {
    var freqData = [
        { State: Direction.INDEX[0], freq: {Sucesso:0, Falha:0, Adiamento:0} },
        { State: Direction.INDEX[1], freq: {Sucesso:0, Falha:0, Adiamento:0} },
        { State: Direction.INDEX[2], freq: {Sucesso:0, Falha:0, Adiamento:0} },
        { State: Direction.INDEX[3], freq: {Sucesso:0, Falha:0, Adiamento:0} }
        ];

    db.build('#dashboard', freqData);
    
    updateServersMap('#chart_localServiceCenter', simulator.simulation.localServiceCenterServers, 0, localServersMap);
    updateServersMap('#chart_remoteServiceCenter', simulator.simulation.remoteServiceCenterServers,  0, remoteServersMap);
}

/**
 * Atualizar a dashboard de resultado das mensagens
 */
function updateDashboard() {
    var freqData = [
        { State: Direction.INDEX[0], freq: {Sucesso: simulator.statistics.trafficRate[0][0],
                                            Falha: simulator.statistics.trafficRate[0][1],
                                            Adiamento: simulator.statistics.trafficRate[0][2]} },
        { State: Direction.INDEX[1], freq: {Sucesso: simulator.statistics.trafficRate[1][0],
                                            Falha: simulator.statistics.trafficRate[1][1],
                                            Adiamento: simulator.statistics.trafficRate[1][2]} },
        { State: Direction.INDEX[2], freq: {Sucesso: simulator.statistics.trafficRate[2][0],
                                            Falha: simulator.statistics.trafficRate[2][1],
                                            Adiamento: simulator.statistics.trafficRate[2][2]} },
        { State: Direction.INDEX[3], freq: {Sucesso: simulator.statistics.trafficRate[3][0],
                                            Falha: simulator.statistics.trafficRate[3][1],
                                            Adiamento: simulator.statistics.trafficRate[3][2]} }
        ];
    db.update(freqData);
}

function updateServersMap(divId, numServers, numBusyServers, serversMap) {
    var serversData = [];

    // Adiciona servidores ocupados
    for(i = 1; i <= numBusyServers; i++) {
        var col = Math.ceil(i/5);
        
        serversData.push({row: i%5 + 1, col: col, value: 10});
    }
    
    // Adiciona servidores livres
    for(i = numBusyServers + 1; i <= numServers; i++) {
        var col = Math.ceil(i/5);
        
        serversData.push({row: i%5 + 1, col: col, value: 0});
    }
    
    // Atualiza número de servidores ocupados na interface
    document.getElementById(divId.substring(1, divId.length) + "_busy")
                                    .innerHTML = numBusyServers + "/" + numServers;
    
    // Se número de servidores mudou, redesenha.
    // Caso contrário, atualiza
    if(serversMap.numServers != numServers)
        serversMap.build(divId, serversData, numServers);
    else
        serversMap.update(serversData);
}

function updateEventsList() {
    var events = simulator.nextEventsList;
    var eventsTable = document.getElementById("events_table");
    
    eventsTable.innerHTML = "<tr>\n" +
                            "<th style='width: 70px; text-align: right;'>Tempo</th>\n" +
                            "<th style='width: 10px;'></th>\n" +
                            "<th style='text-align: left;'>Evento</th>\n" +
                            "</tr>\n";
    
    events.forEach(function(e) {
        eventsTable.innerHTML +=
                    "<tr>\n" +
                    "<td style='text-align: right;'>" + roundNumber(e.time, 4) + "</td>\n" +
                    "<td style='width: 10px;'></td>\n" +
                    "<td style='text-align: left;'>" + e.name + "</td>\n" +
                    "</tr>\n";        
    });
}

/**
 * Atualizar a interface com as novas estatísticas
 */
function updateInterface() {
    console.log("Method call: updateInterface()");
    
    // Atualiza tempo atual
    document.getElementById('simulation_currentTime').innerHTML = roundNumber(simulator.simulationCurrentTime, 4);
    document.getElementById('simulation_messages').innerHTML = simulator.numberOfMessagesInSystem();
    
    document.getElementById('chart_localServiceCenter_busy').innerHTML = simulator.serviceCenterLocal.getNumberOfBusyServers();
    document.getElementById('chart_remoteServiceCenter_busy').innerHTML = simulator.serviceCenterRemote.getNumberOfBusyServers();
    
    document.getElementById('chart_receptionCenter_queue').innerHTML = simulator.receptionCenter.waitQueue.length;
    document.getElementById('chart_localServiceCenter_queue').innerHTML = simulator.serviceCenterLocal.waitQueue.length;
    document.getElementById('chart_remoteServiceCenter_queue').innerHTML = simulator.serviceCenterRemote.waitQueue.length;
    
    
    
    // Atualiza a lista de eventos
    updateEventsList();
    
    // Atualiza dashboard de resultados de mensagens
    updateDashboard();
    
    // Atualiza os mapas de servidores ocupados dos centros de serviço
    updateServersMap('#chart_localServiceCenter', simulator.simulation.localServiceCenterServers, simulator.serviceCenterLocal.getNumberOfBusyServers(), localServersMap);
    updateServersMap('#chart_remoteServiceCenter', simulator.simulation.remoteServiceCenterServers,  simulator.serviceCenterRemote.getNumberOfBusyServers(), remoteServersMap);
    // TODO deve ser atualizado com os números reais
}

function setSimulationStatus(status) {
    document.getElementById('simulation_status').innerHTML = status;
}