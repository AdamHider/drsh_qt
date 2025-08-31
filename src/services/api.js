export class ApiService {
  baseUrl = "/";
  lastRequestDataHash = "";

  constructor(config){
    Object.assign(this, config);
  }
  setResource = (context, method) =>  {
    var url_parts = context.split('/')
    for(var i in url_parts){
      url_parts[i] = url_parts[i].charAt(0).toUpperCase() + url_parts[i].slice(1);
    }
    context = url_parts.join('/');
    return this.baseUrl+`${context}/${method}`;
  }
  setHeaders = (context, method) =>  {
    let headers = {
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
    let data = JSON.stringify(params);
    await fetch(resource, {
        method: 'POST', // or 'PUT'
        headers: headers,
        body: data,
        })
        .then((response) => {
            if(response.headers.get('x-sid')){
                localStorage.setItem('x-sid', response.headers.get('x-sid'))
            }
            if(response.headers.get('Data-Hash')){
              this.lastRequestDataHash = response.headers.get('Data-Hash')
            }
            return response.json();
        })
        .then((data) => {
            responseData = data;
        })
        .catch((error) => {
            responseData = error
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
    notifications = {
        getList: (params) => {
            return this.post('notification', 'getList', params)
        }
    }
    quest = {
        getList: (params) => {
            return this.post('quest', 'getList', params)
        },
        claimReward: (params) => {
            return this.post('quest', 'claimReward', params)
        },
        startItem: (params) => {
          return this.post('quest', 'startItem', params)
        }
    }
    character = {
        linkItem: (params) => {
            return this.post('character', 'linkItem', params)
        },
        getList: (params) => {
            return this.post('character', 'getList', params)
        }
    }
    skill = {
        getItem: (params) => {
            return this.post('skill', 'getItem', params)
        },
        getList: (params) => {
            return this.post('skill', 'getList', params)
        },
        claimSkill: (params) => {
            return this.post('skill', 'claimItem', params)
        }
    }
    course = {
        getList: (params) => {
            return this.post('course', 'getList', params)
        },
        getItem: (params) => {
            return this.post('course', 'getItem', params)
        },
        linkItem: (params) => {
            return this.post('course', 'linkItem', params)
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
        getDailyList: (params) => {
            return this.post('lesson', 'getDailyList', params)
        },
        getPage: (params) => {
            return this.post('lesson', 'getPage', params)
        }
    }
    exercise = {
        createItem: (params) => {
            return this.post('exercise', 'createItem', params)
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
    user = {
        getItem: (params) =>  {
            return this.post('user', 'getItem', params)
        },
        saveItem: (params) => {
            return this.post('user', 'saveItem', params)
        },
        saveItemSettings: (params) => {
            return this.post('user', 'saveItemSettings', params)
        },
        savePassword: (params) => {
            return this.post('user', 'saveItemPassword', params)
        },
        checkUsername: (params) => {
            return this.post('user', 'checkUsername', params);
        },
        checkUsernameAuth: (params) => {
            return this.post('user', 'checkUsernameAuth', params);
        },
        checkEmail: (params) => {
            return this.post('user', 'checkEmail', params);
        },
        checkEmailVerification: (params) => {
            return this.post('user', 'checkEmailVerification', params);
        },
        generateUsername: (params) => {
            return this.post('user', 'generateUsername', params);
        },
        getItemInvitation: (params) => {
            return this.post('user', 'getItemInvitation', params);
        },
    }
    auth = {
        signUp: (params) =>  {
            return this.post('auth', 'signUp', params)
        },
        signOut: async (params) =>  {
            localStorage.removeItem('x-sid')
            return await this.post('auth', 'signOut', params);
        },
        getAuth: (params) => {
            return this.post('auth', 'getAuth', params);
        },
        signIn: (params) => {
            return this.post('auth', 'signIn', params);
        },
    }
    market_offer = {
      getList: (params) => {
          return this.post('marketOffer', 'getList', params)
      },
      buyItem: (params) => {
          return this.post('marketOffer', 'buyItem', params)
      }
    }
}
