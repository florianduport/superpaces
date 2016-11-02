/**
 * Module.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	title : {
      type : 'STRING',
      required : true
    },
  	comment : {
      type : 'STRING',
      required : true
    },
  	course : {
  		model : 'course'
  	},
  	questions : {
  		collection : 'qcm',
  		via : 'module'
  	}
  }

};
