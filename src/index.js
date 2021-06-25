import React, {useState, useEffect} from 'react'
import Fetcher, {Router, Client} from 'a-fetch'
import {get} from 'js-expansion'

class Config {
  constructor() {
    this.Request = Fetcher.request()
    this.setRecords = null
  }

  index(name, params = {}, append = false) {
    const [indexParams, setIndexParams] = useState(params)
    const [index, setIndex] = useState(Fetcher.collection())

    useEffect(() => {
      setIndex({...index, loading: true})
      this.Request.index(name, indexParams).then(response => {
        if (append) {
          response.data = index.data.concat(response.data)
        }
        setIndex(response)

        if (this.setRecords && response.records) {
          this.setRecords(response.records)
        }
      })
    }, [indexParams])

    return [index, data => setIndex({...index, data}), setIndexParams]
  }

  show(name, params = {}) {
    const [showParams, setShowParams] = useState(params)
    const [show, setShow] = useState(Fetcher.model())

    useEffect(() => {
      setShow({...show, loading: true})
      this.Request.show(name, showParams).then(response => {
        setShow(response)

        if (this.setRecords && response.records) {
          this.setRecords(response.records)
        }
      })
    }, [showParams])

    return [show, data => setShow({...show, data}), setShowParams]
  }

  store(name, model = {}) {
    const [store, setStore] = useState({...Fetcher.model(), loading: false, data: model})

    const submit = (submitParams = {}) => {
      setStore({...store, loading: true})
      return this.Request.store(name, {...store.data, ...submitParams}).then(response => {
        setStore({...store, ...response, data: response.errors.length ? store.data : model, loading: false})

        if (this.setRecords && response.records) {
          this.setRecords(response.records)
        }

        return response
      })
    }

    return [
      store,
      (data) => setStore({...store, data: {...store.data, ...data}}),
      submit,
    ]
  }

  update(name, model = {}, params = {}, mapping = {}) {
    const [update, setUpdate] = useState({...Fetcher.model(), loading: false, data: model})
    const updateData = (data) => setUpdate({...update, data: {...update.data, ...data}})

    if (Object.keys(params).length) {
      useEffect(() => {
        this.Request.show(name, params).then(response => {
          const data = {}

          Object.keys(model).map((name) => {
            if (mapping[name]) {
              data[name] = get(response.data, mapping[name])
            } else if (response.data.hasOwnProperty(name)) {
              data[name] = response.data[name]
            }
          })

          updateData(data)
        })
      }, [])
    }

    const submit = (submitParams = {}) => {
      setUpdate({...update, loading: true})
      return this.Request.update(name, {...update.data, ...submitParams}).then(response => {
        setUpdate({...update, ...response, data: update.data, loading: false})

        if (this.setRecords && response.records) {
          this.setRecords(response.records)
        }

        return response
      })
    }

    return [
      update,
      updateData,
      submit,
    ]
  }

  delete(name, params = {}) {
    const [destroy, setDestroy] = useState({loading: false})

    const submit = (submitParams = {}) => {
      setDestroy({loading: true})
      return this.Request.delete(name, {...params, ...submitParams}).then(response => {
        setDestroy({loading: false})

        if (this.setRecords && response.records) {
          this.setRecords(response.records)
        }

        return response
      })
    }

    return [
      destroy,
      submit,
    ]
  }

  login(model) {
    const [login, setLogin] = useState({...Fetcher.model(), loading: false, data: model})

    const submit = () => {
      setLogin({...login, loading: true})
      return this.Request.login(login.data).then(response => {
        setLogin({...login, data: model, loading: false})
        return response
      })
    }

    return [
      login,
      (data) => setLogin({...login, data: {...login.data, ...data}}),
      submit,
    ]
  }

  logout(model) {
    const [logout, setLogout] = useState({...Fetcher.model(), loading: false, data: model})

    const submit = () => {
      setLogout({...logout, loading: true})
      return this.Request.logout(logout.data).then(response => {
        setLogout({...logout, data: model, loading: false})
        return response
      })
    }

    return [
      logout,
      (data) => setLogout({...logout, data: {...logout.data, ...data}}),
      submit,
    ]
  }

  records(setRecords = null, records = [], key = 'id') {
    this.setRecords = setRecords
    this.Request.records(records, key)
    return this
  }

  api(api) {
    this.Request.api(api)
    return this
  }

  bearerToken(bearer_token) {
    this.Request.bearerToken(bearer_token)
    return this
  }
}

export const useApi = (name) => {
  return new Config().api(name)
}

export const useBearerToken = (name) => {
  return new Config().bearerToken(name)
}

export const useRecords = (setRecords = null, records = [], key = 'id') => {
  return new Config().records(setRecords, records, key)
}

export const useIndex = (name, params = {}, append = false) => {
  return new Config().index(name, params, append)
}

export const useShow = (name, params = {}) => {
  return new Config().show(name, params)
}

export const useStore = (name, model = {}) => {
  return new Config().store(name, model)
}

export const useUpdate = (name, model = {}, params = {}, mapping = {}) => {
  return new Config().update(name, model, params, mapping)
}

export const useDelete = (name, params = {}) => {
  return new Config().delete(name, params)
}

export const useLogin = (model = {}) => {
  return new Config().login(model)
}

export const useLogout = (model = {}) => {
  return new Config().logout(model)
}

export {Router, Client}
export default Fetcher
