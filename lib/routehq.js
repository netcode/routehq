(function(window,$){

	var routeHQ = {
		/* propertis */
		'handler':'',
		'container':'',
		'before':function(){},
		'after':function(){},
		'customRoutes':[],
		'customRoutesInfo':{},

		/* public functions */
		'init':function(options){
			this.handler = options.handler;
			this.container = options.container;
			if(typeof options.before == 'function'){
				this.before = options.before;
			}
			if(typeof options.after == 'function'){
				this.after = options.after;
			}
			//alert('coco');
			this.listen();
		},
		'listen':function(){
			var that = this;
			$(this.handler).click(function(){
				that.parseHash($(this).attr('href'));
				// var url = $(this).attr('href');
				// hash = '#!/'+url;
				// window.location = hash;				
				// that.callAjx(url,that.container);
				return false;
			});
		},
		'parseHash':function(url){
			var hash = '#!/'+url;
			window.location = hash;	
			if($.inArray(url,this.customRoutes) == -1){
				//not found process correct
				this.callAjx(url,this.container);
			}else{
				//process from above
				var info = this.customRoutesInfo[url];
				if(typeof info.process == 'function'){
					//overwrite our call function
					if(typeof info.before == 'function'){
						info.before();
					}
					info.process();
					if(typeof info.before == 'function'){
						info.after();
					}
				}else{
					this.callAjx(url,info.container,info.before,info.after);
				}
			}
		},
		'callAjx':function(url,result,beforefn,afterfn){
			//fire before filter
			if(typeof beforefn == 'function'){
				beforefn();
			}else{
				this.before();
			}
			var that = this;
			$.get(url,{ajx:1},function(data){
				//alert(typeof result);
				if(typeof result != 'undefined'){
					$(result).html(data);
				}
				//fire after filter
				if(typeof afterfn == 'function'){
					afterfn(data);
				}else{
					that.after(data);
				}
			});
		},
		'register':function(custom){

			this.customRoutes.push(custom.route);
			//alert(custom.process);
			this.customRoutesInfo[custom.route] = {
				'container':custom.container,
				'before':custom.before,
				'after':custom.after,
				'process':custom.process
			}
			
		}
		/* private functions */
		
	};

	window.routeHQ = window.__r = routeHQ;

})(window,jQuery);

//basic usage
__r.init({
	'handler':'.ajxme',
	'container':'.contain',
	'before':function(){
		alert('Before callback');
	},
	'after':function(){
		alert('after callback');
	}
});


//register new callback with ajx
__r.register({
	'route':'ajx/custom',
	'container':'.custom',
	'before':function(){
		alert('before loded custom');
	},
	'after':function(){
		alert('after loaded custom');
	}
});

__r.register({
	'route':'ajx/ajxnocontainer',	
	'before':function(){
		alert('before loded custom');
	},
	'after':function(data){
		alert('after loaded custom :: '+data);
	}
});

__r.register({
	'route':'ajx/customProcessNotexist',
	'process':function(){
		alert('process action custom');
	},
	'before':function(){
		alert('before loded custom');
	},
	'after':function(){
		alert('after loaded custom');
	}
});

/*
//register new callback without ajx (overwrite ajx)
__r.register({
	'route':'app/user',
	'container':'.custom',
	'process':function(){ //if this function exists overwrite ajax function
		alert('processing custom');
	},
	'before':function(){
		alert('before loded');
	},
	'after':function(data){
		alert('content loaded'+data);
	}
})

//register a route but with regix
_r.register({
	'route':'app/*', //can accpet route : yay :)
	'container':'.custom',
});
*/