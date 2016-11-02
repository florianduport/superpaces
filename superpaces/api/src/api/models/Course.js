/**
 * Course.js
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
  	subtitle : {
      type : 'STRING',
      required : true
    },
  	description : {
      type : 'STRING',
      required : true
    },
  	category : {
      type : 'STRING',
      required : true
    },
  	tutor : {
      model : 'user',
      required : true
    },
    image : 'STRING',
  	modules : {
  		collection : 'module',
  		via : 'course',
      required : true
  	}
  }
};
