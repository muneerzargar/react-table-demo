'use strict';

// spinner service
// import ServiceContainer from '../service/service-container';

export default class Service {
	/**
	* Builds a service with methods as defined in the config object
	*
	* The keys of the config object are coved to sunctions, their content should be the params as passed to fetch
	*
	* @param {String} url
	* @param {object} config
	*/

	constructor(url, config){
		this.url = url;
		this.config = config;

		for (let prop in config) {
			if(config.hasOwnProperty(prop)){
				this[prop] = function(params, body){
					return this.request(prop, params, body);
				}
			}
		}
	}

	/**
	* Builds a query string with given params
	*
	* @param params
	* @param url
	* @return {string}
	*/

	buildQueryString(params, url){
		let items = [];
		const urlParams = this.getUrlParams(url);

		for(let prop in params){
			if(params.hasOwnProperty(prop) && (urlParams.indexOf(prop) === -1) && typeOf(params[prop]) !== "undefined"){

				//if it's an array, only include it if we have values.
				if((Array.isArray(params[prop]) && params[prop].length)){
					params[prop].forEach(function(val){
						items.push(prop+ '=' + val)
					});
				} else if(!Array.isArray(params[prop])){
					items.push(prop+'='+params[prop]);
				}
			}
		}

		return items.join('&');
	}

	/**
	* Returns a string with replacements replaced with their actual values, if present.
	*
	* @param url
	* @param params
	* @return {String}
	*/

	createFinalUrl(url, params){
		const urlParams = this.getUrlParams(url);
		let finalUrl = url;

		if(urlParams && params){
			for(let i=0; i<urlParams.length; i++){
				if(typeOf(params[urlParams[i]]) !== 'undefined'){
					finalUrl = finalUrl.replace('{'+urlParams[i]+'}', params[urlParams[i]]);
				}
			}
		}

		return finalUrl.replace(/{.+?}/g, "").replace(/\/$/, "");
	}

	/**
	* Gets the url params from the given url
	*
	* @params url
	* @returns {Array}
	*/

	getUrlParams(url){
		let params = url.match(/{.+?}/g);
		if(params){
			for(let i=0; i<params.length; i++){
				params[i] = params[i].replace(/[\W]/g, "");
			}
		}
		return params === null ? [] : params;
	}

	/**
	* Gets the http vernb of action.
	*
	* @param label
	* @returns {*}
	*/

	getMethod(label){
		if(typeOf(this.config[label]) !== "undefined" && typeOf(this.config[label].method !== "undefined")){
			return this.config[label].method.toUpperCase();
		}

		return 'GET';
	}

	/**
	* Gets the message to apply to progress notifications (spinners etc).
	*
	* @param label
	*/

	getProgressMessage(label){
		return this.config[label].progressMessage;
	}

	/**
	* Gets the url for the given action.
	*
	* @param label
	* @returns {String | *}
	*/

	getUrl(label){
		return typeOf(this.config[label].url) === 'undefined' ? this.url : this.config[label].url;
	}

	/**
	* Make a http request. Using the config defined by the label key.
	*
	* @param label
	* @param params
	* returns {*}
	* @todo remove the no-cors property once we resolve cors issue at the application microservice level
	*/

	request(label, params, body){
		let tUrl = this.getUrl(label);

		let qs = this.buildQueryString(params, tUrl) === '' ? '' : '?' + this.createFinalUrl(tUrl, params);
		let finalUrl = this.createFinalUrl(tUrl, params) + qs;
		
		let args = {
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			method: this.getMethod(label)
		};

		if(typeOf(body) !== "undefined"){
			args.body = JSON.stringify(body);
		}

		ServiceContainer.spinnerService.add('fullScreen', this.getProgressMessage(label));

		return fetch(finalUrl, args).then((res) => {
			ServiceContainer.spinnerService.remove('fullScreen', this.getProgressMessage(label));
			return res;
		}, (e) => {
			ServiceContainer.spinnerService.remove('fullScreen', this.getProgressMessage(label));
			return promise.reject(e);
		});
	}
}