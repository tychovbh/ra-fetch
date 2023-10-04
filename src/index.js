import {useState, useEffect} from 'react'
import {Fetcher, Router, Client} from 'a-fetch'
import {get} from 'js-expansion'

class Config {
    constructor(api) {
        this.Request = api ? Fetcher.api(api) : Fetcher.request()
        this.setRecords = null
        this._mapping = {}
        this._headers = {}
        this._data = null
    }

    index(name, params = {}, headers = {}) {
        const [indexParams, setIndexParams] = useState({
            params,
            append: false,
            skip: !!this._data,
        })

        const [index, setIndex] = useState({
            ...Fetcher.collection(),
            data: this._data || Fetcher.collection().data,
        })

        useEffect(() => {
            if (indexParams.skip) {
                return
            }

            setIndex({...index, loading: true})
            this.Request.index(name, indexParams.params, headers || this._headers).then(response => {
                if (indexParams.append) {
                    response.data = index.data.concat(response.data)
                }

                setIndex(response)

                if (this.setRecords && response.records) {
                    this.setRecords(response.records)
                }
            })

        }, [indexParams.params])

        return [
            index,
            data => setIndex({...index, data}),
            indexParams.params,
            (params, append = false) => setIndexParams({params, append, skip: false}),
        ]
    }

    show(name, params = {}, headers = {}) {
        const [showParams, setShowParams] = useState(params)
        const [show, setShow] = useState(Fetcher.model())

        useEffect(() => {
            setShow({...show, loading: true})
            this.Request.show(name, showParams, headers || this._headers).then(response => {
                setShow(response)

                if (this.setRecords && response.records) {
                    this.setRecords(response.records)
                }
            })
        }, [showParams])

        return [show, data => setShow({...show, data}), showParams, setShowParams]
    }

    store(name, model = {}, headers = {}) {
        const [store, setStore] = useState({
            ...Fetcher.model(),
            loading: false,
            data: model,
            submitting: false,
        })

        const submit = (submitParams = {}) => {
            setStore({...store, submitting: true})
            const data = {...store.data, ...submitParams}
            return this.Request.store(name, data, headers || this._headers)
                .then(response => {
                    const errors = response.errors || []
                    setStore({
                        ...store,
                        ...response,
                        errors,
                        data: response.errors.length ? {...data} :{...data, ...this.getData(response.data, model)},
                        submitting: false,
                    })

                    if (this.setRecords && response.records) {
                        this.setRecords(response.records)
                    }

                    return response
                })
        }

        return [
            store,
            (data, errors = null) => setStore({
                ...store,
                errors: Array.isArray(errors) ? errors : store.errors,
                data: {
                    ...store.data,
                    ...data,
                },
            }),
            submit,
        ]
    }

    getData(response, model, data = {}) {
        Object.keys(model).map((name) => {
            if (this._mapping[name]) {
                if (typeof this._mapping[name] === 'function') {
                    data[name] = this._mapping[name](response)
                } else {
                    data[name] = get(response, this._mapping[name]) || ''
                }
            } else if (response.hasOwnProperty(name)) {
                if (
                    model[name] &&
                    !Array.isArray(model[name]) &&
                    typeof model[name] === 'object' &&
                    Object.keys(model).length > 0
                ) {
                    data[name] = this.getData(response[name], model[name])
                } else {
                    data[name] = response[name]
                }
            }
        })

        return data
    }

    update(name, model = {}, params = {}, headers = {}) {
        const hasParams = Object.keys(params).length
        const [update, setUpdate] = useState({...Fetcher.model(), loading: hasParams, data: model})
        const updateData = (data, errors = null) => setUpdate({
            ...update,
            loading: false,
            submitting: false,
            errors: Array.isArray(errors) ? errors : update.errors,
            data: {...update.data, ...data},
        })

        if (hasParams) {
            useEffect(() => {
                this.Request.show(name, params, headers || this._headers).then(response => {
                    updateData(this.getData(response.data, model))
                })
            }, [])
        }

        const submit = (submitParams = {}) => {
            setUpdate({...update, errors: [], submitting: true})
            const data = {...update.data, ...submitParams}
            return this.Request.update(name, data, headers || this._headers).then(response => {
                setUpdate({
                    ...update,
                    ...response,
                    errors: response.errors || [],
                    data: {...data, ...this.getData(response.data, model)},
                    submitting: false,
                })

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

    delete(name, params = {}, headers = {}) {
        const [destroy, setDestroy] = useState({loading: false, submitting: false})

        const submit = (submitParams = {}) => {
            setDestroy({submitting: true})
            return this.Request.delete(name, {...params, ...submitParams}, headers || this._headers).then(response => {
                setDestroy({submitting: false})

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

    login(model, headers = {}) {
        const [login, setLogin] = useState({
            ...Fetcher.model(),
            loading: false,
            submitting: false,
            data: model,
        })

        const submit = (submitParams = {}) => {
            setLogin({...login, submitting: true})
            return this.Request.login({...login.data, ...submitParams}, headers || this._headers).then(response => {
                setLogin({...login, ...response, data: login.data, submitting: false})
                return response
            })
        }

        return [
            login,
            (data) => setLogin({...login, data: {...login.data, ...data}}),
            submit,
        ]
    }

    logout(model, headers = {}) {
        const [logout, setLogout] = useState({
            ...Fetcher.model(),
            loading: false,
            submitting: false,
            data: model,
        })

        const submit = () => {
            setLogout({...logout, submitting: true})
            return this.Request.logout(logout.data, headers || this._headers).then(response => {
                setLogout({...logout, ...response, data: model, submitting: false})
                return response
            })
        }

        return [
            logout,
            (data) => setLogout({...logout, data: {...logout.data, ...data}}),
            submit,
        ]
    }

    data(data) {
        this._data = data
        return this
    }

    records(setRecords = null, records = [], value_key = 'id', records_key = 'id') {
        this.setRecords = setRecords
        this.Request.records(records, value_key, records_key)
        return this
    }

    mapping(mapping = {}) {
        this._mapping = mapping
        return this
    }

    headers(headers = {}) {
        this._headers = headers
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
    return new Config(name)
}

export const useBearerToken = (name) => {
    return new Config().bearerToken(name)
}

export const useRecords = (setRecords = null, records = [], key = 'id') => {
    return new Config().records(setRecords, records, key)
}

export const useData = (data) => {
    return new Config().data(data)
}

export const useMapping = (mapping = {}) => {
    return new Config().mapping(mapping)
}

export const useHeaders = (headers = {}) => {
    return new Config().headers(headers)
}

export const useIndex = (name, params = {}, headers = {}) => {
    return new Config().index(name, params, headers)
}

export const useShow = (name, params = {}, headers = {}) => {
    return new Config().show(name, params, headers)
}

export const useStore = (name, model = {}, headers = {}) => {
    return new Config().store(name, model, headers)
}

export const useUpdate = (name, model = {}, params = {}, headers = {}) => {
    return new Config().update(name, model, params, headers)
}

export const useDelete = (name, params = {}, headers = {}) => {
    return new Config().delete(name, params, headers)
}

export const useLogin = (model = {}, headers = {}) => {
    return new Config().login(model, headers)
}

export const useLogout = (model = {}, headers = {}) => {
    return new Config().logout(model, headers)
}

export {Fetcher, Router, Client}
