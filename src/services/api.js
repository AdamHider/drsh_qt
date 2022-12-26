import jQuery from "jquery";

export class ApiService {
  baseUrl = "/";

  constructor(config){
    Object.assign(this, config);
  }
  setResource = (context, method) =>  {
    return this.baseUrl+`index.php?option=com_dershane&scope=${context}&method=${method}&format=raw`;
  }
  setBody = (params) => {
    return {
      request_data: params
    };
  }
  post = async(context, method, params = {}) =>  {
    var self = this;
    let responseData = {};
    const resource = this.setResource(context, method);
    const body = this.setBody(params);
    await jQuery.ajax({
      url: resource,
      method: "POST",
      data: body,
      xhrFields: {
        withCredentials: true
      }
    })
      .done(function(response, textStatus, request){
        responseData = JSON.parse(response);
      })
      .fail(function(){
        responseData = false;
      });
      return responseData;
  }
}


export class Api extends ApiService{
    achievements = {
        getList: (params) => {
            return this.post('achievement', 'getList', params)
        }
    }
    course = {
        getList: (params) => {
            return this.post('category', 'getList', params)
        },
        getActive: (params) => {
            return this.post('category', 'getItem', params)
        }
    }
    lesson = {
        getItem: (params) => {
            return this.post('lesson', 'getItem', params)
        },
        getList: (params) => {
            return this.post('lessons', 'getList', params)
        },
        getSatellites: (params) => {
            return this.post('lesson', 'getSatellites', params)
        }
    }
    exercise = {
        addItem: (params) => {
            return this.post('exercise', 'addItem', params)
        },
    }

    notifications = {
        getList: (params) => {
            return this.post('notification', 'getList', params)
        }
    }
    user = {
        get: (params) =>  {
            return this.post('user', 'getItem', params)
        },
        save: (params) => {
            return this.post('user', 'saveItem', params)
        },
        savePassword: (params) => {
            return this.post('user', 'savePassword', params)
        },
        signUp: (params) =>  {
            return this.post('userAuth', 'addItem', params)
        },
        signOut: (params) =>  {
            return this.post('userAuth', 'signOut', params);
        },
        signIn: (params) => {
            return this.post('userAuth', 'signIn', params);
        },
        checkUsername: (params) => {
            return this.post('user', 'checkUsername', params);
        },
        checkEmail: (params) => {
            return this.post('user', 'checkEmail', params);
        }
    }
    classroom = {
        subscribe: (params) =>  {
            return this.post('classroom', 'subscribe', params)
        },
        getActive: (params) =>  {
            return this.post('classroom', 'getItem', params)
        },
        getList: (params) =>  {
            return this.post('classroom', 'getList', params)
        },
        checkIfExists: (params) =>  {
            return this.post('classroom', 'checkIfExists', params)
        }
    }
}
