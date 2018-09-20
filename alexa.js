(function() {
	
	var debug = true;
	
  module.exports = function(RED) {
    var AlexaCredentialsNode, AlexaSpeakNode;
	var Alexa = require('alexa-remote2');

    AlexaCredentialsNode = function(config) {
      
      RED.nodes.createNode(this, config);
	  
	  var node = this;
      
	  if(debug) {node.warn(config);}
      
      this.cookie = config.cookie;
      this.email = config.email;
      this.password = config.password;
      this.alexaServiceHost = config.alexaServiceHost;
      this.acceptLanguage = config.acceptLanguage;
      this.amazonPage = config.amazonPage;
	  
      //return this.host = config.host;
    };
	
    AlexaSpeakNode = function(config) {
      var key, node, value;
	  
      RED.nodes.createNode(this, config);
	  
      node = this;
	  
      for (key in config) {
        value = config[key];
        node[key] = value;
      }
	  
      this.account = RED.nodes.getNode(config.account);
	  
	  if(debug) {node.warn(this);}
	  
      return this.on('input', (function(_this) {
		  
        return function(msg) {
			
			  var body, req, request;
			  
			  node.status({
				fill: "grey",
				shape: "dot",
				text: "connecting"
			  });
			  
			
			var Alexa = new Alexa();
			
            if(debug) {node.warn(node);}
            
            alexa.init({
                cookie: node.account.cookie,  // cookie if already known, else can be generated using email/password
                email: node.account.email,    // optional, amazon email for login to get new cookie
                password: node.account.password, // optional, amazon password for login to get new cookie
                logger: console.log, // optional
                alexaServiceHost: node.account.alexaServiceHost || 'pitangui.amazon.com', // optional, e.g. "pitangui.amazon.com" for amazon.com, default is "layla.amazon.de"
                //userAgent: '...', // optional, override used user-Agent for all Requests and Cookie determination
                acceptLanguage: this.account.acceptLanguage || 'en-UK', // optional, override Accept-Language-Header for cookie determination
                amazonPage: this.account.amazonPage || 'amazon.com' // optional, override Amazon-Login-Page for cookie determination and referer for requests
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
                    
                    this.sendSequenceCommand(msg.serialOrName || node.serialOrName, "speak", msg.text || node.text, function(error, result){
                        
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

                            if(debug) {node.warn(result);}
                            
                            node.status({
                                shape: "dot",
                                fill: "green",
                                text : "Success"
                            });
                            
                            msg.payload = result;
                            
                            node.send(msg);

                        }

                    });
                    
                }
            ).catch((err) => {
				
				if(debug) {node.warn(err);}
				
				node.status({
				  shape: "dot",
				  fill: "red",
				  text : "Error: " + err 
				});
				
				msg.payload = err;
				msg.error = true;
				
				node.send(msg);
				
			});;
		
        };
      })(this));
	  
    };
    RED.nodes.registerType("Alexa-credentials", AlexaCredentialsNode);
    return RED.nodes.registerType("Alexa-speak", AlexaSpeakNode);
  };

}).call(this);
