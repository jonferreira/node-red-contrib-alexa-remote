var debug = false;
	
  module.exports = function(RED) {
    var AlexaCommandNode;
    var Alexa = require('alexa-remote2');
	
    AlexaCommandNode = function(config) {
      var key, node, value;
	  
      RED.nodes.createNode(this, config);
	  
      node = this;
	  
      for (key in config) {
        value = config[key];
        node[key] = value;
      }
	  
      this.account = RED.nodes.getNode(config.account);
	  
      if(debug) {node.warn("1");}
      if(debug) {node.warn(this);}
	  
       this.on('input', function(msg) {
		  
        //return function(msg) {
			
			  var body, req, request;
			  
			  node.status({
				fill: "grey",
				shape: "dot",
				text: "connecting"
			  });
			  
			
			var alexa = new Alexa();
            
            if(debug) {node.warn("2");}
            if(debug) {node.warn(node);}
            
            alexa.init({
                cookie: node.account.cookie,  // cookie if already known, else can be generated using email/password
                email: node.account.email,    // optional, amazon email for login to get new cookie
                password: node.account.password, // optional, amazon password for login to get new cookie
                logger: console.log, // optional
                alexaServiceHost: node.account.alexaServiceHost || 'pitangui.amazon.com', // optional, e.g. "pitangui.amazon.com" for amazon.com, default is "layla.amazon.de"
                //userAgent: '...', // optional, override used user-Agent for all Requests and Cookie determination
                acceptLanguage: node.account.acceptLanguage || 'en-UK', // optional, override Accept-Language-Header for cookie determination
                amazonPage: node.account.amazonPage || 'amazon.com' // optional, override Amazon-Login-Page for cookie determination and referer for requests
                //useWsMqtt: false // optional, true to use the Websocket/MQTT direct push connection
                },
                function (err) {
                    if (err) {

                        node.status({
                            shape: "dot",
                            fill: "red",
                            text : "Error: " + err 
                        });

                        msg.payload = err;
                        msg.error = true;
                        
                        node.send(msg);

                    }

                    if(debug) {node.warn("3");}
                    if(debug) {node.warn(msg.payload.serialOrName || node.serialOrName);}
                    if(debug) {node.warn(msg.payload.text || node.text);}

                    var value;

                    if (msg.payload.command == "volume" || node.command == "volume") {
                        value = (msg.payload.volume || node.volume);
                    } else if (msg.payload.command == "shuffle" || node.command == "shuffle") {
                        value = (msg.payload.action || node.action);
                    } else if (msg.payload.command == "repeat" || node.command == "repeat") {
                        value = (msg.payload.action || node.action);
                    } 

                    
                    alexa.sendMessage((msg.payload.serialOrName || node.serialOrName), (msg.payload.command || node.command), value, function(error, result){
                        
                        if (err) {

                            node.status({
                                shape: "dot",
                                fill: "red",
                                text : "Error: " + err 
                            });
    
                            msg.payload = err;
                            msg.error = true;
                            
                            node.send(msg);
    
                        } else {

                            if(debug) {node.warn("4");}
                            if(debug) {node.warn(result);}
                            
                            node.status({
                                shape: "dot",
                                fill: "green",
                                text : "Success"
                            });
                            
                            msg.payload = result;
                            msg.error = false;
                            
                            node.send(msg);

                        }

                    });
                    
                }
            )	
        //};
      })
	  
    };
    RED.nodes.registerType("Alexa-command", AlexaCommandNode);
  };
