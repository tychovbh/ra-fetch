import React, {useState, useEffect} from 'react'
import Fetcher from 'jfa'
import 'js-expansion'

export const useIndex = (name, params = {}, records = []) => {
  const [data, setData] = useState(Fetcher.collection)

  useEffect(() => {
    Fetcher.index(name, params, records).then(response => setData(response))
  }, [])

  return data
}

export const useShow = (name, params = {}) => {
  const [data, setData] = useState(Fetcher.model)

  useEffect(() => {
    Fetcher.show(name, params).then(response => setData(response))
  }, [])

  return data
}

export const useStore = (name, model = {}, records = [], key = 'id') => {
  const title = name.ucfirst()
  const [store, setStore] = useState({...Fetcher.model, data: model})

  const submit = () => {
    setStore({...store, loading: true})
    return Fetcher.store(name, store.data, records, key).then(response => {
      setStore({...store, data: model, loading: false})
      return response
    })
  }

  return {
    [`store${title}`]: store,
    [`set${title}`]: (data) => setStore({...store, data: {...store.data, ...data}}),
    [`submit${title}`]: submit,
  }
}

export default Fetcher
