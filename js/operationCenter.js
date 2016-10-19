/*========================================
 * Requires:  enums.js
 *=======================================*/

/**
 * Centro de recepção
 */
function ReceptionCenter() {
    "use strict";
    this.totalMessages = 0;
    this.numMessagesIn = 0;
    this.queue = new Array();
}

/**
 * Centro de serviço
 */
function ServiceCenter(numberOfServers) {
  "use strict";
    this.numberOfServers = numberOfServers;
    this.totalMessages = 0;
    this.numMessagesIn = 0;
    this.queue = new Array();
}
