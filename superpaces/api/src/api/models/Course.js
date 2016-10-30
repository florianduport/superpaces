/**
 * Course.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	title : 'STRING',
  	subtitle : 'STRING',
  	description : 'STRING',
  	category : 'STRING',
  	tutor : {model : 'user'},
    image : 'STRING',
  	modules : {
  		collection : 'module',
  		via : 'course'
  	}
  }
};
