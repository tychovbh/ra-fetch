import App, {Container} from 'next/app'
import Head from 'next/head'
import React from 'react'
import store, {withApiStore, ApiStoreProvider} from 'ra-fetch'

store.router.baseUrl('https://jsonplaceholder.typicode.com')
store.router.index('/todos', 'todos', {wrap: true})
store.router.show('/todos/{id}', 'todo', {wrap: true})
store.router.post('/todos', 'todos', {wrap: true})
store.router.put('/todos/{id}', 'todos', {wrap: true})
store.router.delete('/todos/{id}', 'todos', {wrap: true})

class MyApp extends App {
    render() {
        const {Component, pageProps, store} = this.props

        return <Container>
            <Head>
                <title>Todos</title>
            </Head>
            <ApiStoreProvider store={store}>
                <Component {...pageProps}/>
            </ApiStoreProvider>
        </Container>
    }
}

export default withApiStore(store)(MyApp)
