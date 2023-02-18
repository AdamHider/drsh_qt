import jQuery from "jquery";

export class ApiService {
  baseUrl = "/";

  constructor(config){
    Object.assign(this, config);
  }
  setResource = (context, method) =>  {
    context = context.charAt(0).toUpperCase() + context.slice(1);
    return this.baseUrl+`${context}/${method}`;
  }
  setHeaders = () =>  {
    const headers = {
        "Content-Type": "application/json"
    };
    if(localStorage['x-sid']) headers['x-sid'] = localStorage['x-sid'];
    return headers;
  }

  post = async(context, method, params = {}) =>  {
    var self = this;
    let responseData = {};
    const resource = this.setResource(context, method);
    const headers = this.setHeaders(context, method);

    await fetch(resource, {
        method: 'POST', // or 'PUT'
        credentials: 'include',
        headers: headers,
        body: JSON.stringify(params),
        })
        .then((response) => {
            if(response.headers.get('x-sid')){
                localStorage.setItem('x-sid', response.headers.get('x-sid'))
            }
            return response.json()
        })
        .then((data) => {
            responseData = data;
        })
        .catch((error) => {
            responseData = error;
        });
    return responseData;
  }
}


export class Api extends ApiService{
    achievement = {
        getList: (params) => {
            return this.post('achievement', 'getList', params)
        }
    }
    challenge = {
        getItem: (params) => {
            return this.post('challenge', 'getItem', params)
        },
        getList: (params) => {
            return this.post('challenge', 'getList', params)
        },
        addWinnerItem: (params) => {
            return this.post('challenge', 'addWinnerItem', params)
        }
    }
    homework = {
        getItem: (params) => {
            return this.post('homework', 'getItem', params)
        },
        getList: (params) => {
            return this.post('homework', 'getList', params)
        }
    }
    course = {
        getList: (params) => {
            return this.post('course', 'getList', params)
        },
        getActive: (params) => {
            return this.post('course', 'getItem', params)
        }
    }
    lesson = {
        getItem: (params) => {
            return this.post('lesson', 'getItem', params)
        },
        getList: (params) => {
            return this.post('lesson', 'getList', params)
        },
        getSatellites: (params) => {
            return this.post('lesson', 'getSatellites', params)
        },
        getPage: (params) => {
            return this.post('lesson', 'getPage', params)
        }
    }
    exercise = {
        addItem: (params) => {
            return this.post('exercise', 'addItem', params)
        },
        redoItem: (params) => {
            return this.post('exercise', 'redoItem', params)
        },
        saveAnswer: (params) => {
            return this.post('exercise', 'saveAnswer', params)
        },
        getLeaderboard: (params) => {
            return this.post('exercise', 'getLeaderboard', params)
        }

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
        saveProfile: (params) => {
            return this.post('user', 'saveItemProfile', params)
        },
        savePassword: (params) => {
            return this.post('user', 'saveItemPassword', params)
        },
        signUp: (params) =>  {
            return this.post('user', 'signUp', params)
        },
        signOut: async (params) =>  {
            const result = await this.post('user', 'signOut', params);
            localStorage.removeItem('x-sid')
            return result
        },
        signIn: (params) => {
            return this.post('user', 'signIn', params);
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
        getItem: (params) =>  {
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
