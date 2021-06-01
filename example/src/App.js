import React from 'react'
import Fetcher, {useIndex, useShow, useStore} from 'rjfa'

Fetcher.base_url = 'https://jsonplaceholder.typicode.com'
Fetcher.router.index('todos', '/todos')
Fetcher.router.show('todo', '/todos/{id}')
Fetcher.router.store('todo', '/todos')
Fetcher.router.update('todo', '/todos/{id}')

export default function App() {
  const todos = useIndex('todos')
  const todo = useShow('todo', {id: 1})
  const {storeTodo, setTodo, submitTodo} = useStore('todo', {
    title: '',
    completed: false
  })

  return <div>
    <p><strong>Todo with ID 1: {todo.data.title}</strong></p>
    <p>Loading todo: {todo.loading ? 'true ' : 'false'}</p>

    <p><strong>{todo.id ? 'Edit' : 'Create'} Todo:</strong></p>
    <form onSubmit={(event) => {
      event.preventDefault()
      submitTodo().then(response => {

      })
    }}>
      <div>
        <label htmlFor={'title'}>Title</label>

        <input
          type={'text'}
          name={'title'}
          id={'title'}
          onChange={(value) => setTodo({title: value.target.value})}
          value={storeTodo.data.title}
        />
      </div>

      <div>
        <label htmlFor={'completed'}>Completed</label>

        <input
          type={'checkbox'}
          name={'completed'}
          id={'completed'}
          onChange={(value) => setTodo({completed: value.target.checked})}
          value={storeTodo.data.completed}
        />
      </div>
      <div>
        <input type={'submit'} name={'submit'} value={todo.id ? 'edit' : 'create'} />
      </div>
    </form>

    <p><strong>Todos:</strong></p>
    <p>Loading todos: {todos.loading ? 'true ' : 'false'}</p>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th style={{textAlign: 'left'}} colSpan={2}>Title</th>
        </tr>
      </thead>
      <tbody>
        {
          todos.data.map((item, index) => <tr key={index}>
            <td>{item.id}</td>
            <td>{item.title || 'unknown'}</td>
            <td>
              <button onClick={() => setTodo(item)}>edit</button>
            </td>
            <td>
              <button onClick={() => {
                // TODO delete todo
              }}>delete
              </button>
            </td>
          </tr>
          )
        }
      </tbody>
    </table>
    <button onClick={() => {
      // TODO load more todos
    }}>load more
    </button>
  </div>
}
