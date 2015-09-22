
$(function() {
 
    Parse.$ = jQuery;

    Parse.initialize("7P9OqqOirydUSqwEkxOEXlPrhABRpNj2H0itYXYJ","ocfjSaN926nhJH11dv4sJwgMCoetyqrdazdbYuvG");
    
    var output = "";
    
    var Info = Parse.Object.extend("Info");
    var LoginView = Parse.View.extend({
        template: Handlebars.compile($('#login-tpl').html()),
        events :{
        	'submit .form-signin' : 'login',
        	'click .sign-up' : 'signup'
        },
        login: function(e){
        	// Prevent Default Submit Event
            e.preventDefault();
            	var data = $(e.target).serializeArray();
            	//console.log(data);
            	username = data[0].value,
                password = data[1].value;
            Parse.User.logIn(username, password,{
            	success: function(user){
            		//alert('Welcome!!');
            		//var welcomeView = new WelcomeView({ model: user });
            		var query = new Parse.Query(Info);
            		query.find({
            			success: function(results){
            				//var output = "";
            				for (var i in results){
            					if(results[i].attributes.userid.id == Parse.User.current().id){
            						output = results[i];
            						break;
            					}
            				}
            				//output = results[9];
            				var welcomeView = new WelcomeView({ model: output });	
                			welcomeView.render();
                			$('.main-container').html(welcomeView.el);
            			},error: function(error){
            				console.log("Query Error: "+error.message);
            			}
            		});
            		/*welcomeView.render();
            		$('.main-container').html(welcomeView.el);*/
            	},error: function(user,error){
            		alert("Error: "+error.message);
            	}
            });
        },
        signup: function(e){
        	e.preventDefault();
		    	var signupView = new SignupView();
		    	signupView.render();
		    	$('.main-container').html(signupView.el);
        },
        render: function(){
            this.$el.html(this.template());
        }
    });
          
    var WelcomeView = Parse.View.extend({
    	template: Handlebars.compile($('#welcome-tpl').html()),
    	events:{
    		'click .logout' : 'logout',
    		'click .repeatify' : 'repeatify',
    		'click .fibonacci' : 'fibonacci'
    	},
    	logout:function(e){
    		//e.preventDefault();
    		loginView.render();
    		$('.main-container').html(loginView.el);
    		location.reload();
    	},
    	repeatify: function(e){
    		e.preventDefault();
    		var n = $("#input-repeatify").val();
    		if(n==""){n=3;}
    		var name = output.attributes.name;
    		var str="";
    		for(var i=0; i<n; i++){
    			str += name; 
    		}
    		$('#repeatify-result .result').text(str);
    	},
    	fibonacci: function(e){
    		e.preventDefault();
    		var n = $("#input-fibonacci").val();
    		if(n==""){n=10;}
    		//fibonacci
    		var str="0,1,";
    		var fb = []; //initial array
    		fb[0] = 0;
    		fb[1] = 1;
    		for(i=2; i<=n-3; i++){
    		    fb[i] = fb[i-2] + fb[i-1];
    		    str += fb[i].toString()+","; 
    		}
    		for(i=n-2;i<=n-2;i++){
    			fb[i] = fb[i-2] + fb[i-1];
    			str += fb[i].toString()+" and ";
    		}
    		for(i=n-1;i<=n-1;i++){
    			fb[i] = fb[i-2] + fb[i-1];
    			str += fb[i].toString();
    		}
    		$('#fibonacci-result .result').text(str);
    	},
    	render: function(){
    		var attributes = this.model.toJSON();
    		this.$el.html(this.template(attributes));
    	}
    });
    
    var SignupView = Parse.View.extend({
    	template: Handlebars.compile($('#signup-tpl').html()),
    	events: {
    		'submit .form-signup' : 'register'
    	},
    	register: function(e){
    		e.preventDefault();
    			//Get Data from form
	    		var data = $(e.target).serializeArray();
	        	//console.log(data);
	        	name = data[0].value,
	            username = data[1].value,
	            email = data[2].value;
	            if(data[3].value == "F"){
	            	sex = true; //female
	            } else {
	            	sex = false; //male
	            }
	            var address = data[4].value,
	            pass = data[5].value;
	        	
	        	var user = new Parse.User();
	        	user.set("username", username);
	        	user.set("email", email);
	        	user.set("password", pass);
	        	
	        	
	        	user.signUp(null,{
	        		success: function(user){
	        			var userid = Parse.User.current();
	        			var newInfo = new Info();
	        			newInfo.set("name", name);
	    	        	newInfo.set("address", address);
	    	        	newInfo.set("userid", userid);
	    	        	newInfo.set("gender",sex);
	    	        	
	    	        	newInfo.save({
	        				success: function(){
	        					
	        				}, error: function(error){
	        					console.log("Save with File Error:"+error.message);
	        				}
	        			});
	        			
	    	        	//Get File from form input
	    	        	var fileElement = $("#photo-file")[0];
	    	        	var filePath = $("#photo-file").val();
	    	        	var fileName = filePath.split("\\").pop();
	    	        	
	    	        	if(fileElement.files.length > 0) {
	    	        		var file = fileElement.files[0];
	    	        		var newFile = new Parse.File(fileName, file);
	    	        		newFile.save({
	    	        			success: function(){
	    	        				//console.log("success");
	    	        			},error: function(file,error){
	    	        				console.log("File Save Error:"+error.message);
	    	        			}
	    	        		}).then(function(theFile){
	    	        			newInfo.set("file", theFile);
	    	        			newInfo.save({
	    	        				success: function(theFile){
	    	        					//console.log("success");
	    	        					alert("Thank you for signing up!!");
	    	    	        			loginView.render();
	    	    	        			$('.main-container').html(loginView.el);
	    	    	        			location.reload();
	    	        				}, error: function(theFile,error){
	    	        					console.log("Save with File Error:"+error.message);
	    	        				}
	    	        			});
	    	        		 });
	    	        	} 
	        		},error: function(user,error){
	        			alert("signup error: "+error.message);
	        		}
	        	});
    	},
    	render: function(){
    		this.$el.html(this.template());
    	}
    });
    
    var loginView = new LoginView();
	loginView.render();
	$('.main-container').html(loginView.el);
	
	function repeatify() {
	    var n = $("#input-repatify").val();
	    
	}

})
  