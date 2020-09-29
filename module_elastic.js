// Include package request npm
const request = require('request');

// Read environment variables 
require('dotenv').config()
const els_host = process.env.ELS_HOST;

// Main functions

function index_edge_ngram(index_name,body_create){

	/// Create index in ElasticSearch
	// Args: index_name: string, name of index
	// 		 body_create: dictionary, body of requests

	return new Promise((resolve,reject) => {
	request(
		{
			url: `${els_host}/${index_name}`,
			method: "PUT",
			json: true,
			headers: {'Content-Type': 'application/json'},
			body: body_create
		},
		function(err, response, body){
			if (err){
				console.log(err);
			}
			else{
				console.log(JSON.stringify(body,null,3));
			}
	})
	})
}

function delete_index(index_name){
	
	// Delete index and data in ElasticSearch
	// Args: index_name: string, name of index

	return new Promise((resolve,reject) => {
	request({
		url: `${els_host}/${index_name}`,
		method: 'DELETE'
	},
	function (err, res,body){
		if (err){
			console.log(err);
		}
		else{
			console.log(JSON.stringify(body,null,3));
		}
	})
	})
}

function index_data(index_name, id, body_data){
	
	// Insert data for index in ElasticSearch
	// Args: index_name: string, name of index
	//		 id: string, id of data in index
	//		 body_data: dictionary, data format json

	return new Promise((resolve,reject) => {
	request({
		url: `${els_host}/${index_name}/_doc/${id}`,
		method: "PUT",
		headers: {'Content-Type': 'application/json'},
		json: true,
		body: body_data
	}, 
	function(err, res, body){
		if (err){
			console.log(err);
		}
		else{
			console.log(JSON.stringify(body,null,3));
		}
	})
	})
}

function query_data(index_name, body_query){

	// Query data from ElasticSearch
	// Args: index_name: string, name of index
	// 		 body_query: dictionary, body request get data

	return new Promise((resolve,reject) => {
	request({
		url: `${els_host}/${index_name}/_search`,
		method: "GET",
		json: true,
		headers: {'Content-Type': 'application/json'},
		body: body_query
	},
	function(err, res, body){
		if (err){
			resolve(err);
		}
		else{
		//console.log(JSON.stringify(body,null,3));
		resolve(body);
		}
	})
	})
}

body_create = {

	// body request for create index use analysis and 
	// autocomplete search Edge-ngram tokenizer.

"settings": {
    "analysis": {
      "analyzer": {
        "autocomplete": {
          "tokenizer": "autocomplete",
          "filter": [
            "lowercase"
          ]
        },
        "autocomplete_search": {
          "tokenizer": "lowercase"
        }
      },
      "tokenizer": {
        "autocomplete": {
          "type": "edge_ngram",
          "min_gram": 1,
          "max_gram": 10,
          "token_chars": [
            "letter"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "text": {
        "type": "text",
        "analyzer": "autocomplete",
        "search_analyzer": "autocomplete_search"
      }
    }
  }
}

//delete_index("message_index")
//index_edge_ngram("message_edge",body_create).then(function(res){console.log(res)})
//index_data("message_not_edge","2",{"text": "Chất lượng sản phẩm tuyệt vời . Son mịn nhưng khi đánh lên không như màu trên ảnh"})
//query_data("message_edge",{"query":{"match":{"text":{"query":"Hàn"}}}})

module.exports = {
	
	// export module to use

    delete_index: delete_index,
	index_edge_ngram: index_edge_ngram,
	index_data: index_data,
	query_data: query_data
}

// End
