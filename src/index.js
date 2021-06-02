import React, {useState, useEffect} from 'react'
import Fetcher, {Router, Client} from 'a-fetch'

class Config  {
  constructor(config) {
    this.Fetcher = Fetcher
  }

  index(name, params = {}, records = []) {
    const [index, setIndex] = useState(Fetcher.collection())

    useEffect(() => {
      Fetcher.index(name, params, records).then(response => setIndex(response))
    }, [])

    return [index, data => setIndex({...index, data})]
  }

  show(name, params = {}, records = [], key = 'id') {
    const [show, setShow] = useState(Fetcher.model())

    useEffect(() => {
      Fetcher.show(name, params, records = [], key = 'id').then(response => setShow(response))
    }, [])

    return [show, data => setShow({...show, data})]
  }

  store(name, model = {}, records = [], key = 'id') {
    const [store, setStore] = useState({...Fetcher.model(), data: model})

    const submit = () => {
      setStore({...store, loading: true})
      return Fetcher.store(name, store.data, records, key).then(response => {
        setStore({...store, data: model, loading: false})
        return response
      })
    }

    return [
      store,
      (data) => setStore({...store, data: {...store.data, ...data}}),
      submit
    ]
  }

  update(name, params = {}, model = {}, records = [], key = 'id') {
    const [update, setUpdate] = useState({...Fetcher.model(), data: model})

    useEffect(() => {
      Fetcher.show(name, params).then(response => setUpdate(response))
    }, [])

    const submit = () => {
      setUpdate({...update, loading: true})
      return Fetcher.update(name, update.data, records, key).then(response => {
        setUpdate({...update, loading: false})
        return response
      })
    }

    return [
      update,
      (data) => setUpdate({...update, data: {...update.data, ...data}}),
      submit
    ]
  }

  delete(name, params = {}, records = [], key = 'id') {
    const [destroy, setDestroy] = useState({loading: false})

    const submit = (submitParams = {}) => {
      setDestroy({loading: true})
      return Fetcher.delete(name, submitParams, records, key).then(response => {
        setDestroy({loading: false})
        return response
      })
    }

    return [
      destroy,
      submit
    ]
  }

  login(model) {
    const [login, setLogin] = useState({...Fetcher.model(), data: model})

    const submit = () => {
      setLogin({...login, loading: true})
      return Fetcher.login(login.data).then(response => {
        setLogin({...login, data: model, loading: false})
        return response
      })
    }

    return [
      login,
      (data) => setLogin({...login, data: {...login.data, ...data}}),
      submit
    ]
  }

  logout(model) {
    const [logout, setLogout] = useState({...Fetcher.model(), data: model})

    const submit = () => {
      setLogout({...logout, loading: true})
      return Fetcher.logout(logout.data).then(response => {
        setLogout({...logout, data: model, loading: false})
        return response
      })
    }

    return [
      logout,
      (data) => setLogout({...logout, data: {...logout.data, ...data}}),
      submit
    ]
  }

  api(api) {
    this.Fetcher.api(api)
    return this
  }

  bearerToken(bearer_token) {
    this.Fetcher.bearerToken(bearer_token)
    return this
  }
}

export const useApi = (name) => {
  return new Config().api(name)
}

export const useBearerToken = (name) => {
  return new Config().bearerToken(name)
}

export const useIndex = (name, params = {}, records = []) => {
  return new Config().index(name, params, records)
}

export const useShow = (name, params = {}, records = [], key = 'id') => {
  return new Config().show(name, params, records, key)
}

export const useStore = (name, model = {}, records = [], key = 'id') => {
  return new Config().store(name, model, records, key)
}

export const useUpdate = (name, params = {}, model = {}, records = [], key = 'id') => {
  return new Config().update(name, params, model, records, key)
}

export const useDelete = (name, params = {}, records = [], key = 'id') => {
  return new Config().delete(name, params, records, key)
}

export const useLogin = (model = {}) => {
  return new Config().login(model)
}

export const useLogout = (model = {}) => {
  return new Config().logout(model)
}

export {Router, Client}
export default Fetcher
