const module_elastic = require("./module_elastic.js")

//a = module_elastic.query_data("message_edge",{"query":{"match":{"text":{"query":"Hàn"}}}})
a = module_elastic.delete_index("message_edge")
a.then(function(res){
	console.log(res);
})

